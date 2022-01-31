import React from "react";
import "../../style/main.css";
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
        <Navbar color="dark" dark expand="md" light>
          <NavbarBrand href="/">NuhArc</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} />
          <Collapse isOpen={this.state.collapsed} navbar>
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
}

export default NavBar;
