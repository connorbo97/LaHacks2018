import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
    console.log("penis")
    event.preventDefault()
    this.props.setDateResult(this.state)
  }

  render() {
    console.log(this.state)
    return (
      <div>
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
          <input type="text" placeholder="YYYY" size="2" maxLength="4" value = {this.state.year} onChange={this.setYear}/>
        </form>
      </div>
    );
  }
}


export default SearchByDate;
