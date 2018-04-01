import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Form, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap'

class SearchByDate extends Component{
  constructor(props) {
    super(props);

    this.state = {
      day: "12",
      month: "2",
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
    this.props.setDateResult(this.state)
    this.setSearhInProgress(false)
    this.props.setErrorMsg("")
  }

  render() {
    console.log(this.state)
    return (
      <Form inline onSubmit={this.onSubmit}>
        {'Search by Date: '}
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
    );
  }
}


export default SearchByDate;
