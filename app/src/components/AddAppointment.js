import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import fire from '../firebase/index.js'

class AddAppointment extends Component
{
  constructor(props) 
  {
    super(props);
    this.state = 
    {
      kaiserNumber:"1234567890",
      month:"03",
      day:"12",
      year:"2018",
      hour:"09",
      halfHour:"00",
      numIntervals:5,
    }

    this.onClicked = this.onClicked.bind(this)
    this.isAvailable = this.isAvailable.bind(this)
    this.addToDatabase = this.addToDatabase.bind(this)
  }



  async isAvailable(state)
  {
    var snap = await fire.database.ref(`/dates/${state.year}/${state.month}/${state.day}/chairs`).once('value')

    if(!snap.val())
    {
      return 0
    }

    var json = snap.val()

    for(var chair=0; chair < 23; chair++){
        if(!json[chair]){
          return chair
        }
        let temp = json[chair].timeSlots
        let n = this.state.numIntervals
        for(var i=this.state.hour; i < this.state.hour + Math.ceil(this.state.numIntervals/2); i++)
        {
          let j = i.toString().padStart(2,"0")
          console.log(temp[j])
          if (temp[j])
          {
            if (temp[j].a)
            {
              //check a
              if(temp[j].a.taken == "-1")
                n--
              else
                break
            }
            else
            {
              n--
            }

            if(n == 0)
              return chair

            if (temp[j].b)
            {
              //check b
              if(temp[j].b.taken == "-1")
                n--
              else
                break
            }
            else
            {
              n--
            }
          }
          else
          {
            n -= 2
          }

          if (n == 0)
            return chair
        }
    }
    return -1
  }

  async addToDatabase(chairAvail)
  {

    var {day, month, year, hour, halfHour, numIntervals, kaiserNumber} = this.state
    //check if the date is already taken

    var date = new Date()
    date.setDate(parseInt(day))
    date.setMonth(parseInt(month))
    date.setYear(parseInt(year))
    date.setHours(parseInt(hour))
    date.setMinutes(parseInt(halfHour))
    let json = {}
    console.log(date)
    console.log(this.state)
    json[date.getTime()] = {chair:chairAvail,numIntervals:numIntervals}

    //ADD TO PATIENTS
    console.log(json)
    await fire.database.ref(`/patients/${kaiserNumber}/appointments`).update(json)


    //ADD TO DATES
    let i =0;
    while(numIntervals > 0){
      let tempJSON = {}
      if(numIntervals >= 2){
        tempJSON = {
          a:{
            taken:kaiserNumber
          },
          b: {
            taken:kaiserNumber
          }
        }
        numIntervals -= 2
      } else {
        tempJSON = {
          a:{
            taken:kaiserNumber
          },
          b:{
            taken:-1
          }

        }
        numIntervals -= 1
      }

      let temp = parseInt(hour) + i
      await fire.database.ref(`/dates/${year}/${month}/${day}/chairs/${chairAvail}/timeSlots/${temp.toString().padStart(2,"0")}`).update(tempJSON) 
      i++

    }
  }


  async onClicked()
  {
    var {day, month, year, hour, halfHour, numIntervals} = this.state
    //check if the date is already taken
    var chairAvail = await this.isAvailable(this.state)
    console.log(chairAvail)
    if (chairAvail == -1)
    {
      alert("Error: No time available")
      return
    }
    console.log(chairAvail)
    this.addToDatabase(chairAvail)


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
        <button onClick={this.onClicked}/>
      </div>
    );
  }
}


export default AddAppointment;