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
import { connect } from 'react-redux';


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

  signupUser = (event) => {
    event.preventDefault();
    const newUser = {
      name: this.state.name,
      surname: this.state.surname,
      email: this.state.email,
      role: this.state.role,
      password1: this.state.password1,
      password2: this.state.password2
    }
    this.props.signupUser(newUser);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Form>
        <FormGroup>
          <Label for="userName">Name</Label>
          <Input type="text" name="name" id="userName" onChange={this.onChange} placeholder="Enter your Name" />
        </FormGroup>
        <FormGroup>
          <Label for="userSurname">Surname</Label>
          <Input type="text" name="surname" id="userSurname" onChange={this.onChange} placeholder="Enter your Surname" />
        </FormGroup>
        <FormGroup>
          <Label for="userEMail">Email</Label>
          <Input type="email" name="email" id="userEMail" onChange={this.onChange} placeholder="Enter your Email" />
        </FormGroup>
        <FormGroup>
          <Label for="userPassword1">Enter your Password</Label>
          <Input type="password" name="password1" id="userPassword1" onChange={this.onChange} placeholder="Enter your Password" />
        </FormGroup>
        <FormGroup>
          <Label for="userPassword2">Confirm your Password</Label>
          <Input type="password" name="password2" id="userPassword2" onChange={this.onChange} placeholder="Enter your Password Again" />
        </FormGroup>
        <Button onClick={this.signupUser}>Sign Up</Button>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps, { signupUser })(SignUp);