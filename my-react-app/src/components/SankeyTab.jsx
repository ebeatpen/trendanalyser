import React, { useState, useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { processDataForSankey } from '../utils/sankeyUtil';

function SankeyTab({ fullData, yearList }) {
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const sankeyRef = useRef(null);
  const sankeyDataRef = useRef(null);
  const colorMapRef = useRef({});

  // Initialize selected years
  useEffect(() => {
    if (yearList.length >= 2) {
      setSelectedYears(yearList.slice(0, Math.min(3, yearList.length)));
    }
  }, [yearList]);

  // Update diagram when dependencies change
  useEffect(() => {
    if (selectedYears.length >= 2 && fullData.length > 0 && sankeyRef.current) {
      createSankeyDiagram();
    }
  }, [selectedYears, fullData, selectedPath]);

  const handleYearCheckboxChange = (event) => {
    const year = event.target.value;
    if (event.target.checked) {
      setSelectedYears([...selectedYears, year].sort());
    } else if (selectedYears.length > 2) {
      setSelectedYears(selectedYears.filter(y => y !== year));
    } else {
      event.target.checked = true;
      alert("Please select at least 2 years for the Sankey diagram.");
    }
  };

  const updateSankeyHighlight = () => {
    if (!sankeyDataRef.current || !sankeyRef.current) return;

    const { labels, nodePositions, sankeyGroups } = sankeyDataRef.current;

    // Node colors (W=green, L=red, default=grey)
    const nodeColors = labels.map(label => {
      if (label.includes("- W")) return "#2ecc71";
      if (label.includes("- L")) return "#e74c3c";
      return "#bdc3c7";
    });

    // Process links
    let source = [], target = [], value = [], linkColors = [], linkOpacity = [];

    sankeyGroups.forEach(group => {
      const trends = group.groupId.split("-");
      const isSelected = selectedPath === group.groupId;

      // Ensure consistent colors
      if (!colorMapRef.current[group.groupId]) {
        colorMapRef.current[group.groupId] = group.color;
      }
      const pathColor = colorMapRef.current[group.groupId];

      for (let i = 0; i < selectedYears.length - 1; i++) {
        const sourceNodeKey = `${selectedYears[i]}-${trends[i]}`;
        const targetNodeKey = `${selectedYears[i + 1]}-${trends[i + 1]}`;

        if (nodePositions[sourceNodeKey] !== undefined && 
            nodePositions[targetNodeKey] !== undefined) {
          source.push(nodePositions[sourceNodeKey]);
          target.push(nodePositions[targetNodeKey]);
          value.push(group.count);
          
          // Highlight selected path with full color, fade others to light gray
          if (isSelected) {
            linkColors.push(pathColor);
            linkOpacity.push(1);
          } else if (selectedPath) {
            linkColors.push("#e0e0e0"); // Light gray for non-selected when a path is selected
            linkOpacity.push(0.3);
          } else {
            linkColors.push(pathColor);
            linkOpacity.push(1);
          }
        }
      }
    });

    Plotly.react(sankeyRef.current, [{
      type: "sankey",
      orientation: "h",
      node: {
        pad: 15,
        thickness: 20,
        line: { color: "black", width: 0.5 },
        label: labels,
        color: nodeColors,
        hoverinfo: "all"
      },
      link: {
        source: source,
        target: target,
        value: value,
        color: linkColors,
        opacity: linkOpacity,
        hoverinfo: "all",
        line: { color: "rgba(0,0,0,0.2)", width: 0.5 }
      }
    }], {
      title: `AC Trend Flows (${selectedYears.join(" → ")})`,
      font: { size: 10 },
      height: Math.max(500, labels.length * 25),
      margin: { l: 50, r: 50, t: 60, b: 40 }
    }, { responsive: true });
  };

  const createSankeyDiagram = () => {
    if (!fullData || fullData.length === 0 || selectedYears.length < 2) return;

    try {
      const sankeyData = processDataForSankey(fullData, selectedYears);
      if (!sankeyData) return;

      sankeyDataRef.current = sankeyData;
      updateSankeyHighlight();
      createSankeyLegend(sankeyData.sankeyGroups);
    } catch (error) {
      console.error("Error creating Sankey diagram:", error);
    }
  };

  const createSankeyLegend = (sankeyGroups) => {
    const legendElement = document.getElementById("legendItems");
    if (!legendElement) return;

    legendElement.innerHTML = "";

    sankeyGroups
      .sort((a, b) => a.groupId.localeCompare(b.groupId))
      .forEach(group => {
        if (group.count === 0) return;

        const legendItem = document.createElement("div");
        legendItem.className = `legend-item ${selectedPath === group.groupId ? 'selected' : ''}`;
        legendItem.onclick = () => setSelectedPath(
          selectedPath === group.groupId ? null : group.groupId
        );

        const colorBox = document.createElement("div");
        colorBox.className = "color-box";
        colorBox.style.backgroundColor = colorMapRef.current[group.groupId] || group.color;

        const textSpan = document.createElement("span");
        textSpan.className = "legend-text";
        textSpan.textContent = `Group (${group.groupId.split("-").join(" → ")  }): ${group.count} ACs`;

        legendItem.append(colorBox, textSpan);
        legendElement.append(legendItem);
      });
  };

  return (
    <div className="tab-content active">
      <div className="section sankey-section">
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
        <div className='outer-sanky'>
        
        <div id="sankeyDiagram" ref={sankeyRef} />
        
        <div className="sankey-legend">
          <div className="legend-title">Trend Groups Legend (click to highlight):</div>
          <div id="legendItems" className="legend-items" />
          </div>
          </div>
      </div>
    </div>
  );
}

export default SankeyTab;