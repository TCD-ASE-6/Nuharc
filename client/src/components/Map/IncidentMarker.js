import React from "react";
import "./MapStyle.css";
import "../ReportIncident/ReportIncident"

/**
 * Displays a warning about an incident on the map
 *
 */
const IncidentMarker = (props) => {
  const { name,date,incidentType } = props;
  return (
    <div className="incidentMarker" title={name}>
      <span className="incidentMarker-details">Date:{date}{"\n"}Incident:{incidentType}</span>
    </div>
  );
};

export default IncidentMarker;