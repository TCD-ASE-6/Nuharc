import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Row,
  Button,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from "reactstrap";

function UpdateIncident() {
  let [incidentList, setIncidentList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("component mounted!");
    getAllIncidents();
  }, []);

  const getAllIncidents = async () => {
    // TODO: add sort by distance
    const incidents = await axios.get("/api/incident/");
    setIncidentList(incidents.data);
    console.log(incidentList);
  };

  const onsubmit = async (incident) => {
    console.log(incident.id);
    const latitude = incident.longitude.$numberDecimal;
    const longitude = incident.latitude.$numberDecimal;
    // TODO: fix API
    // const response = await axios.put("/api/incident/" + id, {});
    // console.log(response);
    navigate("/admin-navigator", { state: { longitude, latitude } });
  };

  return (
    <Container>
      <ListGroup>
        {incidentList.map((incident, i) => (
          <Row className="align-items-center">
            <Col md="10">
              <ListGroupItem key={i}>
                <ListGroupItemHeading key={"head" + i}>
                  {incident.incidentType}{" "}
                </ListGroupItemHeading>
                <ListGroupItemText>
                  Longitude: {incident.longitude.$numberDecimal} Latitude:{" "}
                  {incident.latitude.$numberDecimal}
                </ListGroupItemText>
                <ListGroupItemText>
                  Date: {Date(incident.date)}
                </ListGroupItemText>
              </ListGroupItem>
            </Col>
            <Col>
              {" "}
              <Button color="success" onClick={() => onsubmit(incident)} type="submit">
                Set Active
              </Button>
            </Col>
          </Row>
        ))}
      </ListGroup>
    </Container>
  );
}

export default UpdateIncident;
