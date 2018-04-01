import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../firebase/index.js'
import KaiserNumberResult from './KaiserNumberResult.js'
import DateResult from './DateResult.js'

class Result extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    if(this.props.type == "KN"){
      return (<KaiserNumberResult redoSearch={this.props.redoSearch} kaiserNumber={this.props.kaiserNumber} loading={this.props.loading} errorMsg={this.props.errorMsg} result={this.props.result}/>)
    } else if(this.props.type == "D"){
      return (<DateResult loading={this.props.loading} errorMsg={this.props.errorMsg} result={this.props.result} day={this.props.day} year={this.props.year} month={this.props.month}/>);
    } else {
      return (<span>Use filters above to search for appointments</span>)
    }
  }
}


export default Result;