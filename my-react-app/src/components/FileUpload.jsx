import React from 'react';
import Papa from 'papaparse';

/**
 * File Upload component for handling CSV file uploads
 * 
 * @param {Object} props Component props
 * @param {Function} props.onDataLoaded Callback function when data is successfully parsed
 * @param {boolean} props.isLoading Loading state indicator
 * @param {string|null} props.error Error message if parsing failed
 */
function FileUpload({ onDataLoaded, isLoading, error }) {
  /**
   * Handles file selection and parses CSV data
   * @param {Event} event - The file input change event
   */
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    // Check if it's a CSV file
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      onDataLoaded({ 
        errors: [{ message: "Please select a valid CSV file." }], 
        data: [] 
      });
      return;
    }

    // Parse the CSV file using PapaParse
    Papa.parse(file, {
      header: true,
      dynamicTyping: true, // Convert numeric values to numbers automatically
      skipEmptyLines: true,
      complete: onDataLoaded,
      error: (error) => {
        onDataLoaded({ 
          errors: [{ message: `Parsing error: ${error.message}` }], 
          data: [] 
        });
      }
    });
  };

  return (
    <div className="file-upload-section">
      <p>Please upload your CSV file with trend data:</p>
      <input 
        type="file" 
        id="fileUpload" 
        className="file-upload" 
        accept=".csv" 
        onChange={handleFileSelect}
        disabled={isLoading}
      />
      <p className="upload-note">
        Note: The CSV should contain columns named trend_YYYY (e.g.,
        trend_2011, trend_2016, trend_2021) and optional fields for
        district_name, zone, ac_name, and ac_no.
      </p>
      
      {error && (
        <div className="error">{error}</div>
      )}
    </div>
  );
}

export default FileUpload;