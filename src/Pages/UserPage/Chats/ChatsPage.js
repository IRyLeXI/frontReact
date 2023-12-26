import React, {useEffect, useState} from 'react';

import './ChatPage.css';
import UserSideBar from "../UserSideBar";
import SideBar from "../../MainPage/SideBar";
import refreshToken from "../../../Helpers/refreshToken";
import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import {jwtDecode} from "jwt-decode";
import Chat from "./Chat/Chat";
import axios from "axios";
import {compareArraysAsSet} from "@testing-library/jest-dom/dist/utils";


function ChatPage(props) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [connection, setConnection] = useState();
    const [users, setUsers] = useState({});
    const [messages, setMessages] = useState([]);
    const  user2Id = localStorage.getItem("user2Id");
    const [chats,setChats] = useState([]);




    useEffect(() => {


        const checkAuthorization = async () => {
            try {
                const authorized = await refreshToken();
                setIsAuthorized(authorized);
            } catch (ex) {
                console.error('Error during authorization check:', ex);
            }

        };
        const AllChats=async () => {
            let decoded = jwtDecode(localStorage.getItem("jwtToken"));
            let jwtToken = localStorage.getItem("jwtToken")
            console.log("our User id " +decoded.Id)

            const response = await axios.get(`https://localhost:7224/api/Chats/${decoded.Id}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            setChats(response.data);
            console.log(response);

        }


        if(user2Id!=undefined){
            let decoded = jwtDecode(localStorage.getItem("jwtToken"));
            joinRoom(decoded.Id,user2Id);
        }

        checkAuthorization();
        const fetchData = async () => {
            try {
                await checkAuthorization();
                await AllChats();


            } catch (ex) {
                console.error('Error fetching data:', ex);
            }
        };

        fetchData();
        console.log(users)
    }, []);

    const joinRoom = async (User1Id, User2Id) => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl("https://localhost:7224/api/chat/")
                .configureLogging(LogLevel.Information)
                .build();

            connection.on("ReceiveMessage", (user, message) => {
                setMessages(messages => [...messages, { user, message }]);
            });
            connection.onclose(e => {
                setConnection();
                setMessages([]);

            });

            await connection.start();

            let messageList;
            connection.invoke("JoinOrCreatePrivateRoom", { User1Id, User2Id })
                .then(serverMessages => console.log("serverMessages " + serverMessages))
                .catch(error => console.log(error));

            console.log("messageList + " + messageList);
            setConnection(connection);

            console.log("Connection established:", connection);
            console.log("user2id= ", user2Id);

        } catch (e) {
            console.log(e);
        }
    }

    const sendMessage = async (message) => {
        try {
            console.log(messages);
            await connection.invoke("SendMessage", message);
        } catch (e) {
            console.log(e);
        }
    }

    const closeConnection = async () => {
        try {
            await connection.invoke("CloseConnection");
            localStorage.removeItem("user2Id")
            console.log("connection closed")
            await connection.stop();
        } catch (e) {
            console.log(e);
        }
    }



    const handleChatClick = (user1Id) => {

        if( jwtDecode(localStorage.getItem("jwtToken")).Id==user1Id)
        {
            localStorage.setItem("user2Id", user2Id);
            window.location.reload(); // Перезавантажити сторінку для оновлення чату
        }
        else{
            localStorage.setItem("user2Id", user1Id);
            window.location.reload();
        }
    };

    return (
        <div>
            {isAuthorized ? <UserSideBar /> : <SideBar />}
            {!connection ? (
                <div className="chat-page-container">
                    <div className="chat-list">
                        {chats && chats.map((chat, index) => (
                            <div key={index} className="chat-link" onClick={() => handleChatClick(chat.chatHub.user2)}>
                                <div className="chat-item">
                                    <div className="chat-info">
                                        <div className="username">{chat.username}</div>
                                        <div className="full-name">({chat.username})</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <Chat sendMessage={sendMessage} messages={messages}  closeConnection={closeConnection} />
            )}


        </div>

    );
}

export default ChatPage;
