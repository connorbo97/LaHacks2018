import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'

class Appointment extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    var date = new Date()
    date.setTime(this.props.date)
    var json = {
      day:date.getDate().toString().padStart(2, "0"),
      month:date.getMonth().toString().padStart(2, "0"),
      year:date.getFullYear(),
      hour:date.getHours().toString().padStart(2, "0"),
      minute:date.getMinutes().toString().padStart(2, "0"),
      durationHour:Math.floor(this.props.numIntervals*30/60),
      durationMinute:this.props.numIntervals*30%60,
    }
    return (
      <li>
        <b>Date:</b>&nbsp;{json.month}/{json.day}/{json.year} <b>Chair:</b>&nbsp;{this.props.chair} <b>Duration:</b>{json.durationHour > 0 ? (<span>&nbsp;{json.durationHour} hours</span>) : (<span/>)} {json.durationMinute > 0 ? (<span>{json.durationMinute} minutes </span>) : (<span/>)}
      </li>
    );
  }
}


export default Appointment;