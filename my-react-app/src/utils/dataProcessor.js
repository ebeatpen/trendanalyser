/**
 * Creates district summary from group data
 * Counts ACs by district name for table display
 * 
 * @param {Array} data Array of AC data with district_name field
 * @returns {Array} Array of objects with district and count
 */
export function createDistrictSummary(data) {
    if (!data || data.length === 0) return [];
  
    // Create a map of district counts
    const districtCounts = {};
    
    data.forEach(row => {
      const district = row.district_name || 'Unknown';
      if (!districtCounts[district]) {
        districtCounts[district] = 0;
      }
      districtCounts[district]++;
    });
  
    // Convert to array of objects
    return Object.entries(districtCounts).map(([district, count]) => ({
      district,
      count
    }));
  }
  
  /**
   * Creates zone summary from group data
   * Counts ACs by zone for table display
   * 
   * @param {Array} data Array of AC data with zone field
   * @returns {Array} Array of objects with zone and count
   */
  export function createZoneSummary(data) {
    if (!data || data.length === 0) return [];
  
    // Create a map of zone counts
    const zoneCounts = {};
    
    data.forEach(row => {
      const zone = row.zone || 'Unknown';
      if (!zoneCounts[zone]) {
        zoneCounts[zone] = 0;
      }
      zoneCounts[zone]++;
    });
  
    // Convert to array of objects
    return Object.entries(zoneCounts).map(([zone, count]) => ({
      zone,
      count
    }));
  }
  
  /**
   * Groups array of objects by a property
   * 
   * @param {Array} array Array of objects to group
   * @param {string} key Property to group by
   * @returns {Object} Object with groups
   */
  export function groupBy(array, key) {
    return array.reduce((result, item) => {
      const groupKey = item[key] || 'unknown';
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});
  }
  
  /**
   * Sorts an array of objects by a specific property
   * 
   * @param {Array} array Array to sort
   * @param {string} key Property to sort by
   * @param {boolean} ascending Sort in ascending order if true
   * @returns {Array} Sorted array
   */
  export function sortByProperty(array, key, ascending = true) {
    return [...array].sort((a, b) => {
      // Handle numeric values
      if (typeof a[key] === 'number' && typeof b[key] === 'number') {
        return ascending ? a[key] - b[key] : b[key] - a[key];
      }
      
      // Handle string values (case-insensitive)
      const valueA = String(a[key] || '').toLowerCase();
      const valueB = String(b[key] || '').toLowerCase();
      return ascending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
  }