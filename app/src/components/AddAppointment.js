import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import fire from '../firebase/index.js'
import DatePicker from 'react-datepicker';
import {Form, FormGroup, ControlLabel, FormControl, Button, Label, Panel} from 'react-bootstrap'
import validator from 'validator'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css';

class AddAppointment extends Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      kaiserNumber:"",
      month:(moment().month() + 1).toString().padStart(2,"0"),
      day:moment().date().toString().padStart(2,"0"),
      year:moment().year().toString().padStart(2,"0"),
      hour:"12",
      halfHour:"00",
      numIntervals:1,
      startDate:moment().hour(12).minute(0),
      preferredChair:"",
      bottomText:"",
      error:false,
    }

    this.onClicked = this.onClicked.bind(this)
    this.isAvailable = this.isAvailable.bind(this)
    this.addToDatabase = this.addToDatabase.bind(this)


  }

  onDateChange = (startDate) => {
    console.log(startDate.date(), startDate.month(), startDate.year(), startDate.hour(), startDate.minute())
    this.setState({startDate, day:startDate.date(), month: startDate.month() + 1, year: startDate.year(), hour:startDate.hour(), halfHour:startDate.minute()})
  }

  setKaiserNumber = (kaiserNumber)=> {
    this.setState({kaiserNumber})
  }

  setError = (error)=> {
    this.setState({error})
  }

  setBottomText = (bottomText)=> {
    this.setState({bottomText})
  }

  setMonth = (month) => {
    this.setState({month})
  }

  setDay = (day) =>{
    this.setState({day})
  }

  setYear = (year) => {
    this.setState({year})
  }

  setHour = (hour) =>{
    this.setState({hour})
  }

  setHalfHour = (halfHour) =>{
    this.setState({halfHour})
  }

  setDurationHour = (durationHour) =>{
    this.setState({durationHour})
  }

  setNumIntervals = (numIntervals) =>{
    this.setState({numIntervals})
  }

  setDurationMinutes = (durationMinutes) =>{
    this.setState({durationMinutes})
  }

  setPreferredChair = (preferredChair) => {
    this.setState({preferredChair})
  }

  checkChair = (chair, json, mustCheckHalf) =>{
    if(!json[chair]){
      return chair
    }
    let temp = json[chair].timeSlots
    let tempNI = this.state.numIntervals
    for(var i=this.state.hour; tempNI > 0 && i < 24; i++){
      let j = i.toString().padStart(2,"0")
      // console.log(temp[j])
      if (temp[j]){
        if(mustCheckHalf){
          if(temp[j].b && temp[j].b.taken != '-1')
              return -1
          tempNI--
          mustCheckHalf = false
        }
        else if(tempNI == 1){
          if(temp[j].a){
            if(temp[j].a.taken == '-1')
              return chair
            else
              return -1
          } else {
            return chair
          }
        } else {
            if(temp[j].a)
              if(temp[j].b)
                if(temp[j].a.taken == '-1' && temp[j].b.taken == '-1')
                  tempNI-=2
                else
                  return -1
              else
                if(temp[j].a.taken == '-1')
                  tempNI-=2
                else
                  return -1
            else if(temp[j].b)
              if(temp[j].b.taken == '-1')
                tempNI-=2
              else
                return -1
        }
      }
      else{
        if(mustCheckHalf){
          mustCheckHalf = false
          tempNI -=1
        }
        else
          tempNI = (tempNI >= 2) ? tempNI-2 : tempNI-1
      }
    }
    if(tempNI < 0)
      console.log("ERROR: checked too many intervals")

    if (tempNI == 0)
      return chair

    return -1

}

  async isAvailable(state)
  {
    var snap = await fire.database.ref(`/dates/${state.year}/${state.month}/${state.day}/chairs`).once('value')

    var mustCheckHalf = parseInt(this.state.halfHour) == 30
    if(!snap.val())
    {
      return 0
    }

    var json = snap.val()

    var checkPreferred = (state.preferredChair.length > 0) ? parseInt(state.preferredChair) - 1 : 0
    console.log(checkPreferred)
    if(checkPreferred != 0){
      let prefAvail = this.checkChair(checkPreferred, json, mustCheckHalf)
      console.log(prefAvail)
      if(prefAvail != -1)
        return prefAvail
    }
    for(var chair=0; chair < 23; chair++){
      let val = this.checkChair(chair, json, mustCheckHalf)
      console.log(val)
      if(val != -1)
        return val
      if(chair == checkPreferred)
        chair++
        
    }
    return -1
  }

  async addToDatabase(chairAvail)
  {
    console.log("adding to database")
    var {day, month, year, hour, halfHour, numIntervals, kaiserNumber} = this.state
    //check if the date is already taken
    var date = new Date()
    date.setDate(parseInt(day))
    date.setMonth(parseInt(month)-1)
    date.setYear(parseInt(year))
    date.setHours(parseInt(hour))
    date.setMinutes(parseInt(halfHour))
    let json = {}
    console.log(chairAvail)
    json[date.getTime()] = {chair:chairAvail,numIntervals:numIntervals}

    //ADD TO PATIENTS
    console.log(json)
    await fire.database.ref(`/patients/${kaiserNumber}/appointments`).update(json)


    //ADD TO DATES
    let mustCheckHalf = parseInt(halfHour) == 30

    let i =0;
    console.log(numIntervals)
    while(numIntervals > 0){
      let tempJSON = {}
      if(numIntervals >= 2){
        if(mustCheckHalf){
          tempJSON = {
            b: {
              taken:kaiserNumber
            }
          }
          mustCheckHalf = false
          numIntervals -= 1
        } else {
          tempJSON = {
            a:{
              taken:kaiserNumber
            },
            b: {
              taken:kaiserNumber
            }
          }
          numIntervals -= 2
        }
      } else {
        if(mustCheckHalf){
          tempJSON = {
            b: {
              taken:kaiserNumber
            }
          }
          mustCheckHalf = false
        } else {
          tempJSON = {
            a:{
              taken:kaiserNumber
            },
          }
        }
        numIntervals -= 1
      }
      console.log(tempJSON)
      let temp = parseInt(hour) + i
      console.log(year, month, day, chairAvail, temp)
      await fire.database.ref(`/dates/${year}/${month}/${day}/chairs/${chairAvail}/timeSlots/${temp.toString().padStart(2,"0")}`).update(tempJSON)
      i++

    }
  }


  async onClicked()
  {
    var {day, month, year, hour, halfHour, numIntervals, kaiserNumber} = this.state
    await this.setState({kaiserNumber:kaiserNumber.padStart(12,"0"), day:day.toString().padStart(2,"0"), month:month.toString().padStart(2,"0"), year:year.toString().padStart(4,"0"), hour:hour.toString().padStart(2,"0"), halfHour:halfHour.toString().padStart(2,"0")})

    var {day, month, year, hour, halfHour, numIntervals, kaiserNumber, preferredChair} = this.state

    if (!validator.isNumeric(kaiserNumber.toString()))
    {
      // alert("Error: Kaiser Number must contain only digits.")
      this.setBottomText("Error: Kaiser Number must contain only digits.")
      this.setError(true)
      return
    }
    if (parseInt(kaiserNumber.toString()) < 0)
    {
      // alert("Error: Kaiser Number must contain 12 digits.")
      this.setBottomText("Error: Kaiser Number must contain 12 digits.")
      this.setError(true)
      return
    }

    let time = moment().hour(parseInt(hour) + numIntervals/2).minute(parseInt(halfHour) + (numIntervals%2)*30)
    console.log(time.hour(), ":",  time.minute())
    if(time.hour() >= 22 || time.hour() <= 7){
      let test = window.confirm(`Appointment will be scheduled past closing time. Are you sure you want to schedule a ${numIntervals} interval appointment on ${month}/${day}/${year} at ${hour}:${halfHour}`)
      if(!test){
        return
      }
    }
    if(preferredChair.length > 0 && (parseInt(preferredChair) <= 0 || parseInt(preferredChair)> 23)){
      // alert("Error: Preferred chair must either be empty or between 1 and 23.")
      this.setBottomText("Error: Preferred chair must either be empty or between 1 and 23.")
      this.setError(true)
      return
    }

    if ( !validator.isNumeric(month.toString())   ||  !validator.isNumeric(year.toString()) ||  !validator.isNumeric(day.toString()) ||  parseInt(month.toString()) < 0 || parseInt(year.toString()) < 0 || parseInt(day.toString()) < 0)
    {
      // alert("Error: Month, Day, and Year must only contain digits.")
      this.setBottomText("Error: Month, Day, and Year must only contain digits.")
      this.setError(true)
      return
    }

    if (!validator.isNumeric(hour.toString())   ||   !validator.isNumeric(halfHour.toString()) )
    {
      // alert("Error: Start time must contain only digits.")
      this.setBottomText("Error: Start time must contain only digits.")
      this.setError(true)
      return
    }


    if (hour.toString().length != 2   ||    halfHour.toString().length != 2)
    {
      // alert("Error: Start time must be in the form XX:XX.")
      this.setBottomText("Error: Start time must be in the form XX:XX.")
      this.setError(true)
      return
    }

    if(parseInt(halfHour) != 0 && parseInt(halfHour) != 30){
      alert("Error: Appointments must start on an hour or half hour. Minutes must be 00 or 30")
      this.setBottomText("Error: Appointments must start on an hour or half hour. Minutes must be 00 or 30")
      this.setError(true)
      return
    }

    //check if the date is already taken
    var chairAvail = await this.isAvailable(this.state)
    console.log(chairAvail)
    if (chairAvail == -1)
    {
      // alert("Error: No time available")
      this.setBottomText("Error: No time available")
      this.setError(true)
      return
    }
    await this.addToDatabase(chairAvail)
    //on " + moment().hour(parseInt(hour)).date(parseInt(day)).month(parseInt(month)).year(parseInt(year)).minute(parseInt(halfHour)
    this.setBottomText("Succesfully added appointment")
    this.setError(false)

    this.props.redoSearch()
    // this.props.setErrorMsg("Caution: Current search may be out of date. Search again to grab most recent data.")


    //add it to the dates branch
  }

  render() {
    let durationOptions = [ (<option key={0} value={1}>30 minutes</option>), (<option key={1} value={2}>1 hour</option>), (<option key={2} value={3}>1 hour 30 minutes</option>)]

    for(var i=4; i <= 9 * 2; i++){
      durationOptions.push(<option key={i} value={i}>{Math.floor(i/2)}&nbsp;hours&nbsp;{i%2==1 ? "30 minutes" : ""}</option>)
    }
    return (
      <div>
       <Form inline onSubmit={(event)=>{
        event.preventDefault()
        this.onClicked()
       }}>
        <h2>Add Appointment</h2>
        {' Kaiser Number: '}
        <FormGroup controlId="lineKN">
          <FormControl type="text" placeholder="XXXXXXXXXXXX" size="12" maxLength="12" value={this.state.kaiserNumber} onChange={(event)=>{this.setKaiserNumber(event.target.value)}}/>
        </FormGroup>{' Date: '}
        <FormGroup controlId="lineDatePicker">
          <DatePicker selected={this.state.startDate} onChange={this.onDateChange} showTimeSelect
            minTime={moment().hours(8).minutes(0)}
            maxTime={moment().hours(21).minutes(30)}
            timeFormat="HH:mm"
            dateFormat="LLL"
          />
        </FormGroup>{' '}
        <FormGroup controlId="lineDuration">
          <FormControl componentClass="select" placeholder="Select appointment duration" onChange={(event)=>{this.setNumIntervals(event.target.value)}}>
            {durationOptions}
          </FormControl>
        </FormGroup>{' Preferred Chair:'}
        <FormGroup controlId="linePreferredChair">
          <FormControl type="text" placeholder="1" size="4" maxLength="2" value={this.state.preferredChair} onChange={(event)=>{this.setPreferredChair(event.target.value)}}/>
        </FormGroup>{' '}
        <Button type="submit" bsStyle="info" bsSize="xsmall" disabled={this.state.searchInProgress}>{this.state.searchInProgress ? "Creating appointment..." : "Create Appointment"}</Button>
        
      
      </Form>
      <span style={{color:this.state.error ? "red" : "green", fontSize:"20px"}}>{this.state.bottomText}</span>
     </div>
    );
  }
}


export default AddAppointment;
