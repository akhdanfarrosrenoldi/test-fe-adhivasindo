import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IonIcon } from '@ionic/react';
import { calendarOutline, checkboxOutline, expandOutline, attachOutline } from 'ionicons/icons';
import { Task } from '../models/types';
import LabelBadge from './LabelBadge';
import AvatarGroup from './AvatarGroup';
import { format } from 'date-fns';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const checkedCount = task.checklist.filter((c) => c.checked).length;
  const totalCount = task.checklist.length;

  const getProgress = () => {
    if (!task.checklist || task.checklist.length === 0) return 0;
    const completed = task.checklist.filter(i => i.checked).length;
    return (completed / task.checklist.length) * 100;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card ${isDragging ? 'task-card--dragging' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Cover image */}
      {task.coverImage && (
        <div className="task-card__cover">
          <img src={task.coverImage} alt="" />
        </div>
      )}

      {/* Label and Progress */}
      <div className="task-card__label-wrapper">
        <div className="task-card__label">
          <LabelBadge label={task.label} />
        </div>
        <div className="task-card__progress">
          <div className="task-card__progress-fill" style={{ width: `${getProgress()}%` }}></div>
        </div>
      </div>

      {/* Title */}
      <h4 className="task-card__title">{task.title}</h4>

      {/* Meta row */}
      <div className="task-card__meta">
        {/* Due date */}
        {task.dueDate && (
          <div className="task-card__due">
            <IonIcon icon={calendarOutline} />
            <span>{format(new Date(task.dueDate), 'd MMM')}</span>
          </div>
        )}

        {/* Checklist count */}
        {totalCount > 0 && (
          <div className="task-card__checklist-count">
            <IonIcon icon={checkboxOutline} />
            <span>{checkedCount}/{totalCount}</span>
          </div>
        )}

        {/* Attachment count */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="task-card__attachment-count" title="Attachments">
            <IonIcon icon={attachOutline} />
            <span>{task.attachments.length}</span>
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Assignees */}
        <AvatarGroup memberIds={task.assignees} maxDisplay={3} size="sm" />
      </div>

      {/* Expand icon on hover */}
      <button className="task-card__expand" onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <IonIcon icon={expandOutline} />
      </button>
    </div>
  );
};

export default TaskCard;
