export type Label = 'Feature' | 'Bug' | 'Issue' | 'Undefined';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string; // file extension for icon mapping
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignees: string[]; // array of TeamMember IDs
  dueDate: string | null; // ISO date string
  label: Label;
  priority: Priority | null;
  checklist: ChecklistItem[];
  attachments: Attachment[];
  coverImage: string | null;
  columnId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string; // URL or data URI
  color: string; // fallback avatar background color
}

export interface Filters {
  search: string;
  assignees: string[];
  labels: Label[];
  dueDateRange: 'all' | 'overdue' | 'today' | 'this-week' | 'this-month';
  priorities: Priority[];
}
