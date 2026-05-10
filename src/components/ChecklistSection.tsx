import React, { useState } from 'react';
import { IonCheckbox, IonIcon } from '@ionic/react';
import { addOutline, trashOutline } from 'ionicons/icons';
import { ChecklistItem } from '../models/types';
import './ChecklistSection.css';

interface ChecklistSectionProps {
  items: ChecklistItem[];
  onToggle: (itemId: string) => void;
  onAdd: (text: string) => void;
  onRemove: (itemId: string) => void;
  onUpdate: (itemId: string, text: string) => void;
}

const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  items,
  onToggle,
  onAdd,
  onRemove,
  onUpdate,
}) => {
  const [newItemText, setNewItemText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const checked = items.filter((i) => i.checked).length;
  const total = items.length;
  const progress = total > 0 ? (checked / total) * 100 : 0;

  const handleAdd = () => {
    if (newItemText.trim()) {
      onAdd(newItemText.trim());
      setNewItemText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewItemText('');
    }
  };

  return (
    <div className="checklist-section">
      <h3 className="checklist-title">Check List</h3>

      {/* Progress bar */}
      <div className="checklist-progress">
        <span className="checklist-progress-text">{checked}/{total}</span>
        <div className="checklist-progress-bar">
          <div
            className="checklist-progress-fill"
            style={{
              width: total === 0 ? '100%' : `${progress}%`,
              backgroundColor: '#3B82F6',
            }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="checklist-items">
        {items.map((item) => (
          <div key={item.id} className={`checklist-item ${item.checked ? 'checked' : ''}`}>
            <IonCheckbox
              checked={item.checked}
              onIonChange={() => onToggle(item.id)}
              className="checklist-checkbox"
            />
            <input
              type="text"
              className={`checklist-item-text ${item.checked ? 'line-through' : ''}`}
              value={item.text}
              onChange={(e) => onUpdate(item.id, e.target.value)}
            />
            <button
              className="checklist-item-delete"
              onClick={() => onRemove(item.id)}
              title="Remove item"
            >
              <IonIcon icon={trashOutline} />
            </button>
          </div>
        ))}
      </div>

      {/* Add subtask */}
      {isAdding ? (
        <div className="checklist-add-form">
          <input
            type="text"
            className="checklist-add-input"
            placeholder="Enter subtask..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="checklist-add-actions">
            <button className="btn-add-subtask" onClick={handleAdd}>
              Add
            </button>
            <button
              className="btn-cancel-subtask"
              onClick={() => {
                setIsAdding(false);
                setNewItemText('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className="checklist-add-btn" onClick={() => setIsAdding(true)}>
          <IonIcon icon={addOutline} />
          <span>Add subtask</span>
        </button>
      )}
    </div>
  );
};

export default ChecklistSection;
