import React from 'react';
import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { Label, Priority } from '../models/types';
import { useTaskStore } from '../store/useTaskStore';
import './FilterBar.css';

interface FilterBarProps {
  onClose: () => void;
}

const LABELS: Label[] = ['Feature', 'Bug', 'Issue', 'Undefined'];
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical'];
const DUE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Today' },
  { value: 'this-week', label: 'This Week' },
  { value: 'this-month', label: 'This Month' },
] as const;

const labelColors: Record<Label, string> = {
  Feature: '#3B82F6',
  Bug: '#EF4444',
  Issue: '#F59E0B',
  Undefined: '#9CA3AF',
};

const priorityColors: Record<Priority, string> = {
  Low: '#22C55E',
  Medium: '#F59E0B',
  High: '#EF4444',
  Critical: '#7C3AED',
};

const FilterBar: React.FC<FilterBarProps> = ({ onClose }) => {
  const { filters, setFilters, clearFilters, members } = useTaskStore();

  const toggleLabel = (l: Label) => {
    const current = filters.labels;
    setFilters({ labels: current.includes(l) ? current.filter((x) => x !== l) : [...current, l] });
  };

  const togglePriority = (p: Priority) => {
    const current = filters.priorities;
    setFilters({ priorities: current.includes(p) ? current.filter((x) => x !== p) : [...current, p] });
  };

  const toggleAssignee = (id: string) => {
    const current = filters.assignees;
    setFilters({ assignees: current.includes(id) ? current.filter((x) => x !== id) : [...current, id] });
  };

  const hasFilters = filters.assignees.length > 0 || filters.labels.length > 0 || filters.priorities.length > 0 || filters.dueDateRange !== 'all';

  return (
    <div className="filter-bar">
      <div className="filter-bar-header">
        <h4>Filters</h4>
        <div className="filter-bar-actions">
          {hasFilters && <button className="clear-filters-btn" onClick={clearFilters}>Clear all</button>}
          <button className="filter-close-btn" onClick={onClose}><IonIcon icon={closeOutline} /></button>
        </div>
      </div>

      <div className="filter-groups">
        <div className="filter-group">
          <label className="filter-group-label">Label</label>
          <div className="filter-chips">
            {LABELS.map((l) => (
              <button key={l} className={`filter-chip ${filters.labels.includes(l) ? 'active' : ''}`} onClick={() => toggleLabel(l)} style={filters.labels.includes(l) ? { borderColor: labelColors[l], backgroundColor: labelColors[l] + '18' } : {}}>
                <span className="filter-chip-dot" style={{ backgroundColor: labelColors[l] }} />
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-group-label">Priority</label>
          <div className="filter-chips">
            {PRIORITIES.map((p) => (
              <button key={p} className={`filter-chip ${filters.priorities.includes(p) ? 'active' : ''}`} onClick={() => togglePriority(p)} style={filters.priorities.includes(p) ? { borderColor: priorityColors[p], backgroundColor: priorityColors[p] + '18' } : {}}>
                <span className="filter-chip-dot" style={{ backgroundColor: priorityColors[p] }} />
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-group-label">Due Date</label>
          <div className="filter-chips">
            {DUE_OPTIONS.map((opt) => (
              <button key={opt.value} className={`filter-chip ${filters.dueDateRange === opt.value ? 'active' : ''}`} onClick={() => setFilters({ dueDateRange: opt.value })}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-group-label">Assignee</label>
          <div className="filter-chips">
            {members.map((m) => (
              <button key={m.id} className={`filter-chip ${filters.assignees.includes(m.id) ? 'active' : ''}`} onClick={() => toggleAssignee(m.id)} style={filters.assignees.includes(m.id) ? { borderColor: m.color, backgroundColor: m.color + '18' } : {}}>
                <span className="filter-chip-avatar" style={{ backgroundColor: m.color }}>{m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
                {m.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
