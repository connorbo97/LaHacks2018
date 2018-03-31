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
        <input type="text" placeholder="MM"/>/
        <input type="text" placeholder="DD"/>/
        <input type="text" placeholder="YYYY"/>
      </form>
    );
  }
}


export default SearchByDate;