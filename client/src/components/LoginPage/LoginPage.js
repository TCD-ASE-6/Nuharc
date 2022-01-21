import React from 'react';
import { 
  Button, 
  Form, 
  FormGroup, 
  Label, 
  Input 
  } from 'reactstrap';

const LoginPage = (props) => {
  return (
    <Form>
      <FormGroup>
        <Label for="userEMail">Email</Label>
        <Input type="email" name="email" id="userEMail" placeholder="Enter your Username" />
      </FormGroup>
      <FormGroup>
        <Label for="userPassword">Password</Label>
        <Input type="password" name="password" id="userPassword" placeholder="Enter your Password" />
      </FormGroup>
      <Button>Login</Button>
    </Form>
      );
    }
    
    export default LoginPage;