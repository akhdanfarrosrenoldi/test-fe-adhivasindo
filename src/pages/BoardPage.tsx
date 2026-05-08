import React, { useState, useMemo } from 'react';
import { IonPage, IonContent, IonIcon, IonToast } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task } from '../models/types';
import { useTaskStore } from '../store/useTaskStore';
import BoardHeader from '../components/BoardHeader';
import ColumnContainer from '../components/ColumnContainer';
import TaskCard from '../components/TaskCard';
import TaskDetailModal from '../components/TaskDetailModal';
import CreateTaskModal from '../components/CreateTaskModal';
import './BoardPage.css';

const BoardPage: React.FC = () => {
  const { columns, getFilteredTasksByColumn, moveTask, addColumn } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createColumnId, setCreateColumnId] = useState('');
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const columnTasks = useMemo(() => {
    const map: Record<string, Task[]> = {};
    columns.forEach((col) => {
      map[col.id] = getFilteredTasksByColumn(col.id);
    });
    return map;
  }, [columns, getFilteredTasksByColumn]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = active.data.current?.task as Task;
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = active.data.current?.task as Task;
    if (!activeTask) return;

    let targetColumnId: string;
    let newIndex: number;

    if (over.data.current?.type === 'column') {
      // Dropped on a column directly
      targetColumnId = over.id as string;
      newIndex = columnTasks[targetColumnId]?.length || 0;
    } else {
      // Dropped on another task
      const overTask = over.data.current?.task as Task;
      if (!overTask) return;
      targetColumnId = overTask.columnId;
      const targetTasks = columnTasks[targetColumnId] || [];
      newIndex = targetTasks.findIndex((t) => t.id === overTask.id);
      if (newIndex === -1) newIndex = targetTasks.length;
    }

    if (activeTask.id !== over.id || activeTask.columnId !== targetColumnId) {
      moveTask(activeTask.id, targetColumnId, newIndex);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const handleAddTask = (columnId: string) => {
    setCreateColumnId(columnId);
    setShowCreateModal(true);
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle.trim());
      setNewColumnTitle('');
      setShowAddColumn(false);
    }
  };

  // Re-fetch selected task from store to get latest data
  const currentSelectedTask = useTaskStore((s) => s.tasks.find((t) => t.id === selectedTask?.id) || null);

  return (
    <IonPage>
      <IonContent className="board-content" scrollY={false}>
        <BoardHeader />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="board-columns-wrapper">
            <div className="board-columns">
              {columns
                .sort((a, b) => a.order - b.order)
                .map((col) => (
                  <ColumnContainer
                    key={col.id}
                    column={col}
                    tasks={columnTasks[col.id] || []}
                    onTaskClick={handleTaskClick}
                    onAddTask={handleAddTask}
                  />
                ))}

              {/* Add new column */}
              <div className="add-column-area">
                {showAddColumn ? (
                  <div className="add-column-form">
                    <input
                      type="text"
                      placeholder="Column title..."
                      value={newColumnTitle}
                      onChange={(e) => setNewColumnTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddColumn();
                        if (e.key === 'Escape') { setShowAddColumn(false); setNewColumnTitle(''); }
                      }}
                      autoFocus
                    />
                    <div className="add-column-actions">
                      <button className="btn-save" onClick={handleAddColumn}>Add</button>
                      <button className="btn-discard" onClick={() => { setShowAddColumn(false); setNewColumnTitle(''); }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button className="add-column-btn" onClick={() => setShowAddColumn(true)}>
                    <IonIcon icon={addOutline} />
                    <span>Add new List</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="drag-overlay-card">
                <TaskCard task={activeTask} onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <TaskDetailModal
          task={currentSelectedTask}
          isOpen={showDetailModal}
          onClose={() => { setShowDetailModal(false); setSelectedTask(null); }}
        />

        <CreateTaskModal
          isOpen={showCreateModal}
          columnId={createColumnId}
          onClose={() => setShowCreateModal(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default BoardPage;
