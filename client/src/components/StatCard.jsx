import React from 'react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  variant = 'purple',
  badgeText,
  badgeType = 'default',
}) {
  return (
    <div className={`stat-card stat-${variant}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className={`stat-card-icon-wrapper icon-${variant}`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="stat-card-body">
        <h3 className="stat-card-value">{value}</h3>
      </div>

      <div className="stat-card-footer">
        {badgeText && (
          <span className={`stat-badge stat-badge-${badgeType}`}>
            {badgeText}
          </span>
        )}
        {subtext && <span className="stat-subtext">{subtext}</span>}
      </div>
    </div>
  );
}
