import React from 'react';
import { Label } from '../models/types';
import './LabelBadge.css';

interface LabelBadgeProps {
  label: Label;
  size?: 'sm' | 'md';
}

const labelColors: Record<Label, { bg: string; text: string }> = {
  Feature: { bg: '#DBEAFE', text: '#2563EB' },
  Bug: { bg: '#FEE2E2', text: '#DC2626' },
  Issue: { bg: '#FEF3C7', text: '#D97706' },
  Undefined: { bg: '#F3F4F6', text: '#6B7280' },
};

const LabelBadge: React.FC<LabelBadgeProps> = ({ label, size = 'sm' }) => {
  const colors = labelColors[label];
  return (
    <span
      className={`label-badge label-badge--${size}`}
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {label}
    </span>
  );
};

export default LabelBadge;
