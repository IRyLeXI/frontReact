import styles from "./Sidebar.css"
function SideBar() {
    return (
        <div>
            <div className="sideBar">
                <img src="/logo.svg"/>
                <button className="sidebar-button">Про нас</button>
                <button className="sidebar-button">Наші Психологи</button>
                <button className="sidebar-button">Цікаві статті</button>
                <button className="sidebar-button">Події</button>
            </div>

        </div>


    )
}

export default SideBar