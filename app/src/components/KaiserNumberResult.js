import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'
import Appointment from './Appointment.js'

class KaiserNumberResult extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    var JSX = []
    this.props.result.forEach((json)=>{
      JSX.push(<Appointment {...json}/>)
    })
    return (
      <ul>
        {JSX}
      </ul>
    );
  }
}


export default KaiserNumberResult;