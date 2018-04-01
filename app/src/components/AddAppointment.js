import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import fire from '../firebase/index.js'
import {Form, FormGroup, ControlLabel, FormControl, Button, Label, Panel} from 'react-bootstrap'
import validator from 'validator'

class AddAppointment extends Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      kaiserNumber:"",
      month:"",
      day:"",
      year:"",
      hour:"",
      halfHour:"",
      numIntervals:1,

    }

    this.onClicked = this.onClicked.bind(this)
    this.isAvailable = this.isAvailable.bind(this)
    this.addToDatabase = this.addToDatabase.bind(this)
    this.setKaiserNumber = this.setKaiserNumber.bind(this)
    this.setMonth = this.setMonth.bind(this)
    this.setDay = this.setDay.bind(this)
    this.setYear = this.setYear.bind(this)
    this.setHour = this.setHour.bind(this)
    this.setHalfHour = this.setHalfHour.bind(this)
    this.setDurationHour = this.setDurationHour.bind(this)
    this.setNumIntervals = this.setNumIntervals.bind(this)
    this.setDurationMinutes = this.setDurationMinutes.bind(this)


  }

  setKaiserNumber(kaiserNumber){
    this.setState({kaiserNumber})
  }

  setMonth(month){
    this.setState({month})
  }

  setDay(day){
    this.setState({day})
  }

  setYear(year){
    this.setState({year})
  }

  setHour(hour){
    this.setState({hour})
  }

  setHalfHour(halfHour){
    this.setState({halfHour})
  }

  setDurationHour(durationHour){
    this.setState({durationHour})
  }

  setNumIntervals(numIntervals){
    this.setState({numIntervals})
  }

  setDurationMinutes(durationMinutes){
    this.setState({durationMinutes})
  }

  async isAvailable(state)
  {
    var snap = await fire.database.ref(`/dates/${state.year}/${state.month}/${state.day}/chairs`).once('value')

    var mustCheckHalf = parseInt(this.state.halfHour) == 30
    var store = mustCheckHalf
    if(!snap.val())
    {
      return 0
    }

    var json = snap.val()

    for(var chair=0; chair < 23; chair++){
        if(!json[chair]){
          return chair
        }
        let temp = json[chair].timeSlots
        let tempNI = this.state.numIntervals
        mustCheckHalf = store
        for(var i=this.state.hour; tempNI > 0 && i < 24; i++){
          let j = i.toString().padStart(2,"0")
          // console.log(temp[j])
          if (temp[j]){
            if(mustCheckHalf){
              if(temp[j].b && temp[j].b.taken != '-1')
                  break
              tempNI--
              mustCheckHalf = false
            }
            else if(tempNI == 1){
              if(temp[j].a){
                if(temp[j].a.taken == '-1')
                  return chair
                else
                  break
              } else {
                return chair
              }
            } else {
                if(temp[j].a)
                  if(temp[j].b)
                    if(temp[j].a.taken == '-1' && temp[j].b.taken == '-1')
                      tempNI-=2
                    else
                      break 
                  else
                    if(temp[j].a.taken == '-1')
                      tempNI-=2
                    else
                      break
                else if(temp[j].b)
                  if(temp[j].b.taken == '-1')
                    tempNI-=2
                  else
                    break
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
    }
    return -1
  }

  async addToDatabase(chairAvail)
  {

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
      await fire.database.ref(`/dates/${year}/${month}/${day}/chairs/${chairAvail}/timeSlots/${temp.toString().padStart(2,"0")}`).update(tempJSON)
      i++

    }
  }


  async onClicked()
  {
    var {day, month, year, hour, halfHour, numIntervals, kaiserNumber} = this.state

    if (!validator.isNumeric(kaiserNumber.toString()))
    {
      alert("Error: Kaiser Number must contain only digits.")
      return
    }
    if (kaiserNumber.toString().length != 10 || parseInt(kaiserNumber.toString()) < 0)
    {
      alert("Error: Kaiser Number must contain 10 digits.")
      return
    }



    if ( !validator.isNumeric(month.toString())   ||  !validator.isNumeric(year.toString()) ||  !validator.isNumeric(day.toString()) ||  parseInt(month.toString()) < 0 || parseInt(year.toString()) < 0 || parseInt(day.toString()) < 0)
    {
      alert("Error: Month, Day, and Year must only contain digits.")
      return
    }


    if (month.toString().length != 2   ||    day.toString().length != 2     ||    year.toString().length != 4)
    {
      alert("Error: Date must be in the form MM/DD/YYYY.")
      return
    }


    if (!validator.isNumeric(hour.toString())   ||   !validator.isNumeric(halfHour.toString()) )
    {
      alert("Error: Start time must contain only digits.")
      return
    }


    if (hour.toString().length != 2   ||    halfHour.toString().length != 2)
    {
      alert("Error: Start time must be in the form XX:XX.")
      return
    }

    if(parseInt(halfHour) != 0 && parseInt(halfHour) != 30){
      alert("Error: Appointments must start on an hour or half hour. Minutes must be 00 or 30")
      return
    }

    //check if the date is already taken
    var chairAvail = await this.isAvailable(this.state)
    if (chairAvail == -1)
    {
      alert("Error: No time available")
      return
    }
    await this.addToDatabase(chairAvail)
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
       <Form inline onSubmit={(event)=>{
        event.preventDefault()
        this.onClicked()
       }}>
        <h2>Add Appointment</h2>
        {' Kaiser Number: '}
        <FormGroup controlId="lineKN">
          <FormControl type="text" placeholder="XXXXXXXXXX" size="11" maxLength="10" value={this.state.kaiserNumber} onChange={(event)=>{this.setKaiserNumber(event.target.value)}}/>
        </FormGroup>{' Date: '}
        <FormGroup controlId="lineMonth">
          <FormControl type="text" placeholder="MM" size="3" maxLength="2" value={this.state.month} onChange={(event)=>{this.setMonth(event.target.value)}}/>
        </FormGroup>{'/'}
        <FormGroup controlId="lineDay">
          <FormControl type="text" placeholder="DD" size="3" maxLength="2" value={this.state.day} onChange={(event)=>{this.setDay(event.target.value)}}/>
        </FormGroup>{'/'}
        <FormGroup controlId="lineYear">
          <FormControl type="text" placeholder="YYYY" size="5" maxLength="4" value={this.state.year} onChange={(event)=>{this.setYear(event.target.value)}}/>
        </FormGroup>{' '}
        <FormGroup controlId="lineDuration">
          <FormControl componentClass="select" placeholder="Select appointment duration" onChange={(event)=>{this.setNumIntervals(event.target.value)}}>
            {durationOptions}
          </FormControl>
        </FormGroup>{' Start time: '}
        <FormGroup controlId="lineStartHour">
          <FormControl type="text" placeholder="HH (00-23)" size="12" maxLength="2" value={this.state.hour} onChange={(event)=>{this.setHour(event.target.value)}}>
          </FormControl>
        </FormGroup>{':'}
        <FormGroup controlId="lineStartMinute">
          <FormControl type="text" placeholder="MM (00 or 30)" size="12" maxLength="2" value={this.state.halfHour} onChange={(event)=>{this.setHalfHour(event.target.value)}}>
          </FormControl>
        </FormGroup>{' '}
        <Button type="submit" bsStyle="info" bsSize="xsmall" disabled={this.state.searchInProgress}>{this.state.searchInProgress ? "Creating appointment..." : "Create Appointment"}</Button>
      </Form>

    );
  }
}


export default AddAppointment;
