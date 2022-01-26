import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { signupUser } from '../../actions/userActions';
import Role from '../../helpers/role';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.signupUser = this.signupUser.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      name: "",
      surname: "",
      email: "",
      password1: "",
      password2: "",
      role: Role.User
    }
  }

  signupUser(event) {
    event.preventDefault();
    this.props.signupUser()
  }

  onChange = (e) => {
    console.log(e.target.name)
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Form>
        <FormGroup>
          <Label for="userName">Name</Label>
          <Input type="text" name="name" id="userName" onchange={this.onChange} placeholder="Enter your Username" />
        </FormGroup>
        <FormGroup>
          <Label for="userSurname">Surname</Label>
          <Input type="text" name="surname" id="userSurname" onchange={this.onChange} placeholder="Enter your Surname" />
        </FormGroup>
        <FormGroup>
          <Label for="userEMail">Email</Label>
          <Input type="email" name="email" id="userEMail" onchange={this.onChange} placeholder="Enter your E-Mail" />
        </FormGroup>
        <FormGroup>
          <Label for="userPassword1">Password</Label>
          <Input type="password" name="password1" id="userPassword1" onchange={this.onChange} placeholder="Enter your Password" />
        </FormGroup>
        <FormGroup>
          <Label for="userPassword2">Confirm your Password</Label>
          <Input type="password" name="password2" id="userPassword2" onchange={this.onChange} placeholder="Enter your Password Again" />
        </FormGroup>
        <Button onClick={signupUser}>Sign Up</Button>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps, { signupUser })(SignUp);