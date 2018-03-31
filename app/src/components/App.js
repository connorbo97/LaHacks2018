
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
import Home from './Home';

class App extends Component{
  constructor(props){
    super(props)

    this.state = {
      uid:null,
      pathname:"/loading",
    }

    this.onAuthChangeHandler = this.onAuthChangeHandler.bind(this)

    auth.auth.onAuthStateChanged(this.onAuthChangeHandler)
  }

  onAuthChangeHandler(user){
    console.log("what")
    if (user) {
      console.log("User signed in")
      this.setState({uid:user.uid})
    } else {
      console.log("User not logged in")
    }
  } 

  setPathname(path){
    this.setState({pathname:path})
  }

  render(){
    return(
      <Router>
        <div>
          <Navigation/>
          <hr/>
          <Route
            exact path={routes.LANDING}
            component={() => (this.state.uid ? (<Redirect to={routes.HOME}/>) : (<div>Welcome!<SignIn /></div>))}/>
          <Route
            exact path={routes.SIGN_IN}
            component={() => (this.state.uid ? (<Redirect to={routes.SIGN_IN}/>) : (<SignIn />))}/>}
          />
          <Route
            exact path={routes.HOME}
            component={() => <Home />}
          />
        </div>
      </Router>
    )
  }
}

export default App;
