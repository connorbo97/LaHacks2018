import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import validator from 'validator'

class SearchByDate extends Component{
  constructor(props) {
    super(props);

    this.state = {
      day: "",
      month: "",
      year: "",
    }

    this.setDay = this.setDay.bind(this)
    this.setMonth = this.setMonth.bind(this)
    this.setYear = this.setYear.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
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

  onSubmit(event){
    event.preventDefault()


    if (!validator.isNumeric(this.state.day.toString())   ||  !validator.isNumeric(this.state.month.toString()) ||  !validator.isNumeric(this.state.year.toString()))
    {
      alert("Error: Month, Day, and Year must contain only digits.")
      return
    }


    if (this.state.month.toString().length != 2 || this.state.day.toString().length != 2 || this.state.year.toString().length != 4)
    {
      alert("Error: Date must be in the form MM/DD/YYYY.")
      return
    }


    if (parseInt(this.state.month) < 1 || parseInt(this.state.month) > 12)
    {
      alert("Error: Invalid Month.")
      return
    }



    if (parseInt(this.state.day) < 1 )
    {
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
      alert("Error: Invalid Day.")
      return
    }



    this.props.setDateResult(this.state)
  }

  render() {
    console.log(this.state)
    return (
      <div>
        Search Appointments by Date <br/>
        <form onSubmit={this.onSubmit}>
          Month
          <input type="text" placeholder="MM" size="2" maxLength="2" value = {this.state.month} onChange={this.setMonth}/>
        </form>
        <form onSubmit={this.onSubmit}>
          Day
          <input type="text" placeholder="DD" size="2" maxLength="2" value = {this.state.day} onChange={this.setDay}/>
        </form>
        <form onSubmit={this.onSubmit}>
          Year
          <input type="text" placeholder="YYYY" size="4" maxLength="4" value = {this.state.year} onChange={this.setYear}/>
        </form>
      </div>
    );
  }
}


export default SearchByDate;
