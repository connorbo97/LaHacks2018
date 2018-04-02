import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'
import {Form, FormGroup, ControlLabel, FormControl, Button, Label, Panel} from 'react-bootstrap'
import validator from 'validator'

class SearchByKaiserNumber extends Component{
  constructor(props) {
    super(props);

    this.state = {
      number:"",
      searchInProgress:false,
    }

    this.setNumber = this.setNumber.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.setSearchInProgress = this.setSearchInProgress.bind(this)
  }

  setNumber(event)
  {
    this.setState({number:event.target.value})
  }
  setSearchInProgress(searchInProgress){
    this.setState({searchInProgress})
  }

  onSubmit(event){
    event.preventDefault()
    this.setSearchInProgress(true)

    if (!validator.isNumeric(this.state.number.toString()))
    {

      this.setSearchInProgress(false)
      alert("Error: Kaiser Number must contain only digits.")
      return
    }


    if (this.state.number.toString().length != 10 || parseInt(this.state.number.toString()) < 0)
    {
      this.setSearchInProgress(false)
      alert("Error: Kaiser Number must contain 10 digits.")
      return
    }

    this.props.setKaiserNumberResult(this.state.number)
    this.setSearchInProgress(false)
    this.props.setErrorMsg("")
  }

  render() {
    return (

      <Form inline onSubmit={this.onSubmit}>
        <Panel bsStyle="primary">
        <Panel.Heading>Search By Kaiser Number</Panel.Heading>
        <Panel.Body>
        {' Kaiser Number: '}
          <FormGroup controlId="inLineNumber">
            <FormControl type="text" placeholder="XXXXXXXXXX" size="11" maxLength="10" value={this.state.number} onChange={this.setNumber}/>
          </FormGroup>{' '}
          <Button type="submit" bsStyle="info" bsSize="xsmall" disabled={this.state.searchInProgress}>{this.state.searchInProgress ? "Loading results..." : "Search"}</Button>
        </Panel.Body>
        </Panel>
      </Form>
    );
  }
}


export default SearchByKaiserNumber;
