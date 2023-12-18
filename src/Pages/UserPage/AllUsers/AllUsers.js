import React, {useEffect, useState} from 'react';
import refreshToken from '../../../Helpers/refreshToken';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import styles from './UserCard.css';
import { jwtDecode } from "jwt-decode";


const AllUsers = () => {
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
                    const response = await axios.get('https://localhost:7224/api/User');
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
        user.username.toLowerCase().includes(searchText.toLowerCase())
    ) : [];

    return (
        <div className="user-container">
            <input
                type="text"
                placeholder="Search by username..."
                value={searchText}
                onChange={handleSearch}
            />
            {filteredUsers.map(user => (
                <UserCard key={user.id} user={user} navigate={navigate}/>
            ))}
        </div>
    );
};


const UserCard = ({user, navigate}) => {
    function handleMessageClick() {


    }
    function handleRequestClick() {
        let decoded = jwtDecode(localStorage.getItem("jwtToken"))
        console.log(decoded.Id+"--------"+ user.id);
      let response=  axios.post("https://localhost:7224/api/Friends/SendRequest", {
            user1id: decoded.Id,
            user2id: user.id
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
        })
    }
    return (
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
                    <button className="user-messages-button" onClick={handleMessageClick}>Send message</button>
                    <button className="user-request-button" onClick={handleRequestClick}>Request friendship</button>

                </div>
            </div>

        </div>
    );
};

export default AllUsers;
