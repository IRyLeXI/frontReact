import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import './Chat.css';
import UserSideBar from '../UserSideBar';
import SideBar from '../../MainPage/SideBar';
import refreshToken from '../../../Helpers/refreshToken'

const Chat = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [chatRoomId, setChatRoomId] = useState(null);
    const [user2Name, setUser2Name] = useState('');
    const userId = jwtDecode(localStorage.getItem("jwtToken")).Id;
    const user2Id = localStorage.getItem("user2Id");
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const fetchUser2Name = async () => {
            try {
                const response = await axios.get(`https://localhost:7068/api/User/id/${user2Id}`);
                if (response.status === 200) {
                    setUser2Name(response.data.username);
                }
            } catch (error) {
                console.error('Error fetching user2 name:', error);
            }
        };

        fetchUser2Name();

        const newConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:7068/chat")
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, [user2Id]);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connection started');
                    console.log(userId, user2Id);

                    connection.invoke("JoinChat", userId, user2Id)
                        .then(chatRoomId => {
                            setChatRoomId(chatRoomId);
                            console.log(`Joined chat room: ${chatRoomId}`);
                            fetchChatMessages(userId, user2Id);
                        })
                        .catch(e => console.log('JoinChat failed: ', e));

                    connection.on("RecieveMessage", (userId, message) => {
                      
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const fetchChatMessages = async (userId, user2Id) => {
          const authorized = await refreshToken();
                setIsAuthorized(authorized);
        try {
            const response = await axios.get('https://localhost:7068/api/Messages/GetAll', {
                params: {
                    userid1: userId,
                    userid2: user2Id
                }
            });
            if (response.status === 200) {
                setMessages(response.data);
            }
        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };

    const sendMessage = async () => {
        if (connection.state === "Connected") {
            await connection.invoke("SendMessage", userId, user2Id, message)
                .catch(e => console.log('SendMessage failed: ', e));
            setMessage('');
        } else {
            alert('No connection to server yet.');
        }
    };

    return (
        <div> {isAuthorized ? <UserSideBar /> : <SideBar />}
        <div className="chat-page">
           
            <div className="chat-container">
                <div className="messages-container">
                    {messages.map((m, index) => (
                        <div key={index} className={m.userId === userId ? 'message message-sent' : 'message message-received'}>
                            <b>{m.userId === userId ? 'You' : user2Name}</b>: {m.message}
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input className="chat-input"
                        type="text"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                    <button className="chat-button" onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Chat;
