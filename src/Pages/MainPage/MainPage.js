import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import styles from './MainPage.css';
import MainHeader from "./MainHeader";
import mainFooter from "./MainFooter";
import MainFooter from "./MainFooter";
function MainPage() {
    return (
        <div className="container">
            <div className="sideBar">
                {/* Вміст бокової панелі */}
            </div>
            <div className="content">
                  <MainHeader></MainHeader>
                <main className="main-content">
                    {
                        <p>gw</p>
                    }
                </main>
               <MainFooter></MainFooter>
            </div>
        </div>
    );
}

export default MainPage;
