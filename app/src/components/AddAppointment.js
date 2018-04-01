import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import fire from '../firebase/index.js'

class AddAppoiontment extends Component{
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  onSubmit(){
    //check if the date is already taken
    //add it to the patients branch
    //add it to the dates branch
  }

  render() {
    return (
      <div>
      	Add appointment
        Kaiser Number<input type="text" placeholder="XXXXXXXXXX"/>
        <input type="text" placeholder="MM" size="2" maxLength="2"/>/
        <input type="text" placeholder="DD" size="2" maxLength="2"/>/
        <input type="text" placeholder="YYYY" size="4" maxLength="4"/>
        <button onSubmit={this.onSubmit}/>
      </div>
    );
  }
}


export default AddAppoiontment;