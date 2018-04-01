import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'
import Appointment from './Appointment.js'
import './KaiserNumberResult.css'
import Flexbox from 'flexbox-react';

const filter = Object.freeze({"none":1, "day":2, "month":3, "length":4, })

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function sortByKeyDescending(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}

class KaiserNumberResult extends Component{
  constructor(props) {
    super(props);
    this.state={
      sorted:filter.none,
      prime:false,
    }
    this.setSorted = this.setSorted.bind(this)
    this.setPrime = this.setPrime.bind(this)
  }

  setSorted(sorted){
    this.setState({sorted})
  }

  setPrime(prime){
    this.setState({prime:!prime})
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

  render() {
    var JSX = []
    var {result} = this.props
    var {sorted, prime} = this.state

    result = result.map((json)=>{
      var date = new Date()
      date.setTime(json.date)
      var temp =  {
        day:date.getDate().toString().padStart(2, "0"),
        month:date.getMonth().toString().padStart(2, "0"),
        year:date.getFullYear(),
        hour:date.getHours().toString().padStart(2, "0"),
        minute:date.getMinutes().toString().padStart(2, "0"),
        durationHour:Math.floor(json.numIntervals*30/60),
        durationMinute:json.numIntervals*30%60,
        numIntervals:json.numIntervals,
        chair:json.chair,
        date:json.date
      }
      return(temp)
    })

    switch(sorted){
      case filter.day:
        if(prime)
          result = sortByKey(result, "day")
        else
          result = sortByKeyDescending(result, "day")
        break
      case filter.month:
        if(prime)
          result = sortByKey(result, "month")
        else
          result = sortByKeyDescending(result, "month")
        break
      case filter.length:
        if(prime)
          result = sortByKey(result, "numIntervals")
        else
          result = sortByKeyDescending(result, "numIntervals")
        break
      default:
    }

    result.forEach((json)=>{
      JSX.push(<Appointment key={json.date} {...json}/>)
    })
    let filterJSX = []

    for(let prop in filter){
      var backColor = sorted == filter[prop] ? "grey" : "white"
      var style = {backgroundColor:backColor, width:"100%", textAlign:"center"}
      console.log(backColor, sorted, filter[prop])
      filterJSX.push(<span style={{backgroundColor:backColor, width:"100%", textAlign:"center", border:"#EEEEEE 2px solid"}} key={prop} onClick={()=>{this.handleFilterClick(filter[prop])}}>{sorted == filter[prop] ? (prime ? 'v' : '^') : ' '} {prop}</span>)
    }

    return (
      <div>
        Sort By:
        <Flexbox flexDirection="row" justifyContent="space-around">
          {filterJSX}
        </Flexbox>

        <ul>
          {JSX}
        </ul>
      </div>
    );
  }
}


export default KaiserNumberResult;