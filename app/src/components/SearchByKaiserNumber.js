import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'

class SearchByKaiserNumber extends Component{
  constructor(props) {
    super(props);

    this.state = {
      number:"1234567890"
    }

    this.setNumber = this.setNumber.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  setNumber(event){
    this.setState({number:event.target.value})
  }

  onSubmit(event){
    event.preventDefault()
    this.props.setKaiserNumberResult(this.state.number)
  }

  render() {
    console.log(this.state.number)
    return (
      <form onSubmit={this.onSubmit}>
        Kaiser Number
        <input type="text" placeholder="XXXXXXXXXX" value={this.state.number} onChange={this.setNumber}/>
      </form>
    );
  }
}


export default SearchByKaiserNumber;