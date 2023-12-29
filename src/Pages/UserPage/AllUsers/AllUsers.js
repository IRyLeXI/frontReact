import React, {useEffect, useState} from 'react';
import refreshToken from '../../../Helpers/refreshToken';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import  './UserCard.css';
import { jwtDecode } from "jwt-decode";
import UserSideBar from "../UserSideBar";
import SideBar from "../../MainPage/SideBar";


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
        <div> {isAuthorized ? <UserSideBar /> : <SideBar />}   <div className="user-container">

            <input className="find-user"
                type="text"
                placeholder="Search by username..."
                value={searchText}
                onChange={handleSearch}
            />
            {filteredUsers.map(user => (
                <UserCard key={user.id} user={user} navigate={navigate}/>
            ))}
        </div></div>

    );
};


const UserCard = ({user, navigate}) => {
    function handleMessageClick() {
        let decoded = jwtDecode(localStorage.getItem("jwtToken"))
        if(decoded.Id!=user.id) {
            localStorage.setItem("user2Id", user.id)
        }

    }
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
                console.log("Friendship request sent:", response.data);
                // Додайте тут логіку для обробки успішності запиту
            } catch (error) {
                console.error("Error sending friendship request:", error);
                // Додайте тут логіку для обробки помилки
            }
        }
    }

    return (
        <div className="user-card-all-users">
            <div className="left-div-all-users"><img
                className="user-img-all-users"
                src={user.avatar}
                alt={`${user.username} ${user.lastName}`}
            />
                <div className="user-card-username-all-users">{`${user.username}`}</div>
            </div>

            <div className="user-details-all-users">
                <h2>{`${user.firstName} ${user.lastName}`}</h2>
                <div>
                    <Link to={"/chats"} className="user-messages-button-all-users"  onClick={handleMessageClick}><button className="user-messages-button">Send message</button></Link>
                    <button className="user-request-button-all-users" onClick={() => {handleRequestClick()}}>Request friendship</button>

                </div>
            </div>

        </div>
    );
};

export default AllUsers;
