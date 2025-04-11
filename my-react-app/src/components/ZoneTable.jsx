import React from 'react';

/**
 * Zone Table component
 * Displays zone-wise AC count information
 * 
 * @param {Object} props Component props
 * @param {Array} props.zoneSummary Array of zone summary data
 * @param {number} props.total Total AC count
 * @param {Function} props.onSort Callback for column sorting
 * @param {Object} props.currentSort Current sort configuration
 */
function ZoneTable({ zoneSummary, total, onSort, currentSort }) {
  if (!zoneSummary || zoneSummary.length === 0) return null;

  /**
   * Render sort indicator for table headers
   * @param {string} column Column name
   * @returns {string} CSS class for sort indicator
   */
  const getSortClass = (column) => {
    if (currentSort.column === column) {
      return currentSort.direction === 'asc' ? 'sort-asc' : 'sort-desc';
    }
    return '';
  };

  return (
    <div className="section">
      <div className="section-title">Zone-wise AC Count</div>
      <table>
        <thead>
          <tr>
            <th 
              data-sort="index" 
              onClick={() => onSort('index')}
              className={getSortClass('index')}
            >
              S.No
            </th>
            <th 
              data-sort="zone" 
              onClick={() => onSort('zone')}
              className={getSortClass('zone')}
            >
              Zone
            </th>
            <th 
              data-sort="count" 
              onClick={() => onSort('count')}
              className={getSortClass('count')}
            >
              AC Count
            </th>
          </tr>
        </thead>
        <tbody>
          {zoneSummary.map((item, index) => (
            <tr key={item.zone || index}>
              <td>{index + 1}</td>
              <td>{item.zone || 'Unknown'}</td>
              <td>{item.count}</td>
            </tr>
          ))}
          {/* Total row */}
          <tr className="total-row">
            <td colSpan={2} style={{ textAlign: 'right' }}>Total</td>
            <td>{total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ZoneTable;