import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import styles from './MainPage.css';
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";
import MainPageForm from "./MainPageForm";


import SideBar from "./SideBar";
function MainPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    return (

        <div className={`container`}>

            <SideBar />
            <div className="content">
                <MainHeader />
                <main className="main-content">
                    <div className="row">
                        <div className="column">
                            <div className="image-container">
                                <img className="mainImage2" src="/form1.svg" alt={""}/>
                                <MainPageForm text="Ваш текст тут" />
                            </div>
                            <div className="image-container">
                                <img className="mainImage2" src="/form3.svg" alt={""}/>
                                <MainPageForm text="Ваш текст тут" />
                            </div>
                        </div>
                        <div className="column">
                            <div className="image-container">
                                <MainPageForm text="Ваш текст тут" />
                                <img className="mainImage2" src="/form2.svg" alt={""}/>
                            </div>
                            <div className="image-container">
                                <MainPageForm text="Happy colective  mathapaka beach  u see me?da awdawd awdaw" />
                                <img className="mainImage2" src="/form4.svg" alt={""}/>
                            </div>
                        </div>
                    </div>
                </main>
                <MainFooter />
            </div>
        </div>
    );
}

export default MainPage;

