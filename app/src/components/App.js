
/**
 * App
 */
// import Navigation from './Navigation';
// import LandingPage from './Landing';
// import SignUpPage from './SignUp';
// import SignInPage from './SignIn';
// import PasswordForgetPage from './PasswordForget';
// import HomePage from './Home';
// import AccountPage from './Account';

import React, {Component} from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';
import * as routes from '../constants/routes';
import auth from '../firebase/index.js'
import SignIn from './SignIn.js'
import Navigation from './Navigation';
import Loading from './Loading';
import Home from './Home';

class App extends Component{
  constructor(props){
    super(props)

    this.state = {
      uid:null,
      pathname:"/loading",
      checkedAuth:false,
    }

    this.onAuthChangeHandler = this.onAuthChangeHandler.bind(this)

    auth.auth.onAuthStateChanged(this.onAuthChangeHandler)
  }

  onAuthChangeHandler(user){
    if (user) {
      console.log("User signed in")
      this.setState({uid:user.uid})
    } else {
      console.log("User not logged in")
      this.setState({uid:null})
    }

    this.setState({checkedAuth:true})
  } 

  setPathname(path){
    this.setState({pathname:path})
  }
  render(){
    console.log(this.state.uid)
    console.log(this.state.checkedAuth)
    if(!this.state.checkedAuth)
      return (<Loading/>)

    
    return(
      <Router>
        <div>
        <Navigation/>
          <Route
            exact path={routes.LANDING}
            component={() => (this.state.uid ? (<Redirect to={routes.HOME}/>) : (<div>Welcome!<SignIn /></div>))}
          />
          <Route
            exact path={routes.SIGN_IN}
            component={() => (this.state.uid ? (<Redirect to={routes.HOME}/>) : (<SignIn />))}
          />
          <Route
            exact path={routes.HOME}
            component={() => ((!this.state.uid) ? (<Redirect to={routes.SIGN_IN}/>) : (<Home />))}
          />
        </div>
      </Router>
    )
  }
}

export default App;
