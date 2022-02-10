import React from "react";
import { Navbar } from 'react-bootstrap';
import "../../style/main.css";
import "../../index";
import { Container } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
      <div>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="/">NuhArc</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/map">Map</Nav.Link>
                <Nav.Link href="/report">Report Incident</Nav.Link>
              </Nav>
              <Nav>
                <NavDropdown title="Account" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/login">Log in</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/signup">Sign up</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default NavBar;