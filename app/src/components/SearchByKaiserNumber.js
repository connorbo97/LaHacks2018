import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'

class SearchByKaiserNumber extends Component{
  constructor(props) {
    super(props);
  }
  setResult(){

  }

  render() {
    return (
      <form>
        Kaiser Number
        <input type="text" placeholder="XXXXXXXXXX"/>
      </form>
    );
  }
}


export default SearchByKaiserNumber;