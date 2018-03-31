import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'

class Add extends Component{
  constructor(props) {
    super(props);
  }

  onSignOut(){
    auth.signOut()
  }

  render() {
    return (
      <div>
        <button onClick={this.onSignOut}>Sign Out</button>
      </div>
    );
  }
}


export default SignOut;