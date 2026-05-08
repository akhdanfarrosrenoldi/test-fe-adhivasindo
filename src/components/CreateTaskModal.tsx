import React, { useState } from 'react';
import { IonModal, IonIcon, IonToast } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { Label, Priority } from '../models/types';
import { useTaskStore } from '../store/useTaskStore';
import './CreateTaskModal.css';

interface CreateTaskModalProps {
  isOpen: boolean;
  columnId: string;
  onClose: () => void;
}

const LABELS: Label[] = ['Feature', 'Bug', 'Issue', 'Undefined'];
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical'];

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, columnId, onClose }) => {
  const { addTask, members, columns } = useTaskStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [label, setLabel] = useState<Label>('Feature');
  const [priority, setPriority] = useState<Priority | ''>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [targetColumnId, setTargetColumnId] = useState(columnId);
  const [showToast, setShowToast] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLabel('Feature');
    setPriority('Medium');
    setDueDate('');
    setSelectedAssignees([]);
    setTargetColumnId(columnId);
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      description,
      assignees: selectedAssignees,
      dueDate: dueDate || null,
      label,
      priority: priority || null,
      checklist: [],
      attachments: [],
      coverImage: null,
      columnId: targetColumnId,
    });
    setShowToast(true);
    resetForm();
    onClose();
  };

  const toggleAssignee = (id: string) => {
    setSelectedAssignees((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);
  };

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={() => { resetForm(); onClose(); }} className="create-task-modal">
        <div className="create-modal-content">
          <div className="create-modal-header">
            <h2>Create New Task</h2>
            <button className="modal-close-btn" onClick={onClose}><IonIcon icon={closeOutline} /></button>
          </div>

          <div className="create-modal-body">
            <div className="create-field">
              <label>Title *</label>
              <input type="text" placeholder="Enter task title..." value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            </div>

            <div className="create-field">
              <label>Description</label>
              <textarea placeholder="Enter description..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>

            <div className="create-field-row">
              <div className="create-field">
                <label>Column</label>
                <select value={targetColumnId} onChange={(e) => setTargetColumnId(e.target.value)}>
                  {columns.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="create-field">
                <label>Label</label>
                <select value={label} onChange={(e) => setLabel(e.target.value as Label)}>
                  {LABELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="create-field-row">
              <div className="create-field">
                <label>Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value as Priority | '')}>
                  <option value="">None</option>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="create-field">
                <label>Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>

            <div className="create-field">
              <label>Assignees</label>
              <div className="create-assignee-grid">
                {members.map((m) => (
                  <label key={m.id} className={`create-assignee-chip ${selectedAssignees.includes(m.id) ? 'selected' : ''}`}>
                    <input type="checkbox" checked={selectedAssignees.includes(m.id)} onChange={() => toggleAssignee(m.id)} />
                    <div className="chip-avatar" style={{ backgroundColor: m.color }}>{m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
                    <span>{m.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="create-modal-footer">
            <button className="btn-discard" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={handleCreate} disabled={!title.trim()}>Create Task</button>
          </div>
        </div>
      </IonModal>
      <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)} message="Task created successfully!" duration={2500} color="success" position="top" />
    </>
  );
};

export default CreateTaskModal;
