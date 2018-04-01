import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import fire from '../firebase/index.js'
import {Form, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap'


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
        let n = this.state.numIntervals
        for(var i=this.state.hour; i < this.state.hour + Math.ceil(this.state.numIntervals/2); i++)
        {
          let j = i.toString().padStart(2,"0")
          console.log(temp[j])
          if (temp[j])
          {
            if (temp[j].a)
            {
              //check a
              if(temp[j].a.taken == "-1")
                n--
              else
                break
            }
            else
            {
              n--
            }

            if(n == 0)
              return chair

            if (temp[j].b)
            {
              //check b
              if(temp[j].b.taken == "-1")
                n--
              else
                break
            }
            else
            {
              n--
            }
          }
          else
          {
            n -= 2
          }

          if (n == 0)
            return chair
        }
    }
    return -1
  }

  async addToDatabase(chairAvail)
  {

    var {day, month, year, hour, halfHour, numIntervals, kaiserNumber, durationHour,durationMinutes} = this.state
    //check if the date is already taken
    var date = new Date()
    date.setDate(parseInt(day))
    date.setMonth(parseInt(month)-1)
    date.setYear(parseInt(year))
    date.setHours(parseInt(hour))
    date.setMinutes(parseInt(halfHour))
    let json = {}
    console.log(date)
    console.log(this.state)
    json[date.getTime()] = {chair:chairAvail,numIntervals:numIntervals}

    //ADD TO PATIENTS
    console.log(json)
    await fire.database.ref(`/patients/${kaiserNumber}/appointments`).update(json)


    //ADD TO DATES
    let i =0;
    while(numIntervals > 0){
      let tempJSON = {}
      if(numIntervals >= 2){
        tempJSON = {
          a:{
            taken:kaiserNumber
          },
          b: {
            taken:kaiserNumber
          }
        }
        numIntervals -= 2
      } else {
        tempJSON = {
          a:{
            taken:kaiserNumber
          },
          b:{
            taken:-1
          }

        }
        numIntervals -= 1
      }

      let temp = parseInt(hour) + i
      await fire.database.ref(`/dates/${year}/${month}/${day}/chairs/${chairAvail}/timeSlots/${temp.toString().padStart(2,"0")}`).update(tempJSON)
      i++

    }
  }


  async onClicked()
  {
    var {day, month, year, hour, halfHour, numIntervals} = this.state
    //check if the date is already taken
    var chairAvail = await this.isAvailable(this.state)
    console.log(chairAvail)
    if (chairAvail == -1)
    {
      alert("Error: No time available")
      return
    }
    console.log(chairAvail)
    this.addToDatabase(chairAvail)
    this.props.setErrorMsg("Caution: Current search may be out of date. Search again to grab most recent data.")


    //add it to the dates branch
  }

  render() {
    let durationOptions = [ (<option key={0} value={1}>30 minutes</option>), (<option key={1} value={2}>1 hour</option>), (<option key={2} value={3}>1 hour 30 minutes</option>)]

    for(var i=4; i <= 9 * 2; i++){
      durationOptions.push(<option key={i} value={i}>{Math.floor(i/2)}&nbsp;hours&nbsp;{i%2==1 ? "30 minutes" : ""}</option>)
    }
    console.log(this.state.numIntervals)
    return (
       <Form inline onSubmit={(event)=>{
        event.preventDefault()
        this.onClicked()
       }}>
        {'Add appointment:\tKID:'}
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
          <FormControl type="text" placeholder="HH (00-24)" size="12" maxLength="2" value={this.state.hour} onChange={(event)=>{this.setHour(event.target.value)}}>
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
