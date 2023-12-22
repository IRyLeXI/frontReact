import React, { useEffect, useState } from 'react';
import UserSideBar from './UserSideBar';
import refreshToken from '../../Helpers/refreshToken';
import styles from './UserPage.css';
import SideBar from "../MainPage/SideBar";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

function UpdateUser() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [user, setUser] = useState();
    const [newUsername, setNewUsername] = useState('');

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
    const updateUser = async (username,lastname,firstname) => {

    }
        return (
        <div></div>
    );
}

export default UpdateUser;
