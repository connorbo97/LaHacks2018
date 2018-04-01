import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'

class Appointment extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    var json = this.props
    if(this.props.forDate){
      return( 
        <li>
          <b>Date:</b>&nbsp;{json.hour}:{json.minute}&nbsp; <b>Patient:</b>&nbsp;{json.kid}
        </li>
        )
    }

    return (
      <li>
        <b>Date:</b>&nbsp;{json.month}/{json.day}/{json.year} {json.hour}:{json.minute}&nbsp; <b>Chair:</b>&nbsp;{json.chair} <b>Duration:</b>{json.durationHour > 0 ? (<span>&nbsp;{json.durationHour} hours</span>) : (<span/>)} {json.durationMinute > 0 ? (<span>{json.durationMinute} minutes </span>) : (<span/>)}
      </li>
    );
  }
}


export default Appointment;