import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'

class SearchByDate extends Component{
  constructor(props) {
    super(props);
  }
  setResult(){

  }

  render() {
    return (
      <form>
        Date
        <input type="text" placeholder="MM" size="2" maxLength="2"/>/
        <input type="text" placeholder="DD" size="2" maxLength="2"/>/
        <input type="text" placeholder="YYYY" size="4" maxLength="4"/>
      </form>
    );
  }
}


export default SearchByDate;