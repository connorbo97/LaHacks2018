import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'
import {Button} from 'react-bootstrap'

class SignIn extends Component{
  constructor(props) {
    super(props);
  }

  onSignIn(){
    auth.signInWithGoogle()
  }

  render() {
    return (
      <div>
        <Button bsStyle="success" onClick={this.onSignIn}>Sign In with Google</Button>
      </div>
    );
  }
}


export default SignIn;