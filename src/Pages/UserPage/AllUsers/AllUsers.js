import React, { useEffect, useState } from 'react';
import refreshToken from '../../../Helpers/refreshToken';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "./UserCard.css";
import { jwtDecode } from "jwt-decode";
import UserSideBar from "../UserSideBar";
import SideBar from "../../MainPage/SideBar";

const AllUsers = () => {
    let decoded = jwtDecode(localStorage.getItem("jwtToken"));
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userList, setUserList] = useState(undefined);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authorized = await refreshToken();
                setIsAuthorized(authorized);

                if (authorized) {
                    const response = await axios.get('https://localhost:7068/api/User/All');
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
        setSearchText(value);
    };

    const filteredUsers = userList ? userList.filter(user =>
        user.username.toLowerCase().includes(searchText.toLowerCase()) && user.id !== decoded.Id
    ) : [];

    return (
        <div className="all-full-user-page">
            {isAuthorized ? <UserSideBar /> : <SideBar />}
            <div className="all-user-page-container">
                <input
                    className="all-find-user"
                    type="text"
                    placeholder="Search by username..."
                    value={searchText}
                    onChange={handleSearch}
                />
                <div className="all-user-list-container">
                    {filteredUsers.map(user => (
                        <UserCard key={user.id} user={user} navigate={navigate} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const UserCard = ({ user, navigate }) => {
    const handleMessageClick = () => {
        let decoded = jwtDecode(localStorage.getItem("jwtToken"));
        if (decoded.Id !== user.id) {
            localStorage.setItem("user2Id", user.id);
            navigate('/chat');
        }
    };

    const handleClick = () => {
        navigate(`/user/${user.id}`);
    };

    return (
        <div className="all-user-card">
            <div className="all-user-image" onClick={handleClick}>
                <img
                    src={`data:image/jpeg;base64,${user.imageBase64}`}
                    alt={`${user.username}`}
                />
            </div>
            <div className="all-user-details">
                <div className="all-user-card-username" onClick={handleClick}>{`${user.username}`}</div>
                <div className="all-user-card-fullname" onClick={handleClick}>{`${user.firstname} ${user.lastname}`}</div>
                <button onClick={handleMessageClick}>Send Message</button>
            </div>
        </div>
    );
};


export default AllUsers;
