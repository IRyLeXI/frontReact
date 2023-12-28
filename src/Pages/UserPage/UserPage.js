import React, { useEffect, useState } from 'react';
import UserSideBar from './UserSideBar';
import refreshToken from '../../Helpers/refreshToken';
import styles from './UserPage.css';
import SideBar from "../MainPage/SideBar";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {Link} from "react-router-dom";
function UserPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [user, setUser]= useState();

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const authorized = await refreshToken();
                setIsAuthorized(authorized);

                if (authorized) {
                    let decoded = jwtDecode(localStorage.getItem("jwtToken"));
                    const response = await axios.get(`https://localhost:7224/api/User/Id/${decoded.Id}`);
                    if (response.status === 200) {
                        setUser(response.data);
                        console.log(response.data);
                    }
                }
            } catch (ex) {
                console.error('Error during authorization check:', ex);
            }
        };

        checkAuthorization();
    }, []);


    if (!isAuthorized) {

        return <div>     {isAuthorized ? <UserSideBar /> : <SideBar />}
            Error: User not authorized.</div>;
    }

    // Код для відображення сторінки користувача, якщо він авторизований



    const handleEditAccount = () => {
        // Дії при натисканні на кнопку "Редагувати акаунт"
        // Наприклад, відкриття форми для редагування
    };

    return (
        <div>
            {isAuthorized ? <UserSideBar /> : <SideBar />}
            <div className="user-page-container">
                {user && (
                    <div className="user-card">
                        <div className="left-section">
                            <div className="user-image" style={{ backgroundImage: `url(${user.avatar})` }}></div>
                            <h1>{user.username}</h1>
                            <p>{user.firstName} {user.lastName}</p>
                        </div>
                        <div className="right-section">
                            <p className="user-description">{user.description}</p>
                            
                        <Link to="/user/page/edit"><button className="edit-button" onClick={handleEditAccount}>Edit Account</button> </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

}

export default UserPage;
