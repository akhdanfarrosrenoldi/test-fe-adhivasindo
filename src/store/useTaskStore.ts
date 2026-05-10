import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task, Column, TeamMember, Filters, ChecklistItem, Attachment, Label, Priority } from '../models/types';
import { defaultColumns, seedTasks, teamMembers as defaultMembers } from '../data/seed';

interface TaskStore {
  // Data
  tasks: Task[];
  columns: Column[];
  members: TeamMember[];
  filters: Filters;
  isSeeded: boolean;

  // Task CRUD
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, targetColumnId: string, newIndex: number) => void;

  // Checklist
  addChecklistItem: (taskId: string, text: string) => void;
  removeChecklistItem: (taskId: string, itemId: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  updateChecklistItem: (taskId: string, itemId: string, text: string) => void;

  // Attachment
  addAttachment: (taskId: string, attachment: Omit<Attachment, 'id'>) => void;
  removeAttachment: (taskId: string, attachmentId: string) => void;

  // Column CRUD
  addColumn: (title: string) => void;
  updateColumn: (id: string, title: string) => void;
  deleteColumn: (id: string) => void;

  // Members
  addMember: (name: string, color?: string) => void;

  // Filters
  setFilters: (filters: Partial<Filters>) => void;
  clearFilters: () => void;

  // Selectors
  getTasksByColumn: (columnId: string) => Task[];
  getFilteredTasksByColumn: (columnId: string) => Task[];

  // Export/Import
  exportData: () => string;
  importData: (json: string) => boolean;

  // Reset
  resetToSeed: () => void;
}

const defaultFilters: Filters = {
  search: '',
  assignees: [],
  labels: [],
  dueDateRange: 'all',
  priorities: [],
};

function applyFilters(tasks: Task[], filters: Filters): Task[] {
  let filtered = [...tasks];

  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }

  // Assignee filter
  if (filters.assignees.length > 0) {
    filtered = filtered.filter((t) =>
      t.assignees.some((a) => filters.assignees.includes(a))
    );
  }

  // Label filter
  if (filters.labels.length > 0) {
    filtered = filtered.filter((t) => filters.labels.includes(t.label));
  }

  // Priority filter
  if (filters.priorities.length > 0) {
    filtered = filtered.filter((t) => t.priority && filters.priorities.includes(t.priority));
  }

  // Due date range filter
  if (filters.dueDateRange !== 'all') {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    filtered = filtered.filter((t) => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);

      switch (filters.dueDateRange) {
        case 'overdue':
          return due < today;
        case 'today':
          return due.toDateString() === today.toDateString();
        case 'this-week': {
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + (7 - weekEnd.getDay()));
          return due >= today && due <= weekEnd;
        }
        case 'this-month': {
          return (
            due.getMonth() === today.getMonth() &&
            due.getFullYear() === today.getFullYear() &&
            due >= today
          );
        }
        default:
          return true;
      }
    });
  }

  return filtered;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: seedTasks,
      columns: defaultColumns,
      members: defaultMembers,
      filters: defaultFilters,
      isSeeded: true,

      addTask: (taskData) => {
        const columnTasks = get().tasks.filter((t) => t.columnId === taskData.columnId);
        const newTask: Task = {
          ...taskData,
          id: uuidv4(),
          order: columnTasks.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        return newTask;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      moveTask: (taskId, targetColumnId, newIndex) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;

          const otherTasks = state.tasks.filter((t) => t.id !== taskId);
          const targetTasks = otherTasks
            .filter((t) => t.columnId === targetColumnId)
            .sort((a, b) => a.order - b.order);

          // Insert at new index
          targetTasks.splice(newIndex, 0, {
            ...task,
            columnId: targetColumnId,
            updatedAt: new Date().toISOString(),
          });

          // Re-order
          const reorderedTarget = targetTasks.map((t, i) => ({ ...t, order: i }));

          const finalTasks = otherTasks
            .filter((t) => t.columnId !== targetColumnId)
            .concat(reorderedTarget);

          return { tasks: finalTasks };
        });
      },

      addChecklistItem: (taskId, text) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  checklist: [...t.checklist, { id: uuidv4(), text, checked: false }],
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      removeChecklistItem: (taskId, itemId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  checklist: t.checklist.filter((c) => c.id !== itemId),
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      toggleChecklistItem: (taskId, itemId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  checklist: t.checklist.map((c) =>
                    c.id === itemId ? { ...c, checked: !c.checked } : c
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      updateChecklistItem: (taskId, itemId, text) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  checklist: t.checklist.map((c) =>
                    c.id === itemId ? { ...c, text } : c
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      addAttachment: (taskId, attachment) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  attachments: [...t.attachments, { ...attachment, id: uuidv4() }],
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      removeAttachment: (taskId, attachmentId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  attachments: t.attachments.filter((a) => a.id !== attachmentId),
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      addColumn: (title) => {
        set((state) => ({
          columns: [
            ...state.columns,
            { id: `col-${uuidv4().slice(0, 8)}`, title, order: state.columns.length },
          ],
        }));
      },

      updateColumn: (id, title) => {
        set((state) => ({
          columns: state.columns.map((c) => (c.id === id ? { ...c, title } : c)),
        }));
      },

      deleteColumn: (id) => {
        set((state) => ({
          columns: state.columns.filter((c) => c.id !== id),
          tasks: state.tasks.filter((t) => t.columnId !== id),
        }));
      },

      addMember: (name, color) => {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#ff9800', '#ff5722'];
        const randomColor = color || colors[Math.floor(Math.random() * colors.length)];
        const newMember: TeamMember = {
          id: uuidv4(),
          name,
          avatar: '',
          color: randomColor,
        };
        set((state) => ({ members: [...state.members, newMember] }));
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      clearFilters: () => {
        set({ filters: defaultFilters });
      },

      getTasksByColumn: (columnId) => {
        return get()
          .tasks.filter((t) => t.columnId === columnId)
          .sort((a, b) => a.order - b.order);
      },

      getFilteredTasksByColumn: (columnId) => {
        const { tasks, filters } = get();
        const columnTasks = tasks
          .filter((t) => t.columnId === columnId)
          .sort((a, b) => a.order - b.order);
        return applyFilters(columnTasks, filters);
      },

      exportData: () => {
        const { tasks, columns, members } = get();
        return JSON.stringify({ tasks, columns, members }, null, 2);
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          if (data.tasks && data.columns) {
            set({
              tasks: data.tasks,
              columns: data.columns,
              members: data.members || get().members,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      resetToSeed: () => {
        set({
          tasks: seedTasks,
          columns: defaultColumns,
          members: defaultMembers,
          filters: defaultFilters,
        });
      },
    }),
    {
      name: 'adhivasindo-task-board',
      partialize: (state) => ({
        tasks: state.tasks,
        columns: state.columns,
        members: state.members,
        isSeeded: state.isSeeded,
      }),
    }
  )
);
