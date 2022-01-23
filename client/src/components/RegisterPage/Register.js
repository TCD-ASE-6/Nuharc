import React from 'react';
import { 
  Button, 
  Form, 
  FormGroup, 
  Label, 
  Input 
  } from 'reactstrap';

const SignUp = (props) => {
  return (
    <Form>
        <FormGroup>
            <Label for="userName">Name</Label>
            <Input type="text" name="email" id="userName" placeholder="Enter your Username"/>
        </FormGroup>
        <FormGroup>
            <Label for="userSurname">Surname</Label>
            <Input type="text" name="surname" id="userSurname" placeholder="Enter your Surname"/>
        </FormGroup>
        <FormGroup>
            <Label for="userEMail">Email</Label>
            <Input type="email" name="email" id="userEMail" placeholder="Enter your E-Mail"/>
        </FormGroup>
        <FormGroup>
            <Label for="userPassword">Password</Label>
            <Input type="password" name="password" id="userPassword" placeholder="Enter your Password"/>
        </FormGroup>
        <FormGroup>
            <Label for="userPassword">Confirm your Password</Label>
            <Input type="password" name="password" id="userPassword" placeholder="Enter your Password"/>
        </FormGroup>
      <Button>Sign Up</Button>
    </Form>
      );
    }
    export default SignUp;