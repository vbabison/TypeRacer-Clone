import React from 'react';
import { Link } from "react-router-dom";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavbarElements';
  
const Navbar = (props) => {
  const { currentUser, setShowModal, logOut } = props;
  return (
    <>
      <Nav>
        <NavLink to='/'>
          {/* <img src={require('../../images/logo.png')} alt='logo' /> */}
          <h1>TypeRace</h1>
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to='/race' activeStyle>
            Race
          </NavLink>
          <NavLink to='/charts' activeStyle>
            Charts
          </NavLink>
          <NavLink to='/passages' activeStyle>
            Passages
          </NavLink>
          {/*  <NavLink to='/login' activeStyle>
            Login
          </NavLink> */}
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        <NavBtn>
          {currentUser ? (
                <a href="/" onClick={logOut}>LogOut</a>
            ) : (
              <NavBtnLink to='/login' onClick={setShowModal}>Sign In</NavBtnLink>
            )}
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;