import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'
import Appointment from './Appointment.js'
import '../css/KaiserNumberResult.css'
import Flexbox from 'flexbox-react';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import {Button, Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl, PageHeader, Alert, ListGroup, Panel, Collapse} from 'react-bootstrap'

const filter = Object.freeze({ "mo":1, "month":3, "length":4,})
const monthDict = Object.freeze({ "None":-1, "January":1, "February":2, "March":3,"April":4,"May":5,"June":6,"July":7,"August":8,"September":9,"October":10,"November":11,"December":12,})

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}


function sortByDate(array) {
    return array.sort(function(a, b) {
      var x = a.date; var y = b.date;
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function sortByKeyDescending(array, key) {
    return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}


function sortByDateDescending(array) {
    return array.sort(function(a, b) {
      var x = a.date; var y = b.date;
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}

class KaiserNumberResult extends Component{
  constructor(props) {
    super(props);
    this.state={
      monthFilter:"None",
      yearFilter:"",
      dayFilter:"",
      prime:true,
      showPrevious:true,
      showCurrent:true,
    }
    this.setSorted = this.setSorted.bind(this)
    this.setPrime = this.setPrime.bind(this)
    this.handleFilterClick = this.handleFilterClick.bind(this)
    this.setShowPrevious = this.setShowPrevious.bind(this)
    this.setShowCurrent = this.setShowCurrent.bind(this)
    this.setMonthFilter = this.setMonthFilter.bind(this)
    this.setYearFilter = this.setYearFilter.bind(this)
    this.resetFilters = this.resetFilters.bind(this)
    this.setDayFilter = this.setDayFilter.bind(this)
    this.handleChangeMonth = this.handleChangeMonth.bind(this)
  }

  setSorted(sorted){
    this.setState({sorted})
  }

  setPrime(prime){
    this.setState({prime:!prime})
  }

  setShowPrevious(showPrevious){
    this.setState({showPrevious:!showPrevious})
  }

  setShowCurrent(showCurrent){
    this.setState({showCurrent:!showCurrent})
  }

  setMonthFilter(monthFilter){
    this.setState({monthFilter})
  }

  setDayFilter(dayFilter){
    this.setState({dayFilter})
  }

  setYearFilter(yearFilter){
    this.setState({yearFilter})
  }

  handleFilterClick(sorted){
    // console.log(sorted)
    // console.log(this.state.sorted)
    if(this.state.sorted == sorted){
      this.setPrime(this.state.prime)
    } else {
      this.setPrime(true)
      this.setSorted(sorted)
    }
  }

  handleChangeMonth(payload){
    console.log(payload)
    this.setMonthFilter(payload.value)
  }

  handleChangeMonth(payload){
    this.setMonthFilter(payload.label)
  }

  resetFilters(){
    this.setState({monthFilter:"None", yearFilter:"", dayFilter:""})
  }

  render() {
    var presentJSX = []
    var previousJSX = []
    var {result} = this.props
    var {sorted, prime, showCurrent, showPrevious, yearFilter, monthFilter, dayFilter} = this.state


    if(this.props.loading){
      return (<span>Loading search...</span>)
    }

    result = result.map((json)=>{
      var date = new Date()
      date.setTime(json.date)
      var temp =  {
        day:date.getDate().toString().padStart(2, "0"),
        month:(date.getMonth() + 1).toString().padStart(2, "0"),
        year:date.getFullYear(),
        hour:date.getHours().toString().padStart(2, "0"),
        minute:date.getMinutes().toString().padStart(2, "0"),
        durationHour:Math.floor(json.numIntervals*30/60),
        durationMinute:json.numIntervals*30%60,
        numIntervals:json.numIntervals,
        chair:json.chair,
        date:json.date,
      }
      return(temp)
    })

    monthFilter = monthDict[monthFilter]
    if(yearFilter.length == 4){
      if(monthFilter != -1){
        if(dayFilter.length == 2){
          result = result.filter((json)=> (json.year == parseInt(yearFilter) && parseInt(json.month) == monthFilter && parseInt(json.day) == parseInt(dayFilter)))
        } else {
         result = result.filter((json)=> (json.year == parseInt(yearFilter) && parseInt(json.month) == monthFilter))
        }
      } else if(dayFilter.length == 2){
          result = result.filter((json)=> (json.year == parseInt(yearFilter) && parseInt(json.day) == parseInt(dayFilter)))
      } else {
        result = result.filter((json)=> json.year == parseInt(yearFilter))
      }
    } else if(monthFilter != -1){
      if(dayFilter.length == 2){
          result = result.filter((json)=> (parseInt(json.month) == monthFilter && parseInt(json.day) == parseInt(dayFilter)))
      } else{
        result = result.filter((json)=> (parseInt(json.month) == monthFilter))
      }
    } else if(dayFilter.length == 2){
        result = result.filter((json)=> parseInt(json.day) == parseInt(dayFilter))
    }

    if(prime)
      result = sortByDate(result)
    else
      result = sortByDateDescending(result)

    // switch(sorted){
    //   case filter.chronological:
    //     if(prime)
    //       result = sortByDate(result)
    //     else
    //       result = sortByDateDescending(result)
    //     break
    //   case filter.month:
    //     if(prime)
    //       result = sortByKey(result, "month")
    //     else
    //       result = sortByKeyDescending(result, "month")
    //     break
    //   case filter.length:
    //     if(prime)
    //       result = sortByKey(result, "numIntervals")
    //     else
    //       result = sortByKeyDescending(result, "numIntervals")
    //     break
    //   default:
    // }

    result.forEach((json)=>{
      if(json.date >= Date.now())
        presentJSX.push(<Appointment redoSearch={this.props.redoSearch} key={json.date} kaiserNumber={this.props.kaiserNumber} {...json}/>)
      else
        previousJSX.push(<Appointment redoSearch={this.props.redoSearch} key={json.date} kaiserNumber={this.props.kaiserNumber} {...json}/>)
    })
    let filterMonthOptions = []

    for(let month in monthDict){
      filterMonthOptions.push(<option key={month} value={month}>{month}</option>)
    }
    //   var backColor = sorted == filter[prop] ? "grey" : "white"
    //   var style = {backgroundColor:backColor, width:"100%", textAlign:"center"}
    //   console.log(backColor, sorted, filter[prop])
    //   filterJSX.push(<span style={{backgroundColor:backColor, width:"100%", textAlign:"center", border:"#EEEEEE 2px solid"}} key={prop} onClick={()=>{this.handleFilterClick(filter[prop])}}>{sorted == filter[prop] ? (prime ? 'v' : '^') : ' '} {prop}</span>)
    // }
    return (
      <Grid>
        {this.props.errorMsg.length > 0 ? (<Alert bsStyle="warning">
            {this.props.errorMsg}
          </Alert>) : (<span/>)
        }
        <Row>
          <Button bsStyle="info" bsSize="small" onClick={()=>{this.setPrime(this.state.prime)}}>Sort Chronological <b>{this.state.prime == false ? "^" : "v"}</b></Button>
          <Button  bsStyle="info" bsSize="small" onClick={()=>{this.setShowCurrent(showCurrent)}}>{showCurrent ? "Hide" : "Show"} Future Appointments</Button>
          <Button  bsStyle="info" bsSize="small" onClick={()=>{this.setShowPrevious(showPrevious)}}>{showPrevious ? "Hide" : "Show"} Previous Appointments</Button>
          <br/>
        </Row>
        <Row>
          <Form inline>
            {'Filter by month:'}
            <FormGroup controlId="knDuration">
              <FormControl componentClass="select" placeholder="Select month to filter by..."  onChange={(event)=>{console.log(event.target.value);this.setMonthFilter(event.target.value)}}>
                {filterMonthOptions}
              </FormControl>
            </FormGroup>{' Filter by day: '}
            <FormGroup controlId="knDay">
              <FormControl type="text" placeholder="DD" size="3" maxLength="2" value={this.state.dayFilter} onChange={(event)=>{this.setDayFilter(event.target.value)}}/>
            </FormGroup>{' Filter by year: '}
            <FormGroup controlId="knYear">
              <FormControl type="text" placeholder="YYYY" size="5" maxLength="4" value={this.state.yearFilter} onChange={(event)=>{this.setYearFilter(event.target.value)}}/>
            </FormGroup>
            <Button bsStyle="danger" onClick={this.resetFilters} bsSize="small" disabled={monthFilter==-1 && dayFilter == "" && yearFilter == ""}>Reset Filters</Button>
          </Form>
        </Row>
        <Row>
        </Row>
        <Row>
          <div>
              <Panel bsStyle="primary">
                <Panel.Heading><Panel.Title>Future Appointments</Panel.Title></Panel.Heading>
                <Collapse in={showCurrent}>
                  <ListGroup>
                    {presentJSX}
                  </ListGroup>
                </Collapse>
              </Panel>
          </div>
        </Row>
        <Row>
          <div>
              <Panel bsStyle="info">
                <Panel.Heading><Panel.Title>Previous Appointments</Panel.Title></Panel.Heading>
                <Collapse in={showPrevious}>
                  <ListGroup>
                    {previousJSX}
                  </ListGroup>
               </Collapse>
              </Panel>
          </div>
        </Row>
      </Grid>
    );
  }
}


export default KaiserNumberResult;