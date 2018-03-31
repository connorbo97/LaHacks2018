import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'

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
        <button onClick={this.onSignIn}>Sign In with Google</button>
      </div>
    );
  }
}


export default SignIn;