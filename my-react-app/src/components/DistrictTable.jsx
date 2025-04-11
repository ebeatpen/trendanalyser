import React from 'react';

/**
 * District Table component
 * Displays district-wise AC count information
 * 
 * @param {Object} props Component props
 * @param {Array} props.districtSummary Array of district summary data
 * @param {number} props.total Total AC count
 * @param {Function} props.onSort Callback for column sorting
 * @param {Object} props.currentSort Current sort configuration
 */
function DistrictTable({ districtSummary, total, onSort, currentSort }) {
  if (!districtSummary || districtSummary.length === 0) return null;

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
      <div className="section-title">District-wise AC Count</div>
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
              data-sort="district" 
              onClick={() => onSort('district')}
              className={getSortClass('district')}
            >
              District
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
          {districtSummary.map((item, index) => (
            <tr key={item.district || index}>
              <td>{index + 1}</td>
              <td>{item.district || 'Unknown'}</td>
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

export default DistrictTable;