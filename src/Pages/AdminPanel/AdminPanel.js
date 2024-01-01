import React, { useEffect, useState } from "react";
import refreshToken from "../../Helpers/refreshToken";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import UserSideBar from "../UserPage/UserSideBar";
import SideBar from "../MainPage/SideBar";
import "./AdminPanel.css"
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
                    console.log(localStorage.getItem("jwtToken"))
                    let decoded = jwtDecode(localStorage.getItem("jwtToken"));
                    const response = await axios.get(`http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/User/Id/${decoded.Id}`);
                    if (response.status === 200) {
                        setUser(response.data);

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

            const response = await axios.get(`http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Admin/Pending`, {
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
                    <div className="request-page-container">

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
    const [user,setUser] =useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/User/Id/${request.userId}`);
                if (response.status === 200) {
                    setUser(response.data);
                    console.log(response.data);
                }

            } catch (error) {
                console.error('Error during data fetching:', error);
            }
        };

        fetchData();
    }, []);

    const handleAccept =async (id) => {

        let jwtToken = localStorage.getItem("jwtToken")
        console.log(jwtToken)
        const response = await axios.put(`http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Admin/Accept/${id}`, null, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        })
        if(response.status===200)
        {
            window.location.reload();
        }
    }
    const handleReject =async (id) => {
        let jwtToken = localStorage.getItem("jwtToken")
        const response = await axios.put(`http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Admin/Reject/${id}`,null, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });
        if(response.status===200)
        {
            window.location.reload(); // або window.location.href = window.location.href;

        }
        }

    return (
        <div className="request-container">
            {user && (
                <div className="request-card">
                    <div className="request-left-section">
                        <div className="request-image" style={{ backgroundImage: `url(${user.avatar})` }}></div>
                        <h1>{user.username}</h1>
                        <p>{user.firstName} {user.lastName}</p>
                    </div>
                    <div className="request-right-section">
                        <p className="request-description">{request.description}</p>
                        <div className="request-buttons">
                            <button onClick={() => handleAccept(request.id)}>Accept</button>
                            <button onClick={() => handleReject(request.id)}>Decline</button>
                        </div>

                    </div>

                </div>
            )}
        </div>

    );
};



export default AdminPanel;
