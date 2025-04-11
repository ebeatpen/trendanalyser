import React from 'react';

/**
 * Group Information component
 * Displays summary information about the selected group
 * 
 * @param {Object} props Component props
 * @param {Object} props.group Selected group data
 */
function GroupInfo({ group }) {
  if (!group) return null;

  return (
    <div className="group-info">
      <div className="group-title">Group {group.id}</div>
      <div className="group-trend">Trend: {group.trend}</div>
      <div className="group-count">Total ACs: {group.count}</div>
    </div>
  );
}

export default GroupInfo;