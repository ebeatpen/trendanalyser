import React, { useState, useEffect } from 'react';
import GroupInfo from './GroupInfo';
import ZoneTable from './ZoneTable';
import DistrictTable from './DistrictTable';
import ACTable from './AcTable';
import { createDistrictSummary, createZoneSummary } from '../utils/dataProcessor';

/**
 * Trend Groups Analysis Tab Component
 * Allows selection of trend groups and displays detailed information
 * 
 * @param {Object} props Component props
 * @param {Array} props.groupedData Array of trend groups with data
 */
function GroupsTab({ groupedData }) {
  // State for currently selected group
  const [selectedGroup, setSelectedGroup] = useState(null);
  // State for district and zone summary data
  const [districtSummary, setDistrictSummary] = useState([]);
  const [zoneSummary, setZoneSummary] = useState([]);
  // Current sort configuration for tables
  const [currentSort, setCurrentSort] = useState({
    districtTable: { column: 'count', direction: 'desc' },
    zoneTable: { column: 'count', direction: 'desc' },
    acTable: { column: 'district', direction: 'asc' }
  });

  // Set initial selected group when groupedData is loaded
  useEffect(() => {
    if (groupedData.length > 0 && !selectedGroup) {
      handleGroupChange(groupedData[0].id);
    }
  }, [groupedData]);

  /**
   * Handles group dropdown change
   * @param {string|number} groupId ID of the selected group
   */
  const handleGroupChange = (groupId) => {
    const group = groupedData.find(g => g.id == groupId);
    setSelectedGroup(group);
    
    if (group) {
      // Generate summary data for the selected group
      const districts = createDistrictSummary(group.data);
      const zones = createZoneSummary(group.data);
      
      // Set summary data with initial sorting
      setDistrictSummary(sortData(districts, currentSort.districtTable.column, currentSort.districtTable.direction));
      setZoneSummary(sortData(zones, currentSort.zoneTable.column, currentSort.zoneTable.direction));
    }
  };

  /**
   * Handles table sorting
   * @param {string} tableId ID of the table being sorted
   * @param {string} column Column to sort by
   */
  const handleSort = (tableId, column) => {
    // Get current direction or default to ascending
    const currentDirection = currentSort[tableId]?.column === column 
      ? currentSort[tableId].direction 
      : 'asc';
    
    // Toggle direction if same column clicked again
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    
    // Update sort state
    setCurrentSort(prevSort => ({
      ...prevSort,
      [tableId]: { column, direction: newDirection }
    }));
    
    // Apply sorting to the appropriate data
    if (tableId === 'districtTable') {
      setDistrictSummary(sortData([...districtSummary], column, newDirection));
    } else if (tableId === 'zoneTable') {
      setZoneSummary(sortData([...zoneSummary], column, newDirection));
    }
  };

  /**
   * Sorts data based on column and direction
   * @param {Array} data Data to sort
   * @param {string} column Column to sort by
   * @param {string} direction Sort direction ('asc' or 'desc')
   * @returns {Array} Sorted data
   */
  const sortData = (data, column, direction) => {
    return [...data].sort((a, b) => {
      // Different sorting logic based on column type
      if (column === 'count') {
        return direction === 'asc' ? a.count - b.count : b.count - a.count;
      } else if (column === 'district') {
        return direction === 'asc' 
          ? a.district.localeCompare(b.district) 
          : b.district.localeCompare(a.district);
      } else if (column === 'zone') {
        return direction === 'asc' 
          ? a.zone.localeCompare(b.zone) 
          : b.zone.localeCompare(a.zone);
      }
      return 0;
    });
  };

  return (
    <div className="tab-content">
      {/* Group selection dropdown */}
      <div className="group-selector">
        <select 
          className="dropdown"
          value={selectedGroup?.id || ''}
          onChange={(e) => handleGroupChange(e.target.value)}
        >
          <option value="">Select a group...</option>
          {groupedData.map(group => (
            <option key={group.id} value={group.id}>
              Group {group.id} ({group.trend}) ({group.count})
            </option>
          ))}
        </select>
      </div>

      {/* Group information and tables */}
      {selectedGroup && (
        <>
          <GroupInfo group={selectedGroup} />
          
          <ZoneTable 
            zoneSummary={zoneSummary} 
            total={selectedGroup.count}
            onSort={(column) => handleSort('zoneTable', column)}
            currentSort={currentSort.zoneTable}
          />
          
          <DistrictTable 
            districtSummary={districtSummary} 
            total={selectedGroup.count}
            onSort={(column) => handleSort('districtTable', column)}
            currentSort={currentSort.districtTable}
          />
          
          <ACTable 
            data={selectedGroup.data}
            onSort={(column) => handleSort('acTable', column)}
            currentSort={currentSort.acTable}
          />
        </>
      )}
    </div>
  );
}

export default GroupsTab;