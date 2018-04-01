import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'
import {Form, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap'

class SearchByKaiserNumber extends Component{
  constructor(props) {
    super(props);

    this.state = {
      number:"1234567890",
      searchInProgress:false,
    }

    this.setNumber = this.setNumber.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.setSearchInProgress = this.setSearchInProgress.bind(this)
  }

  setNumber(event){
    this.setState({number:event.target.value})
  }
  setSearchInProgress(searchInProgress){
    this.setState({searchInProgress})
  }

  onSubmit(event){
    event.preventDefault()
    this.setSearchInProgress(true)
    this.props.setKaiserNumberResult(this.state.number)
    this.setSearchInProgress(false)
    this.props.setErrorMsg("")
  }

  render() {
    return (

      <Form inline onSubmit={this.onSubmit}>
        {'Search by Patient\'s Kaiser Number: '}
        <FormGroup controlId="inLineNumber">
          <FormControl type="text" placeholder="XXXXXXXXXX" value={this.state.number} onChange={this.setNumber}/>
        </FormGroup>{' '}
        <Button type="submit" bsStyle="info" bsSize="xsmall" disabled={this.state.searchInProgress}>{this.state.searchInProgress ? "Loading results..." : "Search"}</Button>
      </Form>
    );
  }
}


export default SearchByKaiserNumber;
