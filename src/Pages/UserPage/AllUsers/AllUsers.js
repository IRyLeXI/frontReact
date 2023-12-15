import React, {useEffect, useState} from 'react';
import refreshToken from '../../../Helpers/refreshToken';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import styles from './UserCard.css';

const AllUsers = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userList, setUserList] = useState(undefined);
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

    return (
        <div className="user-container">
            {userList &&
                userList.map(user => (
                    <UserCard key={user.id} user={user} navigate={navigate}/>
                ))}

        </div>
    );
};

const UserCard = ({user, navigate}) => {
    function handleClick() {
        localStorage.setItem('UserCardId', user.id);
        navigate(`/user`);
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
                    <button className="user-messages-button" onClick={handleClick}>Send message</button>
                    <button className="user-request-button" onClick={handleClick}>Request friendship</button>

                </div>
            </div>

        </div>
    );
};

export default AllUsers;
