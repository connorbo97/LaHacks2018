import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'

class SearchByChair extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <form>
        Chair Number
        <input type="text" placeholder="1-23"/>
      </form>
    );
  }
}


export default SearchByChair;