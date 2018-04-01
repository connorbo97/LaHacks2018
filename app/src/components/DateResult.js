import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'
import Appointment from './Appointment.js'
import Flexbox from 'flexbox-react';
import {Button, Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl, PageHeader, Alert, ListGroup, Panel} from 'react-bootstrap'

const appColors = ["red", "blue", "purple", "gray", "brown", "orange"]

function sortByKeys(array, key, key2) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        var x2 = a[key2]; var y2 = b[key2];
        return ((x < y) ? -1 : ((x > y) ? 1 : ((x2 < y2) ? -1 : ((x2 > y2) ? 1: 0))));
    });
}

class DateResult extends Component{
  constructor(props) {
    super(props);
    this.state = {
      hideAppointmentDetails:false,
    }
  }

  render() {
    var {result, day, month, year} = this.props

    if(this.props.loading){
      return (<span>Loading search...</span>)
    }
  	let arr = []

    let base = []
    let timeLabels = []
    for(var i=0; i < 49; i++){
      var content = ""
      if(i % 2 == 1){
        content=Math.floor(i/2)
      }
      base.push(<span style={{border:"black 1px solid", width:"100%", height:"26px", color:"white", backgroundColor:"green", fontSize:"16px"}}>{content}</span>)
    }

  	result.forEach((chair, index)=>{
  		var appointments = []
      var copy = base.slice(1)
      chair = sortByKeys(chair, "hour", "minute")
      if(chair.length <= 0)
        return
      var accumulatedApps = [chair[0]]
      accumulatedApps[0].endMinute = ((parseInt(accumulatedApps[0].minute) + 30) % 60).toString().padStart(2,"0")
      accumulatedApps[0].endHour = (accumulatedApps[0].endMinute == "00" ? parseInt(accumulatedApps[0].hour) + 1 : accumulatedApps[0].hour).toString().padStart(2,"0")
      let i =1
      while(i < chair.length){
        var top = accumulatedApps[accumulatedApps.length -1]
        var app = chair[i]
        if(app.kid == top.kid){
          top.endMinute = ((parseInt(top.endMinute) + 30) % 60).toString().padStart(2,"0")
          top.endHour = (top.endMinute == "00" ? parseInt(top.endHour) + 1 : top.endHour).toString().padStart(2,"0")
          accumulatedApps[accumulatedApps.length -1] = top
        } else {
          app.endMinute = ((parseInt(app.minute) + 30) % 60).toString().padStart(2,"0")
          app.endHour = (app.endMinute == "00" ? parseInt(app.hour) + 1 : app.hour).toString().padStart(2,"0")
          accumulatedApps.push(app)
        }
        i++
        // console.log(accumulatedApps[accumulatedApps.length -1])
      }
      accumulatedApps.forEach((json)=>{
        if(!this.state.hideAppointmentDetails)
          appointments.push((<Appointment forDate={true} {...json}/>))
      })
      let colorIndex=-1
      let prevIndex=-1
      chair.forEach((json)=>{
        if(json.kid){
          let halfHour = json.minute == "00" ? 0 : 1
          let newContent = ""
          if(!halfHour){
            newContent = parseInt(json.hour)
          }
          if(json.kid != prevIndex){
            prevIndex = json.kid
            colorIndex++
          }
          copy[parseInt(json.hour)*2+halfHour] = (<span style={{border:"black 1px solid", width:"100%", height:"26px", color:"white", backgroundColor:appColors[colorIndex%appColors.length], fontSize:"16px"}}>{newContent}</span>)
          
        }

      })
		  arr.push((
        <div>
          Chair #{index + 1}:
          <ul>
            <Flexbox >
              {timeLabels}
            </Flexbox>
            <Flexbox >
              {copy}
            </Flexbox>
             {!this.state.hideAppointmentDetails ? (
                <Panel bsStyle="primary">
                  <Panel.Heading>Appointments for Chair</Panel.Heading>
                    <ListGroup>
                      {appointments}
                    </ListGroup>
                  </Panel>) : (<span/>)
              }
          </ul>
        </div>
      ))
  	})

    return (
      <div>
        {this.props.errorMsg.length > 0 ? (<Alert bsStyle="warning">
            {this.props.errorMsg}
          </Alert>) : (<span/>)
        }
        <h2>Date: {month}/{day}/{year}</h2>
        <Button onClick={()=>{this.setState({hideAppointmentDetails:!this.state.hideAppointmentDetails})}}>Hide Appointment Information</Button>
        {arr}
      </div>
    );
  }
}


export default DateResult;