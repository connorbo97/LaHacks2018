import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'
import Appointment from './Appointment.js'
import Flexbox from 'flexbox-react';

class DateResult extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    var {result, day, month, year} = this.props

  	let arr = []

    let base = []
    let timeLabels = []
    for(var i=0; i < 49; i++){
      var content = ""
      if(i % 2 == 1){
        content=Math.floor(i/2)
      }
      base.push(<span style={{border:"black 1px solid", width:"100%", height:"26px", color:"white", backgroundColor:"green", fontSize:"16px"}}>{content}</span>)
    }

  	result.forEach((chair, index)=>{
  		var appointments = []
      var copy = base.slice(1)
      chair.forEach((json)=>{
        appointments.push((<Appointment forDate={true} {...json}/>))
        console.log(json.kid)
        if(json.kid){
          let halfHour = json.minute == "00" ? 0 : 1
          let newContent = ""
          if(!halfHour){
            newContent = parseInt(json.hour)
          }
          copy[parseInt(json.hour)*2+halfHour] = (<span style={{border:"black 1px solid", width:"100%", height:"26px", color:"white", backgroundColor:"red", fontSize:"16px"}}>{newContent}</span>)
          
        }
      })
  		arr.push((
        <div>
          Chair #{index + 1}:
          <ul>
            <Flexbox >
              {timeLabels}
            </Flexbox>
            <Flexbox >
              {copy}
            </Flexbox>
            {appointments}
          </ul>
        </div>
      ))
  	})

    let timeSlots=[]
    // for(var i=0; i < 24; i++){
    //   //{Math.floor(i*30/60)+12}:{i*30%60}
    //   timeSlots.push(<span style={{border:"#EEEEEE 1px solid", width:"100%", height:"10px"}}></span>)
    // }
    return (
      <div>
        Date: {month}/{day}/{year}
        <Flexbox justifyContent="space-between">
          {timeSlots}
        </Flexbox>
        {arr}
      </div>
    );
  }
}


export default DateResult;