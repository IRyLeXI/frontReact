import {Link} from "react-router-dom";
import {useState} from "react";
import "./UserSideBar.css"

function UserSideBar() {
    const [navBarState, setNavBarState] = useState(false);

    return(
        <>

            <button className="nav-bar-button" onClick={() => setNavBarState(!navBarState)}>+</button>

            {  navBarState && (
                <div className="nav-bar">
                    <div>
                        <img className="nav-bar-logo" src="/logo.svg"/>
                    </div>
                    <div className="nav-bar-caption">
                        <Link to="/chats" className="nav-bar-side"> <button className="nav-bar-links">Чати</button> </Link>
                    </div>
                    <div className="nav-bar-caption">
                        <Link to="/psychologists" className="nav-bar-side"><button className="nav-bar-links">Наші Психологи</button></Link>
                    </div>
                    <div className="nav-bar-caption">
                        <Link to="/events" className="nav-bar-side"><button className="nav-bar-links">Друзі</button></Link>
                    </div>
                    <div>

                    </div>
                </div>
            )}
        </>
    );

}
export default UserSideBar;