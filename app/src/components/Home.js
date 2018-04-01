import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'
import SearchByChair from './SearchByChair.js'
import SearchByDate from './SearchByDate.js'
import SearchByKaiserNumber from './SearchByKaiserNumber.js'
import SignOut from './SignOut.js'
import Result from './Result.js'
import AddAppointment from './AddAppointment.js'
import fire from '../firebase/index.js'
import validator from 'validator'

class Home extends Component{

  constructor(props) {
    super(props);
    this.state={
	    	result:[],
	    	type:"NONE",
        month:"",
        day:"",
        year:"",
    	}
    this.setResult = this.setResult.bind(this)
    this.setKaiserNumberResult = this.setKaiserNumberResult.bind(this)
    this.setDateResult = this.setDateResult.bind(this)
  }

  setResult(result){
  	this.setState({result})
  }

  async setKaiserNumberResult(kaiserNumber){

    //DEAL WITH THUS ALTWR
    if (!validator.isNumeric(kaiserNumber.toString()))
    {
      alert("Error: Kaiser Number must contain only digits.")
      return
    }
    if (kaiserNumber.toString().length != 10 || parseInt(kaiserNumber.toString()) < 0)
    {
      alert("Error: Kaiser Number must contain 10 digits.")
      return
    }

    var snap = await fire.database.ref(`/patients/${kaiserNumber}/appointments`).once('value')

    if(!snap.val()){
      alert(`No appointment history found for Kaiser #: ${kaiserNumber}`)
      return
    }
  	var json = snap.val()
  	var arr =[]
  	for(var prop in json){
  		arr.push({date:prop, chair:json[prop].chair, numIntervals:json[prop].numIntervals})
  	}
    this.setType("KN")
  	this.setResult(arr)
  }

  async setDateResult(state){
    var {month, day, year} = state
    var snap = await fire.database.ref(`/dates/${state.year}/${state.month}/${state.day}/chairs`).once('value')
    if(!snap.val()){
      alert(`No appointments on date: ${state.month}/${state.day}/${state.year}`)
      return
    }
    var json = snap.val()
    var arr =[]
    var i = 0
    for(;i < 23;){
      arr.push([])
      i++
    }
    for(var chair in json){
      for(var hour in json[chair].timeSlots){
        var temp = json[chair].timeSlots[hour]
          for(var halfHour in temp){
            if(temp[halfHour].taken != "-1"){
              var j = parseInt(chair)
              var jsonres = halfHour == "a" ? {hour:hour, minute:"00", kid:temp[halfHour].taken} : {hour:hour, minute:"30", kid:temp[halfHour].taken}
              arr[j].push(jsonres)
            }
          }
      }
    }
    this.setResult(arr)
    this.setTime(month,day,year)
    this.setType("D")
  }

  setType(type){
    this.setState({type})
  }

  setTime(month,day,year){
    this.setState({month,day,year})
  }

  render() {
    console.log("arr:")
  	console.log(this.state.result)
    return (
      <div>
    	  <SignOut/>
	      <SearchByKaiserNumber setKaiserNumberResult={this.setKaiserNumberResult}/>
	      <SearchByDate setDateResult={this.setDateResult} />
        <AddAppointment />
        <hr/>
	      <Result result={this.state.result} type={this.state.type} day={this.state.day} year={this.state.year} month={this.state.month}/>
      </div>
    );
  }
}


export default Home;
