import React from "react";
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';
import "../../style/main.css";
import "../../index";
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * 
 * While creating the responsive navbar, the examples and suggestions 
 * presented at https://react-bootstrap.github.io/components/navbar/ were used.
 * 
 * #== react-bootstrap ==#
 * 
 * Source: https://react-bootstrap.github.io/components/navbar/
 * 
 */

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
        <Navbar expand="lg" variant="light" bg="light" >
          <Container>
            <Navbar.Brand href="/">NuhArc</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/map">Map</Nav.Link>
                <Nav.Link href="/map3">HereMap</Nav.Link>
                <Nav.Link href="/report">Report Incident</Nav.Link>
              </Nav>
              <Nav>
                <NavDropdown id="collasible-nav-dropdown" title="Account" >
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