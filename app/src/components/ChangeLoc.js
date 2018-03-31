import React, { Component } from 'react';
import { Route } from 'react-router-dom';

class Home extends Component{
  constructor(props) {
    super(props);
  }


  render() {
  	var content=
    return (
      <Route render={({ history}) => (<button type='button' onClick={() => { history.push(this.props.location) }}>{this.props.label}</button>)}/>
    );
  }
}


export default Home;