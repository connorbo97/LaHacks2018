import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Form, FormGroup, ControlLabel, FormControl, Button, Label, Panel} from 'react-bootstrap'
import DatePicker from 'react-datepicker';
import validator from 'validator'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css';

class SearchByTime extends Component{
  constructor(props) {
    super(props);
    var date = new Date(Date.now())
    this.state = {
      startDate:moment().hour(12).minute(0),
      endDate:moment().hour(36).minute(0),
      duration:1,
      searchInProgress:false,
    }

    //bind
  }

  setStartDateAndEndDate = (startDate) => {
    let endDate = this.state.endDate.hour(startDate.hour()).minute(startDate.minute())
    this.setState({startDate, endDate})
  }

  setDay = (event) =>{
    this.setState({day: event.target.value})
  }

  setMonth(event){
    this.setState({month: event.target.value})
  }

  setYear(event){
    this.setState({year: event.target.value})
  }

  setSearchInProgress = (searchInProgress) =>{
    this.setState({searchInProgress})
  }

  onSubmit = (event) =>{
    event.preventDefault()
    this.setSearchInProgress(true)
    let {endDate, startDate} = this.state

    let searchDist = endDate.diff(startDate, 'days')
    if(searchDist < 0){
        alert("Error: End date is before start date")
        this.setSearchInProgress(false)
        return
    }
    // if(startDate.year() == endDate.year()){
    //   if(startDate.month() > endDate.month()){
    //   } else if(startDate.month() == endDate.month() && startDate.date() > endDate.date()){
    //     alert("Error: End date is before start date")
    //     this.setSearchInProgress(false)
    //     return
    //   }
    // } else if(startDate.year() > endDate.year()){
    //   alert("Error: End date is before start date")
    //   this.setSearchInProgress(false)
    //   return
    // } 
    alert("Searching from " + startDate.format('MMMM Do YYYY, h:mm a') + " to " + endDate.format('MMMM Do YYYY, h:mm a') + "NEED TO FINISH IMPLEMENTING")
    this.setTimeResult(startDate, endDate)
    this.setSearchInProgress(false)
  }

  render() {

    let durationOptions = [ (<option key={0} value={1}>30 minutes</option>), (<option key={1} value={2}>1 hour</option>), (<option key={2} value={3}>1 hour 30 minutes</option>)]
    
    for(var i=4; i <= 9 * 2; i++){
      durationOptions.push(<option key={i} value={i}>{Math.floor(i/2)}&nbsp;hours&nbsp;{i%2==1 ? "30 minutes" : ""}</option>)
    }

    let searchDurationOptions = [ (<option key={0} value={1}>30 minutes</option>), (<option key={1} value={2}>1 hour</option>), (<option key={2} value={3}>1 hour 30 minutes</option>)]

    return (
        <Panel bsStyle="primary">
          <Panel.Heading>Search for available appointments</Panel.Heading>
          <Panel.Body>
            <Form inline onSubmit={this.onSubmit}>
            {'Start Date: '}
              <FormGroup controlId="sbtStartDatePicker">
                <DatePicker selected={this.state.startDate} onChange={this.setStartDateAndEndDate}
                  showTimeSelect
                  minTime={moment().hours(8).minutes(0)}
                  maxTime={moment().hours(21).minutes(30)}
                  timeFormat="HH:mm"
                  dateFormat="LLL"
                />
              </FormGroup>{' End Date:'}
              <FormGroup controlId="sbtEndDatePicker">
                <DatePicker selected={this.state.endDate} onChange={(endDate) => {this.setState({endDate:endDate.hour(this.state.startDate.hour()).minute(this.state.startDate.minute())})}}
                  dateFormat="LLL"
                />
              </FormGroup>{' '}
              <FormGroup controlId="sbtDurat">
                <FormControl componentClass="select" placeholder="Select appointment duration" value={this.state.duration} onChange={(event)=>{this.setState({duration:event.target.value})}}>
                  {durationOptions}
                </FormControl>
              </FormGroup>{' '}
              <Button type="submit" bsStyle="info" bsSize="xsmall" disabled={this.state.searchInProgress}>{this.state.searchInProgress ? "Loading results..." : "Search"}</Button>
            </Form>
          </Panel.Body>
        </Panel>
    );
  }
}


export default SearchByTime;
