import React, { useState } from "react";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import "../../style/main.css";
import "../../index";
import "bootstrap/dist/css/bootstrap.min.css";
import { useCookies } from "react-cookie";

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

function NavBar() {
  const [collapsed, setCollapsed] = useState(true);

  // get all cookies
  const [cookies, setCookie, removeCookie] = useCookies(["userDetails"]);
  // get user details cookie.
  const userDetails = cookies["userDetails"];
  let role = null;
  // get role.
  if (userDetails != null) {
    role = userDetails.user.role;
  }

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div>
      <Navbar expand="lg" variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">NuhArc</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/map3">Map</Nav.Link>
              <Nav.Link href="/report">Report Incident</Nav.Link>
              {(role === "admin" || role === "emergency_staff" ? true : false) && (
                <Nav.Link href="/update-incident">Emergency Staff</Nav.Link>
              )}
              {(role === "admin" ? true : false) && (
                <Nav.Link href="/register-service">Register Service</Nav.Link>
              )}
            </Nav>
            <Nav>
              <NavDropdown id="collapsible-nav-dropdown" title="Account">
                {(userDetails == null ? true : false) && (
                  <>
                    <NavDropdown.Item href="/login">Log in</NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                )}
                {(userDetails == null ? true : false) && (
                  <>
                    <NavDropdown.Item href="/signup">Sign up</NavDropdown.Item>
                  </>
                )}
                {(userDetails != null ? true : false) && (
                  <NavDropdown.Item href="/logout">Log out</NavDropdown.Item>
                )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;
