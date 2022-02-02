import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { loginUser } from "../../actions/userActions";
import { connect } from "react-redux";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
    this.loginUser = this.loginUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  loginUser = (event) => {
    event.preventDefault();
    const user = {
      email: this.state.email,
      password: this.state.password
    }
    this.props.loginUser(user);
  };

  handleChange = (e) => {
    console.log(e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Form>
        <FormGroup>
          <Label for="userEMail">Email</Label>
          <Input
            type="email"
            name="email"
            id="userEMail"
            onChange={this.handleChange}
            placeholder="Enter your Email"
          />
        </FormGroup>
        <FormGroup>
          <Label for="userPassword">Password</Label>
          <Input
            type="password"
            name="password"
            id="userPassword"
            onChange={this.handleChange}
            placeholder="Enter your password"
          />
        </FormGroup>
        <Button onClick={this.loginUser}>Login</Button>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { loginUser })(LoginPage);
