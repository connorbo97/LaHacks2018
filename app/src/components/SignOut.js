import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'
import {Button} from 'react-bootstrap'

class SignOut extends Component{
  constructor(props) {
    super(props);
  }

  onSignOut(){
    auth.signOut()
  }

  render() {
    return (
      <div>
        <Button bsStyle="primary" onClick={this.onSignOut}>Sign Out</Button>
      </div>
    );
  }
}


export default SignOut;