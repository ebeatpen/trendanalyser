import React, { useState, useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { processDataForSankey, getRandomColor } from '../utils/sankeyUtil';

/**
 * Sankey Diagram Tab Component
 * Displays a Sankey diagram showing trend flows between years
 * 
 * @param {Object} props Component props
 * @param {Array} props.fullData Complete dataset with trend information
 * @param {Array} props.yearList List of available years
 */
function SankeyTab({ fullData, yearList }) {
  // State for selected years to display in Sankey diagram
  const [selectedYears, setSelectedYears] = useState([]);
  // Reference to the Sankey diagram div element
  const sankeyRef = useRef(null);

  // Initialize selected years when yearList changes
  useEffect(() => {
    if (yearList.length >= 2) {
      // Default to selecting the first three years (or fewer if not available)
      setSelectedYears(yearList.slice(0, Math.min(3, yearList.length)));
    }
  }, [yearList]);

  // Create or update Sankey diagram when selectedYears change
  useEffect(() => {
    if (selectedYears.length >= 2 && fullData.length > 0 && sankeyRef.current) {
      createSankeyDiagram();
    }
  }, [selectedYears, fullData]);

  /**
   * Handles year checkbox change
   * @param {Event} event Checkbox change event
   */
  const handleYearCheckboxChange = (event) => {
    const year = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      // Add year to selection
      const newSelectedYears = [...selectedYears, year].sort();
      setSelectedYears(newSelectedYears);
    } else {
      // Remove year from selection if there are still at least 2 years selected
      if (selectedYears.length > 2) {
        setSelectedYears(selectedYears.filter(y => y !== year));
      } else {
        // Prevent unchecking if it would leave less than 2 years
        event.target.checked = true;
        alert("Please select at least 2 years for the Sankey diagram.");
      }
    }
  };

  /**
   * Creates the Sankey diagram using Plotly
   */
  const createSankeyDiagram = () => {
    if (!fullData || fullData.length === 0 || selectedYears.length < 2 || !sankeyRef.current) {
      console.warn("Skipping Sankey creation: Insufficient data or years selected.");
      return;
    }

    try {
      // Process data for Sankey diagram
      const sankeyData = processDataForSankey(fullData, selectedYears);
      
      if (!sankeyData) {
        console.error("Failed to process data for Sankey diagram");
        return;
      }

      const { labels, nodePositions, sankeyGroups } = sankeyData;

      if (sankeyGroups.length === 0) {
        console.warn("No valid links found between the selected years.");
        return;
      }

      // Define colors for nodes (W=Green, L=Red)
      const nodeColors = labels.map((label) => {
        if (label.includes("- W")) return "#2ecc71"; // Green for 'W'
        if (label.includes("- L")) return "#e74c3c"; // Red for 'L'
        return "#bdc3c7"; // Default grey
      });

      // Define links between nodes
      let source = [];
      let target = [];
      let value = [];
      let linkColors = [];

      sankeyGroups.forEach((group) => {
        const trends = group.groupId.split("-");

        // Create links between consecutive years
        for (let i = 0; i < selectedYears.length - 1; i++) {
          const sourceNodeKey = `${selectedYears[i]}-${trends[i]}`;
          const targetNodeKey = `${selectedYears[i + 1]}-${trends[i + 1]}`;

          // Ensure nodes exist in nodePositions before adding link
          if (
            nodePositions.hasOwnProperty(sourceNodeKey) &&
            nodePositions.hasOwnProperty(targetNodeKey)
          ) {
            source.push(nodePositions[sourceNodeKey]);
            target.push(nodePositions[targetNodeKey]);
            value.push(group.count);
            linkColors.push(group.color);
          }
        }
      });

      // Check if we have any valid links after filtering
      if (source.length === 0) {
        console.warn("No valid links could be generated for the Sankey diagram.");
        return;
      }

      // Create Sankey diagram data structure
      const data = {
        type: "sankey",
        orientation: "h",
        node: {
          pad: 15,
          thickness: 20,
          line: {
            color: "black",
            width: 0.5,
          },
          label: labels,
          color: nodeColors,
          hoverinfo: "all",
        },
        link: {
          source: source,
          target: target,
          value: value,
          color: linkColors,
          hoverinfo: "all",
          line: {
            color: "rgba(0,0,0,0.2)",
            width: 0.5,
          },
        },
      };

      const layout = {
        title: `AC Trend Flows (${selectedYears.join(" → ")})`,
        font: { size: 10 },
        height: Math.max(500, labels.length * 25),
        margin: { l: 50, r: 50, t: 60, b: 40 },
      };

      // Create or update the Sankey diagram
      Plotly.react(sankeyRef.current, [data], layout, { responsive: true });
      
      // Create legend for Sankey diagram
      createSankeyLegend(sankeyGroups);
    } catch (error) {
      console.error("Error creating Sankey diagram:", error);
    }
  };

  /**
   * Creates legend for Sankey diagram
   * @param {Array} sankeyGroups Groups to display in legend
   */
  const createSankeyLegend = (sankeyGroups) => {
    const legendElement = document.getElementById("legendItems");
    if (!legendElement) return;

    legendElement.innerHTML = ""; // Clear existing legend

    // Sort groups by ID for consistent order
    const sortedGroups = [...sankeyGroups].sort((a, b) =>
      a.groupId.localeCompare(b.groupId)
    );

    // Create legend items
    sortedGroups.forEach((group) => {
      if (group.count === 0) return; // Skip empty groups

      const legendItem = document.createElement("div");
      legendItem.className = "legend-item";

      const colorBox = document.createElement("div");
      colorBox.className = "color-box";
      colorBox.style.backgroundColor = group.color;

      const textSpan = document.createElement("span");
      textSpan.className = "legend-text";
      // Make legend text clearer (e.g., W → L → W)
      const pathText = group.groupId.split("-").join(" → ");
      textSpan.textContent = `Path (${pathText}): ${group.count} ACs`;

      legendItem.appendChild(colorBox);
      legendItem.appendChild(textSpan);
      legendElement.appendChild(legendItem);
    });
  };

  return (
    <div className="tab-content active">
      
      <div className="section sankey-section">
        {/* Year selection checkboxes */}
        <div className="year-selection">
          {yearList.map(year => (
            <label key={year} className="year-checkbox">
              <input
                type="checkbox"
                value={year}
                checked={selectedYears.includes(year)}
                onChange={handleYearCheckboxChange}
              />
              {year}
            </label>
          ))}
        </div>
        
        
        
        {/* Sankey diagram */}
        <div id="sankeyDiagram" ref={sankeyRef}></div>
        
        
        
        {/* Legend */}
        <div className="sankey-legend">
          <div className="legend-title">Trend Groups Legend:</div>
          <div id="legendItems" className="legend-items"></div>
        </div>
      </div>
    </div>
  );
}

export default SankeyTab;