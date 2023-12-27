import React, { useEffect, useState } from "react";
import refreshToken from "../../Helpers/refreshToken";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import UserSideBar from "../UserPage/UserSideBar";
import SideBar from "../MainPage/SideBar";
import AdminSidebar from "./AdminSidebar";
import {Link} from "react-router-dom";

const AdminPanel = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [user, setUser] = useState();
    const [requests,setRequests]= useState();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const authorized = await refreshToken();
                setIsAuthorized(authorized);

                if (authorized) {
                    let decoded = jwtDecode(localStorage.getItem("jwtToken"));
                    const response = await axios.get(`https://localhost:7224/api/User/Id/${decoded.Id}`);
                    if (response.status === 200) {
                        setUser(response.data);
                        console.log(response.data);
                    }
                }
            } catch (ex) {
                console.error('Error during authorization check:', ex);
            }
        };
        const GetAllResumes= async ()=>
        {
            let decoded = jwtDecode(localStorage.getItem("jwtToken"));
            let jwtToken = localStorage.getItem("jwtToken")
            console.log("our User id " +decoded.role)

            const response = await axios.get(`https://localhost:7224/api/Admin/Pending`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            setRequests(response.data)
            console.log(response);
        }
        const checkRole = async () => {
            if (user.role === "admin")
                setIsAdmin(true);
            else
                setIsAdmin(false);
        };
        GetAllResumes();
        checkAuthorization();

    }, []);

    return (
                    <div>

                        {requests && requests.length > 0 ? (
                            requests.map((request) => (
                                <UserCard key={request.id} request={request} />
                            ))
                        )

                            : (
                            <p>No requests found</p>
                        )}
                    </div>

    );
}



const UserCard = ({ request }) => {
    if(request.resume!=null) console.log(1);
    return (
        <div className="user-card">
            <h3>{request.id}</h3>
            <Link to={`/pdf-viewer`} state={{ file: request.resume }}>Open PDF</Link>
        </div>
    );
};



export default AdminPanel;
