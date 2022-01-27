import React from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';

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
              <Link to="/test">Test</Link>
              <NavItem>
                <NavLink href="#">Map</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">Report Disaster</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Account
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem href="/login">
                  Log in
                </DropdownItem>
                <DropdownItem href="/signup">
                  Sign up
                </DropdownItem>
                <DropdownItem>
                  Test
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            </Nav>
            <NavbarText>Profile Avatar</NavbarText>
          </Collapse>
        </Navbar>  
      </div>
    );
  }
}

export default NavBar;
