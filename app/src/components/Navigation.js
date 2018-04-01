import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {Nav, Navbar, NavItem, MenuItem, Image} from 'react-bootstrap'
import SignOut from './SignOut.js'
import * as routes from '../constants/routes';

class Navigation extends Component{
	render(){
		return (
			<Navbar style={{width:"105%"}}inverse collapseOnSelect>
			  <Navbar.Header>
			    <Navbar.Brand>
			        <Link to={routes.HOME}>KP Scheduling</Link>
		        </Navbar.Brand>
			    <Navbar.Toggle />
			  </Navbar.Header>
			  <Navbar.Collapse>
			    <Nav pullRight>
			      <NavItem eventKey={1}>
			        <SignOut/>
			      </NavItem>
			    </Nav>
			  </Navbar.Collapse>
			</Navbar>
		)
	}
}
  

export default Navigation;