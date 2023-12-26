import React, { useEffect, useState } from 'react';
import './Psyholog.css';
import SideBar from '../../MainPage/SideBar';
import refreshToken from '../../../Helpers/refreshToken';
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import UserSideBar from "../../UserPage/UserSideBar";
import {Link} from "react-router-dom";

const SinglePsychology = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [psyhologist, setPsyhologist] = useState();

    useEffect(() => {

        const checkAuthorization = async () => {
            try {
                const authorized = await refreshToken();
                setIsAuthorized(authorized);
            } catch (ex) {
                console.error('Error during authorization check:', ex);
            }
        };

        const getPsyhologist = async () => {
            try {
                const response = await axios.get(`https://localhost:7224/api/User/Id/${localStorage.getItem("cardId")}`);
                if (response.status === 200) {
                    setPsyhologist(response.data);
                    console.log(response.data);
                }
            } catch (error) {
                console.error('Error during data fetching:', error);
            }
        };

        const fetchData = async () => {
            try {
                const authorized = await refreshToken();
                setIsAuthorized(authorized);
                await getPsyhologist();
            } catch (error) {
                console.error('Error during data fetching:', error);
            }
        };

        fetchData();


        checkAuthorization();
    }, []);

    const handleSendMessage = () => {
        let decoded = jwtDecode(localStorage.getItem("jwtToken"))
        if(decoded.Id!=psyhologist.id) {
            localStorage.setItem("user2Id", psyhologist.id)
        }
    };

    const handleAddFriend = () => {
        let decoded = jwtDecode(localStorage.getItem("jwtToken"))
        console.log(decoded.Id+"--------"+ psyhologist.id);
        if(decoded.Id!=psyhologist.id) {
            let response = axios.post("https://localhost:7224/api/Friends/SendRequest", {
                user1id: decoded.Id,
                user2id: psyhologist.id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            })
        }
    };

    return (
        <div>
            {isAuthorized ? <UserSideBar /> : <SideBar />}
            <div className="main-container">
                {psyhologist && (
                    <div className="single-psychologist-card">
                        <div className="psychologist-info">
                            <img className="psychologist-photo" src={psyhologist.avatar} alt={`${psyhologist.firstName} ${psyhologist.lastName}`} />
                            <div className="psychologist-details">
                                <h1>{`${psyhologist.firstName.toUpperCase()} ${psyhologist.lastName.toUpperCase()}`}</h1>
                                <div className="psychologist-buttons">
                                    <Link to={"/chats"}   onClick={handleSendMessage}><button className="user-messages-button">написати повідомлення</button></Link>

                                    <button  onClick={handleAddFriend}>Додати до друзів</button>
                                </div>
                            </div>
                        </div>
                        <p className="psychologist-description">{psyhologist.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SinglePsychology;
