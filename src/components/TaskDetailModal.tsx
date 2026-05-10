import React, { useState, useEffect } from 'react';
import { IonModal, IonIcon, IonToast } from '@ionic/react';
import { closeOutline, createOutline, calendarOutline, imageOutline, documentAttachOutline, trashOutline, checkmarkCircleOutline, documentOutline, documentTextOutline, colorPaletteOutline, barChartOutline, attachOutline } from 'ionicons/icons';
import { Task, Label, Priority } from '../models/types';
import { useTaskStore } from '../store/useTaskStore';
import ChecklistSection from './ChecklistSection';
import AvatarGroup from './AvatarGroup';
import './TaskDetailModal.css';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const LABELS: Label[] = ['Feature', 'Bug', 'Issue', 'Undefined'];
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical'];

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose }) => {
  const { updateTask, deleteTask, addChecklistItem, removeChecklistItem, toggleChecklistItem, updateChecklistItem, addAttachment, removeAttachment, columns, members } = useTaskStore();
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLabel, setEditLabel] = useState<Label>('Undefined');
  const [editPriority, setEditPriority] = useState<Priority | ''>('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editColumnId, setEditColumnId] = useState('');
  const [editAssignees, setEditAssignees] = useState<string[]>([]);
  const [editCoverImage, setEditCoverImage] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('success');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      setEditTitle(task.title);
      setEditDescription(task.description);
      setEditLabel(task.label);
      setEditPriority(task.priority || '');
      setEditDueDate(task.dueDate || '');
      setEditColumnId(task.columnId);
      setEditAssignees([...task.assignees]);
      setEditCoverImage(task.coverImage || '');
      setIsEditingTitle(false);
      setIsEditingDesc(false);
      setShowAssigneeDropdown(false);
      setShowDeleteConfirm(false);
    }
  }, [task?.id, task?.updatedAt, isOpen]);

  if (!task) return null;

  const handleSave = () => {
    updateTask(task.id, { title: editTitle, description: editDescription, label: editLabel, priority: editPriority || null, dueDate: editDueDate || null, columnId: editColumnId, assignees: editAssignees, coverImage: editCoverImage || null });
    setToastMessage('Task updated successfully!');
    setToastColor('success');
    setShowToast(true);
    onClose();
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setToastMessage('Task deleted!');
    setToastColor('danger');
    setShowToast(true);
    onClose();
  };

  const handleMarkComplete = () => {
    const doneCol = columns.find((c) => c.title.toLowerCase() === 'done');
    if (doneCol) {
      updateTask(task.id, { columnId: doneCol.id });
      setEditColumnId(doneCol.id);
      setToastMessage('Task marked as complete!');
      setToastColor('success');
      setShowToast(true);
    }
  };

  const toggleAssignee = (memberId: string) => {
    setEditAssignees((prev) => prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]);
  };

  const handleAddDummyAttachment = () => {
    const names = ['design-spec.pdf', 'wireframe.fig', 'screenshot.png', 'requirements.docx', 'notes.txt', 'data.xlsx'];
    const name = names[Math.floor(Math.random() * names.length)];
    addAttachment(task.id, { name, type: name.split('.').pop() || 'file' });
  };

  const handleAddCoverImage = () => {
    const imgs = [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop',
    ];
    setEditCoverImage(imgs[Math.floor(Math.random() * imgs.length)]);
  };

  const getAttIcon = (t: string) => {
    const map: Record<string, any> = { pdf: documentOutline, doc: documentTextOutline, docx: documentTextOutline, png: imageOutline, jpg: imageOutline, fig: colorPaletteOutline, figma: colorPaletteOutline, xlsx: barChartOutline, csv: barChartOutline, txt: documentTextOutline };
    return map[t] || attachOutline;
  };

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onClose} className="task-detail-modal">
        <div className="modal-content">
          <div className="modal-header">
            <button className="mark-complete-btn" onClick={handleMarkComplete}>
              <IonIcon icon={checkmarkCircleOutline} /><span>Mark Complete</span>
            </button>
            <div className="modal-header-actions">
              <button className="delete-task-btn" onClick={() => setShowDeleteConfirm(true)} title="Delete task"><IonIcon icon={trashOutline} /></button>
              <button className="modal-close-btn" onClick={onClose}><IonIcon icon={closeOutline} /></button>
            </div>
          </div>

          {showDeleteConfirm && (
            <div className="delete-confirm-banner">
              <span>Are you sure you want to delete this task?</span>
              <div className="delete-confirm-actions">
                <button className="btn-danger" onClick={handleDelete}>Delete</button>
                <button className="btn-ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="modal-body">
            <div className="modal-left">
              <div className="cover-image-area">
                {editCoverImage ? (
                  <div className="cover-image-preview">
                    <img src={editCoverImage} alt="Cover" />
                    <button className="cover-image-remove" onClick={() => setEditCoverImage('')}><IonIcon icon={closeOutline} /></button>
                  </div>
                ) : (
                  <button className="cover-image-add" onClick={handleAddCoverImage}>
                    <IonIcon icon={imageOutline} /><span>Add Cover Image</span>
                  </button>
                )}
              </div>

              <div className="field-group title-group">
                {isEditingTitle ? (
                  <input type="text" className="title-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onBlur={() => setIsEditingTitle(false)} onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)} autoFocus />
                ) : (
                  <div className="title-display" onClick={() => setIsEditingTitle(true)}>
                    <h2>{editTitle || 'Untitled Task'}</h2>
                    <IonIcon icon={createOutline} className="edit-icon" />
                  </div>
                )}
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label className="field-label">Assignee</label>
                  <div className="assignee-selector">
                    <AvatarGroup memberIds={editAssignees} maxDisplay={4} size="md" onAdd={() => setShowAssigneeDropdown(!showAssigneeDropdown)} />
                    {showAssigneeDropdown && (
                      <div className="assignee-dropdown">
                        {members.map((m) => (
                          <label key={m.id} className="assignee-option">
                            <input type="checkbox" checked={editAssignees.includes(m.id)} onChange={() => toggleAssignee(m.id)} />
                            <div className="assignee-option-avatar" style={{ backgroundColor: m.color }}>{m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
                            <span>{m.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">Due Date</label>
                  <div className="date-input-wrapper">
                    <input type="date" className="date-input" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
                    <IonIcon icon={calendarOutline} className="date-icon" />
                  </div>
                </div>
              </div>

              <div className="field-row">
                <div className="field-group"><label className="field-label">Board</label><select className="field-select" disabled><option>Adhivasindo</option></select></div>
                <div className="field-group"><label className="field-label">Column</label><select className="field-select" value={editColumnId} onChange={(e) => setEditColumnId(e.target.value)}>{columns.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
              </div>

              <div className="field-row">
                <div className="field-group"><label className="field-label">Label</label><select className="field-select" value={editLabel} onChange={(e) => setEditLabel(e.target.value as Label)}>{LABELS.map((l) => <option key={l} value={l}>{l}</option>)}</select></div>
                <div className="field-group"><label className="field-label">Priority</label><select className="field-select" value={editPriority} onChange={(e) => setEditPriority(e.target.value as Priority | '')}><option value="">None</option>{PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
              </div>

              <div className="field-group">
                <label className="field-label">Description</label>
                <div className="desc-area" onClick={() => !isEditingDesc && setIsEditingDesc(true)}>
                  {isEditingDesc ? (
                    <textarea className="desc-textarea" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} onBlur={() => setIsEditingDesc(false)} autoFocus rows={4} />
                  ) : (
                    <div className="desc-display"><IonIcon icon={createOutline} className="edit-icon" /><p>{editDescription || 'Click to add description...'}</p></div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-right">
              <div className="section-group">
                <h3 className="section-title">Attachments</h3>
                <div className="attachments-area">
                  <div className="attachment-drop-zone" onClick={handleAddDummyAttachment}>
                    <IonIcon icon={documentAttachOutline} /><span>Drag & Drop files here</span><span className="attachment-browse">or <a href="#" onClick={(e) => e.preventDefault()}>browse from device</a></span>
                  </div>
                  {task.attachments.length > 0 && (
                    <div className="attachment-list">
                      {task.attachments.map((att) => (
                        <div key={att.id} className="attachment-item">
                          <IonIcon icon={getAttIcon(att.type)} className="attachment-icon" />
                          <span className="attachment-name">{att.name}</span>
                          <button className="attachment-remove" onClick={() => removeAttachment(task.id, att.id)}><IonIcon icon={closeOutline} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="section-group">
                <ChecklistSection items={task.checklist} onToggle={(id) => toggleChecklistItem(task.id, id)} onAdd={(text) => addChecklistItem(task.id, text)} onRemove={(id) => removeChecklistItem(task.id, id)} onUpdate={(id, text) => updateChecklistItem(task.id, id, text)} />
              </div>
              <div className="section-group">
                <h3 className="section-title">Activity</h3>
                <div className="activity-placeholder"><p className="activity-empty">No activity yet</p></div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-discard" onClick={onClose}>Discard</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        </div>
      </IonModal>
      <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)} message={toastMessage} duration={2500} color={toastColor} position="top" />
    </>
  );
};

export default TaskDetailModal;
