import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom';

const UserChats = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const userId = jwtDecode(localStorage.getItem("jwtToken")).Id;

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const response = await axios.get(`https://localhost:7068/api/Chat/GetUserChatRooms/${userId}`);
                setChatRooms(response.data);
            } catch (error) {
                console.error('Error fetching chat rooms:', error);
            }
        };

        fetchChatRooms();
    }, [userId]);

    return (
        <div>
            <h2>Your Chats</h2>
            <ul>
                {chatRooms.map(room => (
                    <li key={room.id}>
                        <Link to={`/chat/${room.id}`}>Chat Room {room.id}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserChats;
