import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import SankeyTab from './components/SankeyTab';
import GroupsTab from './components/GroupsTab';
import './styles/App.css';

/**
 * Main application component for AC Trend Analysis Tool
 * Manages application state and coordinates between components
 */
function App() {
  // Application state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [activeTab, setActiveTab] = useState('sankeyView'); // Default to Sankey view

  /**
   * Handler for CSV data after successful parsing
   * Processes data and updates application state
   */
  const handleDataLoaded = (results) => {
    try {
      setIsLoading(true);
      
      // Check for parsing errors
      if (results.errors && results.errors.length > 0) {
        const errorMsg = results.errors
          .slice(0, 3)
          .map((e) => `Row ${e.row + 1}: ${e.message}`)
          .join("; ");
        throw new Error(`CSV parsing error(s): ${errorMsg}`);
      }

      const data = results.data;
      
      // Validate data
      if (!data || data.length === 0) {
        throw new Error("No data found in the CSV file.");
      }

      // Check if first row has keys
      if (
        typeof data[0] !== "object" ||
        data[0] === null ||
        Object.keys(data[0]).length === 0
      ) {
        throw new Error(
          "CSV parsing failed to extract headers or data correctly. Ensure the CSV is well-formed."
        );
      }

      // Extract year list from column headers
      const allColumns = Object.keys(data[0]);
      const trendCols = allColumns.filter(
        (key) => typeof key === "string" && key.startsWith("trend_")
      );
      const years = trendCols.map((col) => col.replace("trend_", "")).sort();

      if (years.length === 0) {
        throw new Error(
          'No trend columns found. The CSV must have columns named like "trend_YYYY" (e.g., trend_2011).'
        );
      }

      if (years.length < 2) {
        throw new Error(
          "Need at least two years with trend data (trend_YYYY columns) in the CSV to create a Sankey diagram."
        );
      }

      // Add trend pattern to each row for grouping analysis
      const processedData = data.map(row => {
        const trendValues = years.map((year) => {
          const trend = row[`trend_${year}`];
          return trend === "W" ? "W" : trend === "L" ? "L" : "";
        });
        return {
          ...row,
          trend_pattern: trendValues.join(" ")
        };
      });

      // Group data by trend pattern
      const groupedByTrend = {};
      processedData.forEach(row => {
        if (!groupedByTrend[row.trend_pattern]) {
          groupedByTrend[row.trend_pattern] = [];
        }
        groupedByTrend[row.trend_pattern].push(row);
      });

      // Format groups for dropdown
      const groupData = Object.entries(groupedByTrend).map(([trendPattern, rows], index) => ({
        id: index + 1,
        trend: trendPattern,
        data: rows,
        count: rows.length,
      }));

      // Sort groups by trend pattern
      groupData.sort((a, b) => a.trend.localeCompare(b.trend));

      // Update state with processed data
      setFullData(processedData);
      setYearList(years);
      setGroupedData(groupData);
      setError(null);
    } catch (error) {
      console.error("Error during data processing:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles tab switching
   */
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="container">
      <Header />
      
      {/* File Upload Section */}
      {(!fullData.length || error) && (
        <FileUpload 
          onDataLoaded={handleDataLoaded} 
          isLoading={isLoading} 
          error={error}
        />
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="loading">Processing data...</div>
      )}

      {/* Main Content */}
      {fullData.length > 0 && !isLoading && !error && (
        <div className="main-content">
          {/* Year Order Display */}
          <div className="year-order">
            Year Order: {yearList.join(" → ")}
          </div>

          {/* Tab Navigation */}
          <div className="tabs">
            <div 
              className={`tab ${activeTab === 'sankeyView' ? 'active' : ''}`} 
              onClick={() => handleTabChange('sankeyView')}
            >
              Sankey Diagram
            </div>
            <div 
              className={`tab ${activeTab === 'groupsView' ? 'active' : ''}`}
              onClick={() => handleTabChange('groupsView')}
            >
              Trend Groups Analysis
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'sankeyView' && (
            <SankeyTab 
              fullData={fullData} 
              yearList={yearList} 
            />
          )}
          
          {activeTab === 'groupsView' && (
            <GroupsTab 
              groupedData={groupedData} 
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;