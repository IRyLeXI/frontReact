import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import "./UserSideBar.css"
import refreshToken from "../../Helpers/refreshToken";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import SideBar from "../MainPage/SideBar";

function UserSideBar() {
    const [navBarState, setNavBarState] = useState(false);
    const [role, setRole] =useState(false)
    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                    let decoded = jwtDecode(localStorage.getItem("jwtToken"));
                    console.log(decoded.role)
                if(decoded.role==="Mentor")
                {
                    setRole("mentor")
                }
                if(decoded.role==="Admin")
                {
                    setRole("admin")
                }
                if(decoded.role==="Investor")
                    {
                        setRole("investor")
                    }
            } catch (ex) {
                console.error('Error during authorization check:', ex);
            }
        };

        checkAuthorization();
    }, []);    return(
        <>

            <button className="nav-bar-button" onClick={() => setNavBarState(!navBarState)}>+</button>

            {  navBarState && (
                <div className="nav-bar">
                    <div>
                        <img className="nav-bar-logo" src="/logo.svg"/>
                    </div>
                    {role==="admin" ? <div className="nav-bar-caption">
                        <Link to="/admin/panel" className="nav-bar-side"> <button className="nav-bar-links">Адмін</button> </Link>
                    </div>:<div></div> }
                    {role==="investor" ? <div className="nav-bar-caption">
                        <Link to="/investions" className="nav-bar-side"> <button className="nav-bar-links">Мої інвестиції</button> </Link>
                    </div>:<div></div> }
                    <div className="nav-bar-caption">
                        <Link to="/main" className="nav-bar-side"> <button className="nav-bar-links">Основна</button> </Link>
                    </div>
                    <div className="nav-bar-caption">
                        <Link to="/chats" className="nav-bar-side"> <button className="nav-bar-links">Чати</button> </Link>
                    </div>
                    <div className="nav-bar-caption">
                        <Link to="/projects" className="nav-bar-side"><button className="nav-bar-links">Стартапи</button></Link>
                    </div>
                    <div className="nav-bar-caption">
                        <Link to="/events" className="nav-bar-side"><button className="nav-bar-links">Статті</button></Link>
                    </div>
                    <div className="nav-bar-caption">
                        <Link to="/users" className="nav-bar-side"><button className="nav-bar-links">Спільнота</button></Link>
                    </div>
                   
                    <div className="nav-bar-caption">
                        <Link to="/user/page" className="nav-bar-side"><button className="nav-bar-links">Профіль</button></Link>
                    </div>
                    <div>

                    </div>
                </div>
            )}
        </>
    );

}
export default UserSideBar;