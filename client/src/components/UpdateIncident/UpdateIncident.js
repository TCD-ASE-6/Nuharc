
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

// require('dotenv').config();

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
    navigate("/admin-navigator", { state: { longitude, latitude, incident } });
  };

  const setResolved = async (incident) => {
    let incidentAtDestination = incident;
    incidentAtDestination.active = false;
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(incidentAtDestination),
    };
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const response = await fetch(
      `${baseUrl}/api/incident/${incidentAtDestination._id}`,
      requestOptions
    ).then((response) => {
      getAllIncidents();
    });
    console.log(response);
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
              <Button
                color="primary"
                onClick={() => onsubmit(incident)}
                type="submit"
              >
                Set Active
              </Button>
              <Button
                color="success"
                onClick={() => setResolved(incident)}
                type="submit"
              >
                Set Resolved
              </Button>
            </Col>
          </Row>
        ))}
      </ListGroup>
    </Container>
  );
}

export default UpdateIncident;
