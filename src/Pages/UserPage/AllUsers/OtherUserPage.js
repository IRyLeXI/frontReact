import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserSideBar from "../UserSideBar";
import refreshToken from '../../../Helpers/refreshToken';
import './../UserPage.css';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import SideBar from "../../MainPage/SideBar";

function OtherUserPage() {
    const { userId } = useParams();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const authorized = await refreshToken();
                setIsAuthorized(authorized);

                if (authorized) {
                    const response = await axios.get(`https://localhost:7068/api/User/id/${userId}`);
                    if (response.status === 200) {
                        setUser(response.data);
                        console.log(response.data);
                    }
                }
            } catch (ex) {
                console.error('Error during authorization check:', ex);
            }
        };

        checkAuthorization();
    }, [userId]);

    if (!isAuthorized) {
        return (
            <div>
                <SideBar />
                Error: User not authorized.
            </div>
        );
    }

    return (
        <div>
            <UserSideBar />
            <div className="single-page-container">
                {user && (
                    <div className="user-card">
                        <div className="left-section">
                            <div className="user-image">
                                <img src={`data:image/jpeg;base64,${user.imageBase64}`} alt="User Avatar" />
                            </div>
                            <h1>{user.username}</h1>
                            <p>{user.firstname} {user.lastname}</p>
                        </div>
                        <div className="right-section">
                            <p className="user-description">
                                <strong>Skills:</strong> {user.skills || 'No skills provided'}
                            </p>
                            <p className="user-description">
                                <strong>Education:</strong> {user.education || 'No education information provided'}
                            </p>
                            <p className="user-description">
                                <strong>Experience:</strong> {user.expirience || 'No experience information provided'}
                            </p>
                            {user.role === 'Investor' && (
                                <p className="user-description">
                                    <strong>Investment Info:</strong> {user.investment_info || 'No investment information provided'}
                                </p>
                            )}
                            <Link to="/chats">
                                <button className="edit-button-user">Send Message</button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OtherUserPage;
