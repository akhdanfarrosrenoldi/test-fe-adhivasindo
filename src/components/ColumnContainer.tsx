import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { IonIcon } from '@ionic/react';
import { addOutline, ellipsisVerticalOutline, expandOutline, contractOutline, createOutline, trashOutline, closeOutline } from 'ionicons/icons';
import { Task, Column } from '../models/types';
import { useTaskStore } from '../store/useTaskStore';
import TaskCard from './TaskCard';
import './ColumnContainer.css';

interface ColumnContainerProps {
  column: Column;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({ column, tasks, onTaskClick, onAddTask }) => {
  const { updateColumn, deleteColumn } = useTaskStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [isExpanded, setIsExpanded] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', column },
  });

  const handleRename = () => {
    if (editTitle.trim()) {
      updateColumn(column.id, editTitle.trim());
    } else {
      setEditTitle(column.title);
    }
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    setShowMenu(false);
  };

  const confirmDelete = () => {
    deleteColumn(column.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`column-container ${isOver ? 'column-container--over' : ''} ${isExpanded ? 'column-container--expanded' : ''}`}>
      {/* Column Header */}
      <div className="column-header">
        <div className="column-header-left">
          {isEditing ? (
            <input
              type="text"
              className="column-title-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') { setEditTitle(column.title); setIsEditing(false); } }}
              autoFocus
            />
          ) : (
            <h3 className="column-title">{column.title}</h3>
          )}
          <span className="column-count">{tasks.length}</span>
          <button className="column-action-btn add-btn-small" onClick={() => onAddTask(column.id)} title="Add task">
            <IonIcon icon={addOutline} />
          </button>
          <div className="column-menu-wrapper">
            <button className="column-action-btn" onClick={() => setShowMenu(!showMenu)} title="More options">
              <IonIcon icon={ellipsisVerticalOutline} />
            </button>
            {showMenu && (
              <>
                <div className="column-menu-backdrop" onClick={() => setShowMenu(false)} />
                <div className="column-menu">
                  <button onClick={() => { setIsEditing(true); setShowMenu(false); }}>
                    <IonIcon icon={createOutline} /><span>Rename</span>
                  </button>
                  <button className="danger" onClick={handleDeleteClick}>
                    <IonIcon icon={trashOutline} /><span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="column-header-actions">
          <button className="column-action-btn expand-btn" title={isExpanded ? "Collapse" : "Expand"} onClick={() => setIsExpanded(!isExpanded)}>
            <IonIcon icon={isExpanded ? contractOutline : expandOutline} />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Banner */}
      {showDeleteConfirm && (
        <div className="column-delete-banner">
          <p>Delete "{column.title}" and all tasks?</p>
          <div className="column-delete-actions">
            <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            <button className="btn-confirm" onClick={confirmDelete}>Delete</button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div ref={setNodeRef} className="column-tasks">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="column-empty">
            <p>No tasks</p>
            <button className="column-empty-add" onClick={() => onAddTask(column.id)}>
              <IonIcon icon={addOutline} />
              <span>Add a task</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ColumnContainer);
