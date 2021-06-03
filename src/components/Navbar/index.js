import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavbarElements';

const Navbar = () => {
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
          <NavLink to='/wpm' activeStyle>
            WPM
          </NavLink>
          {/*  <NavLink to='/login' activeStyle>
            Login
          </NavLink> */}
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        <NavBtn>
          <NavBtnLink to='/login'>Sign In</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;