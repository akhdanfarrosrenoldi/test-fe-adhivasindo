import React, { useState, useRef } from 'react';
import { IonIcon, IonToast } from '@ionic/react';
import { funnelOutline, searchOutline, downloadOutline, personAddOutline, closeOutline } from 'ionicons/icons';
import { useTaskStore } from '../store/useTaskStore';
import AvatarGroup from './AvatarGroup';
import FilterBar from './FilterBar';
import './BoardHeader.css';

const BoardHeader: React.FC = () => {
  const { members, filters, setFilters, exportData, importData } = useTaskStore();
  const [showFilter, setShowFilter] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('success');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (val: string) => {
    setSearchValue(val);
    setFilters({ search: val });
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'task-board-export.json';
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
    setToastMessage('Board exported successfully!');
    setToastColor('success');
    setShowToast(true);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const json = ev.target?.result as string;
      const success = importData(json);
      if (success) {
        setToastMessage('Board imported successfully!');
        setToastColor('success');
      } else {
        setToastMessage('Import failed: Invalid file format');
        setToastColor('danger');
      }
      setShowToast(true);
    };
    reader.readAsText(file);
    setShowExportMenu(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const hasActiveFilters = filters.assignees.length > 0 || filters.labels.length > 0 || filters.dueDateRange !== 'all' || filters.priorities.length > 0;

  return (
    <>
      <div className="board-header">
        <div className="board-header-left">
          <div className="board-name">
            <span className="board-icon">🔒</span>
            <span className="board-title">Adhivasindo</span>
            <svg className="board-chevron" width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="board-team">
            <AvatarGroup memberIds={members.map((m) => m.id)} maxDisplay={5} size="md" />
          </div>
          <button className="header-btn">
            <IonIcon icon={personAddOutline} />
            <span>Invite</span>
          </button>
        </div>

        <div className="board-header-right">
          <button className={`header-btn ${hasActiveFilters ? 'active' : ''}`} onClick={() => setShowFilter(!showFilter)}>
            <IonIcon icon={funnelOutline} />
            <span>Filter</span>
            {hasActiveFilters && <span className="filter-dot" />}
          </button>

          <div className="export-wrapper">
            <button className="header-btn" onClick={() => setShowExportMenu(!showExportMenu)}>
              <IonIcon icon={downloadOutline} />
              <span>Export / Import</span>
            </button>
            {showExportMenu && (
              <>
                <div className="export-backdrop" onClick={() => setShowExportMenu(false)} />
                <div className="export-menu">
                  <button onClick={handleExport}>📤 Export as JSON</button>
                  <button onClick={() => fileInputRef.current?.click()}>📥 Import from JSON</button>
                </div>
              </>
            )}
            <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          </div>

          <div className="search-wrapper">
            <IonIcon icon={searchOutline} className="search-icon" />
            <input type="text" className="search-input" placeholder="Search Tasks" value={searchValue} onChange={(e) => handleSearch(e.target.value)} />
            {searchValue && (
              <button className="search-clear" onClick={() => handleSearch('')}><IonIcon icon={closeOutline} /></button>
            )}
          </div>
        </div>
      </div>

      {showFilter && <FilterBar onClose={() => setShowFilter(false)} />}

      <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)} message={toastMessage} duration={2500} color={toastColor} position="top" />
    </>
  );
};

export default BoardHeader;
