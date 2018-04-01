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
      kaiserNumber:"",
      month:"",
      day:"",
      year:"",
      hour:"",
      halfHour:"",
      numIntervals:0,
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

    for(var chair in json)
    {
        let temp=json[chair].timeSlots
        let n = this.state.numIntervals
        for(var i=this.state.hour; i < this.state.hour + Math.ceiling(this.state.numIntervals/2); i++)
        {
          let j = i.toString().padString(2,"0")
            
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

  async addToDatabase()
  {
    var snap = await fire.database.ref(`/patients/${kaiserNumber}/appointments`).update({})

    var date = new Date()
    date.setDay(parseInt(day))
    date.setMonth(parseInt(month))
    date.setYear(parseInt(year))
    date.setHours(parseInt(hour))
    date.setMinutes(hparseInt(halfHour))
    var json = {}
    json[date.getDate()] = {chair:chairAvail,numIntervals:numIntervals}
    fire.database.ref(`/patients/${kaiserNumber}/appointments`).update(json)

  }


  onClicked()
  {
    var {day, month, year, hour, halfHour, numIntervals} = this.state
    //check if the date is already taken
    var chairAvail = isAvailable(this.state)
    if (chairAvail == -1)
    {
      alert("Error: No time available")
      return
    }

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
        <button onClicked={this.onClicked}/>
      </div>
    );
  }
}


export default AddAppointment;