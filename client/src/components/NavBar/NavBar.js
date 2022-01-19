import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
} from "reactstrap";

function NavBar() {
  return (
    <div>
      <Navbar color="primary" dark expand="sm" light>
        <NavbarBrand href="/">NuhArc</NavbarBrand>
        <NavbarToggler onClick={function noRefCheck() {}} />
        <Collapse navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink href="#">Map</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Report Disaster</NavLink>
            </NavItem>
          </Nav>
          <NavbarText>Profile Avatar</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavBar;