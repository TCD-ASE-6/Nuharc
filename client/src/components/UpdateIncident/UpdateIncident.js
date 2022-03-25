import React, { Component, useState } from 'react';

import axios from 'axios';
import { Button, ButtonGroup, Row, Col, ButtonToolbar, Container, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

class UpdateIncident extends Component{
    constructor(props) {
        super(props);
        this.state = {
          incidents: {incidentList: []}
        }
        
        this.setIncidents();
      }
    async setIncidents() {
        const incidents =  await axios.get('/api/incident/')
        this.setState({incidents: {incidentList: incidents.data}})
        console.log(incidents);
      }

      async onsubmit(id) {
        console.log(id);
        const response = await axios.put('/api/incident/'+id, {});
        console.log(response);
      }

    

    render (){
        return (
            <Container>
            <ListGroup>
                
          
        
            {this.state.incidents.incidentList.map((incident, i) => (
                
            <Row className="align-items-center">
            <Col md="10">    
        <ListGroupItem key={i}>
        <ListGroupItemHeading key={"head"+i}>{incident.incidentType} </ListGroupItemHeading>
        <ListGroupItemText>

        Longitude:  {incident.longitude.$numberDecimal} Latitude:  {incident.latitude.$numberDecimal}
        </ListGroupItemText>
        <ListGroupItemText>
        
        Date:  {Date(incident.date)}
        </ListGroupItemText>
          </ListGroupItem>
          </Col>
          <Col > <button onClick={() => this.onsubmit(incident._id)} type="submit">
          Submit
          </button></Col>
          </Row>  

              ))}
              </ListGroup></Container>
          );
    }
}

export default UpdateIncident;