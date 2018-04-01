import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'
import SearchByChair from './SearchByChair.js'
import SearchByDate from './SearchByDate.js'
import SearchByKaiserNumber from './SearchByKaiserNumber.js'
import SignOut from './SignOut.js'
import Result from './Result.js'
import fire from '../firebase/index.js'

class Home extends Component{

  constructor(props) {
    super(props);
    this.state={
	    	result:[],
	    	type:"KN",
    	}
    this.setResult = this.setResult.bind(this)
    this.setKaiserNumberResult = this.setKaiserNumberResult.bind(this)
    this.setDateResult = this.setDateResult.bind(this)
  }

  setResult(result){
  	this.setState({result})
  }

  async setKaiserNumberResult(kaiserNumber){

    var snap = await fire.database.ref(`/patients/${kaiserNumber}/appointments`).once('value')

    if(!snap.val()){
      alert("Error: ref not found")
      return
    }
  	var json = snap.val()
  	var arr =[]
  	for(var prop in json){
  		arr.push({date:prop, chair:json[prop].chair, numIntervals:json[prop].numIntervals})
  	}
  	this.setResult(arr)
  }

  async setDateResult(state){

    var snap = await fire.database.ref(`/dates/${state.year}/${state.month}/${state.day}/chairs`).once('value')
    if(!snap.val()){
      alert("Error: ref not found")
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
              var jsonres = temp[halfHour] == "a" ? {day:state.day, month:state.month, year: state.year, hour:hour, minute:"00"} : {day:state.day, month:state.month, year: state.year, hour:hour, minute:"30"}
              arr[j].push(jsonres)
            }
          }
      }
    }
    this.setResult(arr)
  }

  render() {
    console.log("arr:")
  	console.log(this.state.result)
    return (
      <div>
    	  <SignOut/>
	      <SearchByKaiserNumber setKaiserNumberResult={this.setKaiserNumberResult}/>
<<<<<<< HEAD
	      <SearchByDate setDateResult={this.setDateResult}/>
	      <Result results={this.state.results} type={this.state.type}/>
=======
	      <SearchByDate/>
        <AddAppointment />
	      <Result result={this.state.result} type={this.state.type}/>
>>>>>>> 2d10370025c7f78cda4a1002180cfb5143cf3592

      </div>
    );
  }
}


export default Home;
