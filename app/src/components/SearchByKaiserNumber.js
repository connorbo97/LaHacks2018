import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'
import validator from 'validator'

class SearchByKaiserNumber extends Component{
  constructor(props) {
    super(props);

    this.state = {
      number:""
    }

    this.setNumber = this.setNumber.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  setNumber(event)
  {
    this.setState({number:event.target.value})
  }

  onSubmit(event){
    event.preventDefault()

    if (!validator.isNumeric(this.state.number.toString()))
    {
      alert("Error: Kaiser Number must contain only digits.")
      return
    }


    if (this.state.number.toString().length != 10 || parseInt(this.state.number.toString()) < 0)
    {
      alert("Error: Kaiser Number must contain 10 digits.")
      return
    }


    this.props.setKaiserNumberResult(this.state.number)
  }

  render() 
  {
    return (
      <form onSubmit={this.onSubmit}>
        Search Appointments by Patient's Kaiser Number <br/>
        Kaiser Number
        <input type="text" size="11" maxLength="10" placeholder="XXXXXXXXXX" value={this.state.number} onChange={this.setNumber}/>
        <hr/>
      </form>
    );
  }
}


export default SearchByKaiserNumber;
