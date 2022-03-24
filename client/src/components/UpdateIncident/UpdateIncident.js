import React, { Component, useState } from 'react';

import axios from 'axios';
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';

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
      }

    render (){
        return (
            
            <ListGroup>
                        
          
        
            {this.state.incidents.incidentList.map((incident, i) => (
                <ListGroupItem>
                <ListGroupItemHeading key={i}>{incident.incidentType}</ListGroupItemHeading>
                <ListGroupItemText key={i}>Location: {incident.longitude},{incident.latitude} Dated: {incident.date}
                <Button color="primary" className="float-right">Submit</Button>
                </ListGroupItemText>
                </ListGroupItem>
              ))}
              </ListGroup>
          );
    }
}

export default UpdateIncident;