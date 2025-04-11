/**
 * Processes data for Sankey diagram visualization
 * 
 * @param {Array} fullData Full dataset containing trend information
 * @param {Array} selectedYears Years selected for visualization
 * @returns {Object} Processed data for Sankey diagram with labels, node positions, and groups
 */
export function processDataForSankey(fullData, selectedYears) {
    if (!fullData || !selectedYears || selectedYears.length < 2) {
      console.error("Invalid data for Sankey processing");
      return null;
    }
  
    try {
      // Define nodes for the diagram
      const labels = [];
      const nodePositions = {};
      let idx = 0;
  
      // Create nodes for each selected year and possible trend (W/L)
      selectedYears.forEach((year) => {
        ["W", "L"].forEach((trend) => {
          const label = `${year} - ${trend}`;
          // Only add node if data exists for this year/trend combination
          const hasData = fullData.some(
            (row) => String(row[`trend_${year}`]) === trend
          );
          if (hasData) {
            if (!nodePositions.hasOwnProperty(`${year}-${trend}`)) {
              labels.push(label);
              nodePositions[`${year}-${trend}`] = idx;
              idx++;
            }
          }
        });
      });
  
      if (labels.length === 0) {
        console.error("No valid nodes could be created. Check trend column data (should contain 'W' or 'L').");
        return null;
      }
  
      // Create a unique group ID for each valid combination of trends across selected years
      const validData = fullData
        .map((row) => {
          const trendValues = selectedYears.map((year) => {
            const trend = String(row[`trend_${year}`]); // Ensure string comparison
            return trend === "W" || trend === "L" ? trend : null; // Only W or L are valid
          });
  
          // Only include rows where all selected years have a valid trend (W/L)
          if (trendValues.every((t) => t !== null)) {
            return { ...row, sankey_group_id: trendValues.join("-") };
          }
          return null; // Exclude rows with missing/invalid trends for selected years
        })
        .filter((row) => row !== null); // Remove null entries
  
      if (validData.length === 0) {
        console.warn("No rows found with valid trend data ('W' or 'L') for all selected years.");
        return { labels, nodePositions, sankeyGroups: [] }; // Return empty groups
      }
  
      // Count items in each valid group and assign a color
      const groupedByTrend = groupByProperty(validData, "sankey_group_id");
      const sankeyGroups = Object.entries(groupedByTrend).map(([groupId, rows]) => ({
        groupId,
        count: rows.length,
        color: getRandomColor(), // Assign random color
      }));
  
      return { labels, nodePositions, sankeyGroups };
    } catch (error) {
      console.error("Error processing Sankey data:", error);
      return null;
    }
  }
  
  /**
   * Groups an array of objects by a specific property
   * 
   * @param {Array} array Array of objects to group
   * @param {string} property Property to group by
   * @returns {Object} Grouped objects
   */
  function groupByProperty(array, property) {
    return array.reduce((result, item) => {
      const key = item[property];
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
      return result;
    }, {});
  }
  
  /**
   * Generates a random color with default opacity
   * 
   * @param {number} opacity Opacity value (0-1), defaults to 1
   * @returns {string} CSS color string in rgba format
   */
  export function getRandomColor(opacity = 1) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }