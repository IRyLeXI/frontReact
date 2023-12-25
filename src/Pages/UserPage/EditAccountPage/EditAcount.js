import React, { useEffect, useState } from 'react';

import refreshToken from '../../../Helpers/refreshToken';
import axios from "axios";
import './EditAcount.css'
import { jwtDecode } from "jwt-decode";
import UserSideBar from "../UserSideBar";
import SideBar from "../../MainPage/SideBar";

function UpdateUser() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [user, setUser] = useState(null);
    const [newUser, setNewUser] = useState({
        FirstName: '',
        LastName: '',
        Avatar: '',
        Birthday: '',
        Username: '',
        Email: '',
        Description: ''
    });

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

    const updateUser = async () => {
        console.log(newUser);
        console.log(user);
        try {
            let response=  axios.put(`https://localhost:7224/api/User/${user.id}`, {
                username: newUser.Username,
                firstname: newUser.FirstName,
                lastname: newUser.LastName,
                avatar: newUser.Avatar,
                birthday: newUser.Birthday,
                description: newUser.Description,
                email: newUser.Email,
            }
            )

        } catch (error) {
            console.error('Error updating user:', error);
        }
    };
    if (isAuthorized) {
        return (
            <div>
                <UserSideBar></UserSideBar>

                <div className="update-user">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        updateUser();
                    }}>
                        <h2>Update User</h2>
                        <label>
                             User Name:
                            <input
                                type="text"
                                value={newUser.UserName}
                                onChange={(e) => setNewUser({ ...newUser,UserName: e.target.value })}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="text"
                                value={newUser.Email}
                                onChange={(e) => setNewUser({ ...newUser,Email: e.target.value })}
                            />
                        </label>

                        <label>
                            First Name:
                            <input
                                type="text"
                                value={newUser.FirstName}
                                onChange={(e) => setNewUser({ ...newUser, FirstName: e.target.value })}
                            />
                        </label>
                        <label>
                            Last Name:
                            <input
                                type="text"
                                value={newUser.LastName}
                                onChange={(e) => setNewUser({ ...newUser, LastName: e.target.value })}
                            />
                        </label>
                        <label>
                            Avatar URL:
                            <input
                                type="text"
                                value={newUser.Avatar}
                                onChange={(e) => setNewUser({ ...newUser, Avatar: e.target.value })}
                            />
                        </label>
                        <label>
                            Birthday:
                            <input
                                type="date"
                                value={newUser.Birthday}
                                onChange={(e) => setNewUser({ ...newUser, Birthday: e.target.value })}
                            />
                        </label>
                        <label>
                            Description:
                            <input
                                type="text"
                                value={newUser.Description}
                                onChange={(e) => setNewUser({ ...newUser,Description: e.target.value })}
                            />
                        </label>
                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>

        );
    } else {

        return (<div>
                <SideBar></SideBar>
                <div>Loading..!!!!!.</div>
        </div>

    );
    }
}

export default UpdateUser;
