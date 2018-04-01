import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {ListGroupItem, Label} from 'react-bootstrap'
import auth from '../firebase/index.js'

class Appointment extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    var json = this.props
    if(this.props.forDate){
      return( 
        <ListGroupItem header={`Time: ${json.hour}:${json.minute} - ${json.endHour}:${json.endMinute}`}>
          <b>Patient:</b>&nbsp;{json.kid}
        </ListGroupItem>
        )
    }

    return (
      <ListGroupItem>
         <Label style={{fontSize:"16px"}}>{json.month}<b> / </b>{json.day}<b> / </b>{json.year}</Label>&nbsp;<b>Start time:</b>&nbsp;{json.hour}:{json.minute}&nbsp; <b>Chair #:</b>&nbsp;{(json.chair + 1).toString().padStart(2," ")} <b>Duration:</b>{json.durationHour > 0 ? (<span>&nbsp;{json.durationHour} hours</span>) : (<span/>)} {json.durationMinute > 0 ? (<span>{json.durationMinute} minutes </span>) : (<span/>)}
      </ListGroupItem>
    );
  }
}


export default Appointment;