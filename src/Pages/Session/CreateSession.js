import React, { useState, useEffect } from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import "./CreateSession.css"
import refreshToken from "../../Helpers/refreshToken";
const AddSession = () => {
    const decoded = jwtDecode(localStorage.getItem("jwtToken"));
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [sessionData, setSessionData] = useState({
        PsychologistId: decoded.Id,
        Name: "",
        BeginDate: "",
        EndDate: "",
        Description: "",
        Friends: [],

        UserId: "",
        FriendId:""
    });
    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                if (localStorage.getItem("jwtToken") != null) {
                    let response =await refreshToken();
                    setIsAuthorized(response)
                    if(!response) {
                        navigate("/main");
                    }
                }

            } catch (ex) {
                console.error('Error during authorization check:', ex);
            }
        };
        checkAuthorization();
        const fetchFriends = async () => {
            try {
                const friendsResponse = await axios.get(`http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Friends/${decoded.Id}`);
                if (friendsResponse.status === 200) {
                    console.log(friendsResponse.data);

                    const friendsArray = friendsResponse.data.map(friend => ({
                        firstName: friend.firstName,
                        lastName: friend.lastName,
                        id:friend.id
                    }));

                    setSessionData({ ...sessionData, Friends: friendsArray });
                    console.log(sessionData)
                    console.log(decoded.Id)
                }
            } catch (error) {
                console.error("Помилка при отриманні списку друзів:", error);
            }
        };
        fetchFriends();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSessionData({ ...sessionData, [name]: value });

    };

    const handleFriendChange = (e) => {
        const selectedIndex = e.target.selectedIndex-1;

         const friendId = sessionData.Friends[selectedIndex].Id;

         setSessionData({ ...sessionData, UserId: e.target.value, FriendId: friendId });


    };




    const handleSubmit = async (e) => {
        e.preventDefault(); // Забезпечте виконання цієї функції
        let jwtToken = localStorage.getItem("jwtToken")

        try {
            const friendsResponse = await axios.post(
                `http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Sessions/Create`,
                {
                    PsychologistId: decoded.Id,
                    UserId: sessionData.UserId,
                    Name: sessionData.Name,
                    BeginDate: sessionData.BeginDate,
                    EndDate: sessionData.EndDate,
                    Description: sessionData.Description
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    }
                }
            );

            if (friendsResponse.status === 200) {
                console.log(friendsResponse.data);
              navigate("/sessions")
            }
            console.log(sessionData)
        } catch (error) {
            console.error("Помилка при створенні сесії:", error);
        }
    };


    return (
        <>
            {isAuthorized ? (
        <div className="session-card-create">
            <h2>Додати сесію</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group-create">
                    <label htmlFor="name">Назва:</label>
                    <input
                        type="text"
                        id="name"
                        name="Name"
                        value={sessionData.Name}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="beginDate">Дата початку:</label>
                    <input
                        type="datetime-local"
                        id="beginDate"
                        name="BeginDate"
                        value={sessionData.BeginDate}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="endDate">Дата завершення:</label>
                    <input
                        type="datetime-local"
                        id="endDate"
                        name="EndDate"
                        value={sessionData.EndDate}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="description">Опис:</label>
                    <textarea className="text-area"
                        id="description"
                        name="Description"
                        value={sessionData.Description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div className="input-group">
                    <label htmlFor="friends">Виберіть друга:</label>
                    <select
                        className="select-friend"
                        id="friends"
                        name="FriendId"
                        value={sessionData.FriendId}
                        onChange={handleFriendChange}
                    >
                        <option value="" disabled>Select User</option>
                        {sessionData.Friends.map((friend, index) => (
                            <option key={index} value={friend.id}>
                                {friend.firstName + " " + friend.lastName}
                            </option>
                        ))}
                    </select>

                </div>

                <button onClick={handleSubmit} type="submit">Створити</button>

            </form>
        </div>
            ) : (
                <div>Not authorized</div>
            )}
        </>
    );

};

export default AddSession;
