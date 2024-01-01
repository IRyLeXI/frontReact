import React, {useEffect, useState} from 'react';

import refreshToken from '../../../Helpers/refreshToken';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import "./UserCard.css"
import { jwtDecode } from "jwt-decode";
import UserSideBar from "../UserSideBar";
import SideBar from "../../MainPage/SideBar";
import FriendshipRequestModal from './FriendshipRequestModal';

const AllUsers = () => {
    let decoded = jwtDecode(localStorage.getItem("jwtToken"))
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userList, setUserList] = useState(undefined);
    const [searchText, setSearchText] = useState(''); // Стан для зберігання тексту пошуку
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authorized = await refreshToken();
                setIsAuthorized(authorized);

                if (authorized) {
                    const response = await axios.get('http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/User');
                    if (response.status === 200) {
                        setUserList(response.data);
                        console.log(response.data);
                    }
                }
            } catch (error) {
                console.error('Error during data fetching:', error);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (event) => {
        const { value } = event.target;
        setSearchText(value); // Оновлення стану з текстом пошуку
    };

    // Фільтрація списку користувачів за текстом пошуку
    const filteredUsers = userList ? userList.filter(user =>
        user.username.toLowerCase().includes(searchText.toLowerCase()) && user.id !== decoded.Id
    ) : [];


    return (
        <div className="full-user-page">
            {isAuthorized ? <UserSideBar /> : <SideBar />}
            <div className="user-page-container">
                <input
                    className="find-user"
                    type="text"
                    placeholder="Search by username..."
                    value={searchText}
                    onChange={handleSearch}
                />
                {/* Обгортка для списку користувачів */}
                <div className="user-list-container">
                    {filteredUsers.map(user => (
                        <UserCard key={user.id} user={user} navigate={navigate}/>
                    ))}
                </div>
            </div>
        </div>
    );
};


const UserCard = ({user, navigate}) => {
    const [showModal, setShowModal] = useState(false);

    function handleMessageClick() {
        let decoded = jwtDecode(localStorage.getItem("jwtToken"))
        if(decoded.Id!=user.id) {
            localStorage.setItem("user2Id", user.id)
        }

    }
    const handleCloseModal = () => {
        setShowModal(false); // Close the modal when the close button is clicked
    };
    async function handleRequestClick() {
        let decoded = jwtDecode(localStorage.getItem("jwtToken"));
        console.log(decoded.Id + "--------" + user.id);
        if (decoded.Id !== user.id) {
            try {
                const response = await axios.post(
                    "http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Friends/SendRequest",
                    {
                        user1id: decoded.Id,
                        user2id: user.id
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                        }
                    }
                );
                if (response.status===200)
                {
                    setShowModal(true);
                }
                console.log("Friendship request sent:", response.data);
                // Додайте тут логіку для обробки успішності запиту
            } catch (error) {
                console.error("Error sending friendship request:", error);
                // Додайте тут логіку для обробки помилки
            }
        }
    }

    return (<div>
            <FriendshipRequestModal showModal={showModal} handleCloseModal={handleCloseModal} />

        <div className="user-card">
            <div className="left-div"><img
                className="user-img"
                src={user.avatar}
                alt={`${user.username} ${user.lastName}`}
            />
                <div className="user-card-username">{`${user.username}`}</div>
            </div>

            <div className="user-details">
                <h2>{`${user.firstName} ${user.lastName}`}</h2>
                <div>
                    <Link to={"/chats"} className="user-messages-button"  onClick={handleMessageClick}><button className="user-messages-button">Send message</button></Link>
                    <button className="user-request-button" onClick={() => {handleRequestClick()}}>Request friendship</button>

                </div>
            </div>

        </div>
        </div>
    );
};

export default AllUsers;