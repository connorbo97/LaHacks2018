import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'
import SearchByChair from './SearchByChair.js'
import SearchByDate from './SearchByDate.js'
import SearchByKaiserNumber from './SearchByKaiserNumber.js'
import SignOut from './SignOut.js'
import Result from './Result.js'
import AddAppointment from './AddAppointment.js'
import SearchByTime from './SearchByTime.js'
import fire from '../firebase/index.js'
import {Grid, Row, Col} from 'react-bootstrap'
import validator from 'validator'
import 'react-datepicker/dist/react-datepicker.css';

class Home extends Component{

  constructor(props) {
    super(props);
    this.state={
	    	result:[],
	    	type:"NONE",
        month:"",
        day:"",
        year:"",
        errorMsg:"",
        loading:false,
        kaiserID:"",
    	}

    this.setKaiserNumberResult = this.setKaiserNumberResult.bind(this)
    this.setDateResult = this.setDateResult.bind(this)
    this.setErrorMsg = this.setErrorMsg.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.setKaiserID = this.setKaiserID.bind(this)
    this.redoSearch = this.redoSearch.bind(this)
  }

  setResult = (result) => {
  	this.setState({result})
  }

  setLoading(loading){
    this.setState({loading})
  }

  setKaiserID(kaiserID){
    this.setState({kaiserID})
  }



  setErrorMsg(errorMsg){
    this.setState({errorMsg})
  }

  async setKaiserNumberResult(kaiserNumber){
    this.setLoading(true)
    //DEAL WITH THUS ALTWR
    if (!validator.isNumeric(kaiserNumber.toString()))
    {
      this.setLoading(false)
      alert("Error: Kaiser Number must contain only digits.")
      return
    }
    var snap = await fire.database.ref(`/patients/${kaiserNumber}/appointments`).once('value')

    if(!snap.val()){
      this.setLoading(false)
      this.setType("")
      this.setResult([])
      alert(`No appointment history found for Kaiser #: ${kaiserNumber}`)
      return
    }
  	var json = snap.val()
  	var arr =[]
  	for(var prop in json){
  		arr.push({date:prop, chair:json[prop].chair, numIntervals:json[prop].numIntervals})
  	}
    this.setLoading(false)
    this.setKaiserID(kaiserNumber.toString())
    this.setType("KN")
  	this.setResult(arr)
  }

  async setDateResult(state){
    var {month, day, year} = state

    this.setLoading(true)

    var snap = await fire.database.ref(`/dates/${state.year}/${state.month}/${state.day}/chairs`).once('value')
    if(!snap.val()){
      this.setLoading(false)
      this.setType("")
      this.setResult([])
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
    this.setLoading(false)
    this.setResult(arr)
    this.setTime(month,day,year)
    this.setType("D")
  }

  setTimeResult = (startDate, endDate) => {
    
  }

  setType(type){
    this.setState({type})
  }

  setTime(month,day,year){
    this.setState({month,day,year})
  }

  redoSearch(){
    if(this.state.type == "KN")
      this.setKaiserNumberResult(this.state.kaiserID)
    else if(this.state.type == "D")
      this.setDateResult({month:this.state.month, year:this.state.year, day:this.state.day})
  }
  
  render() {
    return (
      <div>
        <Grid bsClass="container">
          <Row>
            <Col md={10} ld={10} style={{width:"50%", borderRight:"#EEEEEE 2px solid"}}>
             <SearchByKaiserNumber setErrorMsg={this.setErrorMsg} setKaiserNumberResult={this.setKaiserNumberResult}/>
            </Col>
            <Col md={10} ld={10} style={{width:"50%"}}>
              <AddAppointment setErrorMsg={this.setErrorMsg} redoSearch={this.redoSearch}/>
            </Col>
          </Row>
          <hr/>
          <Row>
            <Col md={10} ld={10} style={{width:"50%", borderRight:"#EEEEEE 2px solid"}}>
             <SearchByDate setErrorMsg={this.setErrorMsg} setDateResult={this.setDateResult} />
            </Col>
            <Col md={10} ld={10} style={{width:"50%"}}>
              <SearchByTime setErrorMsg={this.setErrorMsg} setTimeResult={this.setTimeResult} />
            </Col>
          </Row>
        </Grid>
        <hr/>
	      <Result redoSearch={this.redoSearch} loading={this.state.loading} result={this.state.result} errorMsg={this.state.errorMsg} type={this.state.type} kaiserNumber={this.state.kaiserID} day={this.state.day} year={this.state.year} month={this.state.month}/>
      </div>
    );
  }
}


export default Home;
