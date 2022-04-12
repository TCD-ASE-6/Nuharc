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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { useCookies } from "react-cookie";
import Role from "../../helpers/role";
import API_URL from "../../environment";

// require('dotenv').config();

function UpdateIncident() {
  let [incidentList, setIncidentList] = useState([]);

  // get all cookies
  const [cookies, setCookie, removeCookie] = useCookies(["userDetails"]);
  const [role, setRole] = useState(null);

  // for popup
  const [modal, setModal] = useState(false);
  const togglePopup = () => setModal(!modal);

  // router navigator
  const navigate = useNavigate();

  useEffect(() => {
    console.log("component mounted!");
    getAllIncidents();
  }, []);

  const getAllIncidents = async () => {
    // TODO: add sort by distance
    const incidents = await axios.get(`${API_URL}/api/incident/`);
    setIncidentList(incidents.data);
    console.log(incidentList);
  };

  // get user role to resolve incident
  const getRole = () => {
    // get user details cookie.
    const userDetails = cookies["userDetails"];
    // get role.
    if (userDetails != null) {
      setRole(userDetails.user.role);
    }
  };

  const onsubmit = async (incident) => {
    console.log(incident.id);
    const latitude = incident.longitude.$numberDecimal;
    const longitude = incident.latitude.$numberDecimal;
    navigate("/admin-navigator", { state: { longitude, latitude, incident } });
  };

  const setResolved = async (incident) => {
    // only emergency staff can resolve indidents.
    if (role === Role.EmergencyStaff) {
      let incidentAtDestination = incident;
      incidentAtDestination.active = false;
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incidentAtDestination),
      };
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(
        `${API_URL}/api/incident/${incidentAtDestination._id}`,
        requestOptions
      ).then((response) => {
        getAllIncidents();
      });
      console.log(response);
    } else {
      // if insuffienient permissions then make popup visible.
      togglePopup();
    }
  };

  return (
    <div>
      <Container>
        <br />
        <ListGroup>
          {incidentList.map((incident, i) => (
            <Row className="align-items-center">
              <Col md="10">
                <ListGroupItem key={i} color="secondary">
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
                <ListGroupItem color="secondary">
                  <Button
                    color="primary"
                    block
                    onClick={() => onsubmit(incident)}
                    type="submit"
                  >
                    Set Active
                  </Button>
                  <br />
                  <Button
                    color="success"
                    block
                    onClick={() => setResolved(incident)}
                    type="submit"
                  >
                    Set Resolved
                  </Button>
                </ListGroupItem>
              </Col>
            </Row>
          ))}
        </ListGroup>
      </Container>

      <Modal isOpen={modal} toggle={togglePopup}>
        <ModalHeader toggle={togglePopup}>Unable To Resolve Incident.</ModalHeader>
        <ModalBody>
          Permission Denied.
        </ModalBody>
      </Modal>

    </div>
  );
}

export default UpdateIncident;
