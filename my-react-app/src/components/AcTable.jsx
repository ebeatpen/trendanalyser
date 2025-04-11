import React, { useState, useEffect } from 'react';

/**
 * AC Table component
 * Displays detailed AC (Assembly Constituency) listing
 * 
 * @param {Object} props Component props
 * @param {Array} props.data Array of AC data
 * @param {Function} props.onSort Callback for column sorting
 * @param {Object} props.currentSort Current sort configuration
 */
function ACTable({ data, onSort, currentSort }) {
  const [sortedData, setSortedData] = useState([]);

  // Update sorted data when data or sort configuration changes
  useEffect(() => {
    if (!data || data.length === 0) return;
    
    const newSortedData = [...data].sort((a, b) => {
      const column = currentSort?.column || 'district';
      const direction = currentSort?.direction || 'asc';
      
      if (column === 'zone') {
        return direction === 'asc'
          ? (a.zone || '').localeCompare(b.zone || '')
          : (b.zone || '').localeCompare(a.zone || '');
      } else if (column === 'district') {
        return direction === 'asc'
          ? (a.district_name || '').localeCompare(b.district_name || '')
          : (b.district_name || '').localeCompare(a.district_name || '');
      } else if (column === 'ac') {
        return direction === 'asc'
          ? (a.ac_name || '').localeCompare(b.ac_name || '')
          : (b.ac_name || '').localeCompare(a.ac_name || '');
      }
      return 0;
    });
    
    setSortedData(newSortedData);
  }, [data, currentSort]);

  if (!data || data.length === 0) return null;

  /**
   * Render sort indicator for table headers
   * @param {string} column Column name
   * @returns {string} CSS class for sort indicator
   */
  const getSortClass = (column) => {
    if (currentSort?.column === column) {
      return currentSort.direction === 'asc' ? 'sort-asc' : 'sort-desc';
    }
    return '';
  };

  return (
    <div className="section">
      <div className="section-title">AC Listing</div>
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
              data-sort="district" 
              onClick={() => onSort('district')}
              className={getSortClass('district')}
            >
              District
            </th>
            <th 
              data-sort="ac" 
              onClick={() => onSort('ac')}
              className={getSortClass('ac')}
            >
              AC Name
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => {
            // Get district for alternating colors
            const district = item.district_name || '';
            
            return (
              <tr 
                key={`${item.ac_no || ''}-${index}`}
                className={index % 2 === 0 ? 'district-row-even' : 'district-row-odd'}
              >
                <td>{index + 1}</td>
                <td>{item.zone || ''}</td>
                <td>{item.district_name || ''}</td>
                <td>{`${item.ac_name || ''} (${item.ac_no || ''})`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ACTable;