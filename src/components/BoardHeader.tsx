import React, { useState, useRef } from 'react';
import { IonIcon, IonToast } from '@ionic/react';
import { funnelOutline, searchOutline, downloadOutline, pushOutline, personAddOutline, closeOutline, lockClosedOutline, chevronDownOutline, earthOutline } from 'ionicons/icons';
import { useTaskStore } from '../store/useTaskStore';
import AvatarGroup from './AvatarGroup';
import FilterBar from './FilterBar';
import './BoardHeader.css';

const BoardHeader: React.FC = () => {
  const { members, filters, setFilters, exportData, importData, addMember } = useTaskStore();
  const [showFilter, setShowFilter] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showInviteMenu, setShowInviteMenu] = useState(false);
  const [inviteName, setInviteName] = useState('');
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

  const handleInvite = () => {
    if (inviteName.trim()) {
      addMember(inviteName.trim());
      setInviteName('');
      setShowInviteMenu(false);
      setToastMessage(`${inviteName.trim()} invited to the board!`);
      setToastColor('success');
      setShowToast(true);
    }
  };

  const hasActiveFilters = filters.assignees.length > 0 || filters.labels.length > 0 || filters.dueDateRange !== 'all' || filters.priorities.length > 0;

  return (
    <>
      <div className="board-header">
        <div className="board-header-left">
          <div className="board-name">
            <IonIcon icon={lockClosedOutline} className="board-icon" />
            <span className="board-title">Adhivasindo</span>
            <IonIcon icon={chevronDownOutline} className="board-chevron" />
          </div>
          <div className="board-team">
            <AvatarGroup memberIds={members.map((m) => m.id)} maxDisplay={5} size="md" />
          </div>
          <div className="invite-wrapper">
            <button className="header-btn" onClick={() => setShowInviteMenu(!showInviteMenu)}>
              <IonIcon icon={personAddOutline} />
              <span>Invite</span>
            </button>
            {showInviteMenu && (
              <>
                <div className="invite-backdrop" onClick={() => setShowInviteMenu(false)} />
                <div className="invite-menu">
                  <h4>Invite to Board</h4>
                  <input
                    type="text"
                    placeholder="Enter name..."
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleInvite(); if (e.key === 'Escape') setShowInviteMenu(false); }}
                    autoFocus
                  />
                  <div className="invite-actions">
                    <button className="btn-save" onClick={handleInvite} disabled={!inviteName.trim()}>Send Invite</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="board-header-right">
          <button className={`header-btn ${hasActiveFilters ? 'active' : ''}`} onClick={() => setShowFilter(!showFilter)}>
            <IonIcon icon={funnelOutline} />
            <span>Filter</span>
            {hasActiveFilters && <span className="filter-dot" />}
          </button>

          <div className="export-wrapper">
            <button className="header-btn" onClick={() => setShowExportMenu(!showExportMenu)}>
              <IonIcon icon={earthOutline} />
              <span>Export / Import</span>
            </button>
            {showExportMenu && (
              <>
                <div className="export-backdrop" onClick={() => setShowExportMenu(false)} />
                <div className="export-menu">
                  <button onClick={handleExport}><IonIcon icon={pushOutline} /> Export as JSON</button>
                  <button onClick={() => fileInputRef.current?.click()}><IonIcon icon={downloadOutline} /> Import from JSON</button>
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
