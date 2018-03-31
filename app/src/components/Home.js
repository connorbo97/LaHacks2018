import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'
import SearchByChair from './SearchByChair.js'
import SearchByDate from './SearchByDate.js'
import SearchByKaiserNumber from './SearchByKaiserNumber.js'
import SignOut from './SignOut.js'
import Result from './Result.js'

class Home extends Component{
  constructor(props) {
    super(props);
    this.state={
    	result:[],
    	type:"",
    }
  }


  render() {
    return (
      <div>
      	<SignOut/>
	      <SearchByKaiserNumber setResult={this.setResult}/>
	      <SearchByChair/>
	      <SearchByDate/>
	      <Result results={this.state.results} type={this.state.type}/>

      </div>
    );
  }
}


export default Home;