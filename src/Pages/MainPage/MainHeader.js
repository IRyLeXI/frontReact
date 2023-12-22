import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MainHeader.css';

function SignOut(){

  function onSignOutHandler(){
      localStorage.removeItem("jwtToken");
      if(localStorage.getItem("jwtToken")===null)
      {console.log("deleted jwt")}
      localStorage.removeItem("refreshToken")
      if(localStorage.getItem("refreshToken")===null)
      {console.log("deleted ref")}
  }
    return(
        <span className="sign-out"><Link onClick={onSignOutHandler} to="/login">Sign Out</Link></span>
    )
}

function MainHeader({ isAuthenticated }) {






    return (
        <header className="header">
            <div className="login-reg-text">
                {isAuthenticated ? (
                    <>
                        <SignOut></SignOut>
                    </>
                ) : (
                    <>
                        <span className="login"><Link to="/login">Login</Link></span>
                        <span className="separator">/</span>
                        <span className="register"><Link to="/register">Register</Link></span>
                    </>
                )}
            </div>
            <div className="center-text">
                <h1>MADEN</h1>
                <p>Make Life Easier</p>
            </div>
        </header>
    );
}

export default MainHeader;
