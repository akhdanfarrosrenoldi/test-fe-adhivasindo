import React from 'react';
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
            title={member.name}
          >
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
        );
      })}
      {remaining > 0 && (
        <div className="avatar-item avatar-remaining" style={{ zIndex: 0 }}>
          +{remaining}
        </div>
      )}
      {onAdd && (
        <button className="avatar-add-btn" onClick={onAdd} title="Add assignee">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AvatarGroup;
