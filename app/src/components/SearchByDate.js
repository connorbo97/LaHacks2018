import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Form, FormGroup, ControlLabel, FormControl, Button, Label, Panel} from 'react-bootstrap'
import validator from 'validator'

class SearchByDate extends Component{
  constructor(props) {
    super(props);
    var date = new Date(Date.now())
    this.state = {
      day: date.getDate().toString().padStart(2, "0"),
      month: (date.getMonth() + 1).toString().padStart(2, "0"),
      year: "2018",
      searchInProgress:false,
    }

    this.setDay = this.setDay.bind(this)
    this.setMonth = this.setMonth.bind(this)
    this.setYear = this.setYear.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.setSearhInProgress = this.setSearhInProgress.bind(this)
    //bind
  }

  setDay(event){
    this.setState({day: event.target.value})
  }

  setMonth(event){
    this.setState({month: event.target.value})
  }

  setYear(event){
    this.setState({year: event.target.value})
  }

  setSearhInProgress(searchInProgress){
    this.setState({searchInProgress})
  }


  onSubmit(event){
    event.preventDefault()
    this.setSearhInProgress(true)


    if (!validator.isNumeric(this.state.day.toString())   ||  !validator.isNumeric(this.state.month.toString()) ||  !validator.isNumeric(this.state.year.toString()))
    {
      this.setSearhInProgress(false)
      alert("Error: Month, Day, and Year must contain only digits.")
      return
    }


    if (this.state.month.toString().length != 2 || this.state.day.toString().length != 2 || this.state.year.toString().length != 4)
    {
      this.setSearhInProgress(false)
      alert("Error: Date must be in the form MM/DD/YYYY.")
      return
    }


    if (parseInt(this.state.month) < 1 || parseInt(this.state.month) > 12)
    {
      this.setSearhInProgress(false)
      alert("Error: Invalid Month.")
      return
    }



    if (parseInt(this.state.day) < 1 )
    {
      this.setSearhInProgress(false)
      alert("Error: Invalid Day.")
      return
    }

    /*  CONNOR
    var temp = new Date()
    temp.setDate(30)
    temp.setMonth(1)
    temp.setYear(2018)
    console.log(temp.getDate())
    console.log(temp.toString())
    */

    var temp = new Date()
    temp.setDate(this.state.day)
    temp.setMonth(this.state.month - 1)
    temp.setYear(this.state.year)

    if (temp.getDate() != this.state.day)
    {
      this.setSearhInProgress(false)
      alert("Error: Invalid Day.")
      return
    }

    this.props.setDateResult(this.state)
    this.setSearhInProgress(false)
    this.props.setErrorMsg("")
  }

  render() {
    console.log(this.state)
    return (
        <Panel bsStyle="primary">
          <Panel.Heading>Search by Date</Panel.Heading>
          <Panel.Body>
            <Form inline onSubmit={this.onSubmit}>
              <FormGroup controlId="inLineMonth">
                <FormControl type="text" placeholder="MM" size="2" maxLength="2" value={this.state.month} onChange={this.setMonth}/>
              </FormGroup>{' '}
              <FormGroup controlId="inLineDay">
                <FormControl type="text" placeholder="DD" size="2" maxLength="2" value = {this.state.day} onChange={this.setDay}/>
              </FormGroup>{' '}
              <FormGroup controlId="inLineYear">
                <FormControl type="text" placeholder="YYYY" size="4" maxLength="4" value = {this.state.year} onChange={this.setYear}/>
              </FormGroup>{' '}
              <Button type="submit" bsStyle="info" bsSize="xsmall" disabled={this.state.searchInProgress}>{this.state.searchInProgress ? "Loading results..." : "Search"}</Button>
            </Form>
          </Panel.Body>
        </Panel>
    );
  }
}


export default SearchByDate;
