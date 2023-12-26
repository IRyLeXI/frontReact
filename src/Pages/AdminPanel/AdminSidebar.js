import {Link} from "react-router-dom";
import {useState} from "react";
import "./../UserPage/UserSideBar"

function AdminSidebar() {
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
                        <Link to="/main" className="nav-bar-side"> <button className="nav-bar-links">Нові психологи</button> </Link>
                    </div>
                </div>
            )}
        </>
    );

}
export default AdminSidebar;