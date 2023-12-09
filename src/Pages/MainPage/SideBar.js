import { useState } from 'react';
import './Sidebar.css';
import {Link} from "react-router-dom";
// import punlic from "public"

function SideBar({ isOpen, setIsOpen }) {
    const [navBarState, setNavBarState] = useState(false);


    return (
        <>

                <button className="nav-bar-button" onClick={() => setNavBarState(!navBarState)}>+</button>

            {  navBarState && (
                <div className="nav-bar">
                    <div>
                        <img className="nav-bar-logo" src="/logo.svg"/>
                    </div>
                    <div className="nav-bar-caption">
                        <Link to="/main" className="nav-bar-home"> <button className="nav-bar-links">Про нас</button> </Link>
                    </div>
                    <div className="nav-bar-caption">
                        <Link to="/psychologists" className="nav-bar-side"><button className="nav-bar-links">Наші Психологи</button></Link>
                    </div>
                    <div className="nav-bar-caption">
                        <Link to="/events" className="nav-bar-side"><button className="nav-bar-links">Події</button></Link>
                    </div>
                    <div className="nav-bar-caption">
                        <Link to="/articles" className="nav-bar-side"><button className="nav-bar-links">Цікаві статті</button></Link>
                    </div>
                    <div>

                    </div>
                </div>
                )}
        </>
    );
}
export default SideBar;
