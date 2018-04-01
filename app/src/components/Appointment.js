import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {ListGroupItem, Label, Button} from 'react-bootstrap'
import fire from '../firebase/index.js'

class Appointment extends Component{
  constructor(props) {
    super(props);
    this.deleteAppointment = this.deleteAppointment.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  async deleteAppointment(){
    console.log(this.props)
    var {month, year, day, hour, minute, date, numIntervals, chair} = this.props
    await fire.database.ref(`/patients/${this.props.kaiserNumber}/appointments/${date}`).set({})
    let mustCheckLast = (parseInt(minute) == 30) ? true : false
    let i=0;
    while(numIntervals > 0){
      let json = {}
      if(mustCheckLast){
        json.b=null
        mustCheckLast = false
        numIntervals--
      } else if(numIntervals == 1){
        json.a=null
        numIntervals -=1
      } else {
        json.a=null
        json.b=null
        numIntervals -=2
      }
      let newHour = parseInt(hour) + i
      await fire.database.ref(`/dates/${year}/${month}/${day}/chairs/${chair}/timeSlots/${newHour.toString().padStart(2,"0")}`).update(json)
      i+= 1
    }
    if(numIntervals < 0){
      console.log("Error: subtracted too many. Logic is probably wrong")
    }

    this.props.redoSearch()
  }

  handleDelete(){
    if(window.confirm(`Are you sure you want to delete the ${this.props.hour}:${this.props.minute} appointment on ${this.props.month}/${this.props.day}/${this.props.year} for Patient #${this.props.kaiserNumber}?`))
      this.deleteAppointment()
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
         <Button bsStyle="danger" onClick={this.handleDelete}>Delete Appointment</Button>
      </ListGroupItem>
    );
  }
}


export default Appointment;