import IncidentMarker from "./IncidentMarker";
import { useSelector } from "react-redux";

const IncidentMarkerList = () => {
  //retrieve current list of incidents from the redux store
  const incidents = useSelector(state => state.incidents);
  return incidents.incidentList.map((incident, i) => (
    <div key={i}>
        <IncidentMarker
        lng={incident.longitude.$numberDecimal}
        lat={incident.latitude.$numberDecimal}
        date={incident.date}
        incidentType={incident.incidentType}
      />
    </div>
  ))
};

export default IncidentMarkerList;