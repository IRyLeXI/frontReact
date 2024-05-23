import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './Chats.css';
import UserSideBar from '../UserSideBar';
import SideBar from '../../MainPage/SideBar';
import refreshToken from '../../../Helpers/refreshToken'
const Chats = () => {
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState({});
    const navigate = useNavigate();
    const userId = jwtDecode(localStorage.getItem("jwtToken")).Id;
    const [isAuthorized, setIsAuthorized] = useState(false);
  
    useEffect(() => {
        
        const fetchChats = async () => {
            try {
                  const authorized = await refreshToken();
                setIsAuthorized(authorized);
                const response = await axios.get(`https://localhost:7068/api/chat/GetAll/${userId}`);
                if (response.status === 200) {
                    setChats(response.data);
                    fetchUsersInfo(response.data);
                    console.log(response.data);
                }
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        const fetchUsersInfo = async (chats) => {
            const usersInfo = {};
            for (let chat of chats) {
                const user2Id = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
                if (!usersInfo[user2Id]) {
                    const response = await axios.get(`https://localhost:7068/api/User/id/${user2Id}`);
                    if (response.status === 200) {
                        usersInfo[user2Id] = response.data;
                    }
                }
            }
            setUsers(usersInfo);
            console.log(users);
        };

        fetchChats();
    }, [userId]);

    const handleChatClick = (chat) => {
        const user2Id = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
        localStorage.setItem("user2Id", user2Id);
        navigate('/chat');
    };

    return (
        <div className="chats-container">
            {isAuthorized ? <UserSideBar /> : <SideBar />}
            <h2>Your Chats</h2>
            <div className="chats-list">
                {chats.map((chat) => {
                    const user2Id = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
                    const user = users[user2Id] || {};
                  
                    const imageUrl = user.imageBase64
        ? `data:image/jpeg;base64,${user.imageBase64}`
        : 'https://via.placeholder.com/300x200?text=No+Image+Available';
                    return (
                        <div key={chat.id} className="chat-card" onClick={() => handleChatClick(chat)}>
                            <img src={imageUrl} alt="User Avatar" />
                            <div className="chat-details">
                                <div className="chat-username">{user.username}</div>
                                <div className="chat-fullname">{user.firstname} {user.lastname}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Chats;
