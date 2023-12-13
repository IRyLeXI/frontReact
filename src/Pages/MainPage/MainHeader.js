import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MainHeader.css';

function MainHeader({ isAuthenticated }) {
    return (
        <header className="header">
            <div className="login-reg-text">
                {isAuthenticated ? (
                    <>
                        <span className="sign-out"><Link to="/logout">Sign Out</Link></span>
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
