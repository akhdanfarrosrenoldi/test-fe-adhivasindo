import React from 'react';
import { IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { TeamMember } from '../models/types';
import { useTaskStore } from '../store/useTaskStore';
import './AvatarGroup.css';

interface AvatarGroupProps {
  memberIds: string[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  onAdd?: () => void;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  memberIds,
  maxDisplay = 4,
  size = 'sm',
  onAdd,
}) => {
  const members = useTaskStore((s) => s.members);

  const displayMembers = memberIds.slice(0, maxDisplay);
  const remaining = memberIds.length - maxDisplay;

  const getMember = (id: string): TeamMember | undefined =>
    members.find((m) => m.id === id);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className={`avatar-group avatar-group--${size}`}>
      {displayMembers.map((mId, i) => {
        const member = getMember(mId);
        if (!member) return null;
        return (
          <div
            key={mId}
            className="avatar-item"
            style={{ zIndex: displayMembers.length - i }}
            data-tooltip={member.name}
          >
            <div className="avatar-content">
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="avatar-img" />
              ) : (
                <div
                  className="avatar-initials"
                  style={{ backgroundColor: member.color }}
                >
                  {getInitials(member.name)}
                </div>
              )}
            </div>
          </div>
        );
      })}
      {remaining > 0 && (
        <div 
          className="avatar-item avatar-remaining" 
          style={{ zIndex: 0 }}
          data-tooltip={memberIds.slice(maxDisplay).map(id => getMember(id)?.name).filter(Boolean).join('\n')}
        >
          <div className="avatar-content">
            +{remaining}
          </div>
        </div>
      )}
      {onAdd && (
        <button className="avatar-add-btn" onClick={onAdd} title="Add assignee">
          <IonIcon icon={addOutline} />
        </button>
      )}
    </div>
  );
};

export default React.memo(AvatarGroup);
