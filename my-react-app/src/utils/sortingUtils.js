/**
 * Sorting utility functions for table data
 */

/**
 * Sorts an array of objects by a specific string property
 * 
 * @param {Array} data Array of objects to sort
 * @param {string} property Property name to sort by
 * @param {string} direction Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export function sortByString(data, property, direction = 'asc') {
    return [...data].sort((a, b) => {
      const valueA = String(a[property] || '').toLowerCase();
      const valueB = String(b[property] || '').toLowerCase();
      
      return direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  }
  
  /**
   * Sorts an array of objects by a numeric property
   * 
   * @param {Array} data Array of objects to sort
   * @param {string} property Property name to sort by
   * @param {string} direction Sort direction ('asc' or 'desc')
   * @returns {Array} Sorted array
   */
  export function sortByNumber(data, property, direction = 'asc') {
    return [...data].sort((a, b) => {
      // Convert to numbers, use 0 as fallback
      const valueA = Number(a[property]) || 0;
      const valueB = Number(b[property]) || 0;
      
      return direction === 'asc' ? valueA - valueB : valueB - valueA;
    });
  }
  
  /**
   * Generic sorting function that detects type and sorts accordingly
   * 
   * @param {Array} data Array of objects to sort
   * @param {string} property Property name to sort by
   * @param {string} direction Sort direction ('asc' or 'desc')
   * @returns {Array} Sorted array
   */
  export function sortData(data, property, direction = 'asc') {
    if (!data || data.length === 0) return [];
    
    // Get the first non-null value to determine type
    const sampleValue = data.find(item => item[property] !== null && item[property] !== undefined)?.[property];
    
    if (typeof sampleValue === 'number') {
      return sortByNumber(data, property, direction);
    } else {
      return sortByString(data, property, direction);
    }
  }
  
  /**
   * Sorts district table data with special handling
   * 
   * @param {Array} data District data array
   * @param {string} column Column to sort by
   * @param {string} direction Sort direction
   * @returns {Array} Sorted district data
   */
  export function sortDistrictTable(data, column, direction) {
    if (column === 'district') {
      return sortByString(data, 'district', direction);
    } else if (column === 'count') {
      return sortByNumber(data, 'count', direction);
    } else if (column === 'index') {
      // Return original order
      return [...data];
    }
    return data;
  }
  
  /**
   * Sorts zone table data with special handling
   * 
   * @param {Array} data Zone data array
   * @param {string} column Column to sort by
   * @param {string} direction Sort direction
   * @returns {Array} Sorted zone data
   */
  export function sortZoneTable(data, column, direction) {
    if (column === 'zone') {
      return sortByString(data, 'zone', direction);
    } else if (column === 'count') {
      return sortByNumber(data, 'count', direction);
    } else if (column === 'index') {
      // Return original order
      return [...data];
    }
    return data;
  }
  
  /**
   * Sorts AC table data with special handling for multiple columns
   * 
   * @param {Array} data AC data array
   * @param {string} column Column to sort by
   * @param {string} direction Sort direction
   * @returns {Array} Sorted AC data
   */
  export function sortACTable(data, column, direction) {
    if (column === 'zone') {
      return sortByString(data, 'zone', direction);
    } else if (column === 'district') {
      return sortByString(data, 'district_name', direction);
    } else if (column === 'ac') {
      return sortByString(data, 'ac_name', direction);
    } else if (column === 'index') {
      // Return original order
      return [...data];
    }
    return data;
  }