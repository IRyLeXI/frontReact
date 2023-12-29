import React, { useEffect, useState } from 'react';

import refreshToken from '../../../Helpers/refreshToken';
import axios from "axios";
import './EditAcount.css'
import { jwtDecode } from "jwt-decode";
import UserSideBar from "../UserSideBar";
import SideBar from "../../MainPage/SideBar";
import {Link} from "react-router-dom";

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
        Description: '',
        Password:''
    });

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const authorized = await refreshToken();
                setIsAuthorized(authorized);

                if (authorized) {
                    let decoded = jwtDecode(localStorage.getItem("jwtToken"));
                    const response = await axios.get(`http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/User/Id/${decoded.Id}`);
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
        const jwtToken=localStorage.getItem("jwtToken")
        console.log(newUser)
        try {

            let response = await axios.put(
                `http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/User/${user.id}`,
                {
                    username: newUser.Username,
                    firstname: newUser.FirstName,
                    lastname: newUser.LastName,
                    avatar: newUser.Avatar,
                    birthday: newUser.Birthday,
                    description: newUser.Description,
                    email: newUser.Email,
                    password: newUser.Password,
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    }
                }
            );


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
                                value={newUser.Username}
                                onChange={(e) => setNewUser({ ...newUser, Username: e.target.value })}
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
                            Password:
                            <input
                                type="text"
                                value={newUser.Password}
                                onChange={(e) => setNewUser({ ...newUser,Password: e.target.value })}
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
                    <Link to="/user/page"> <button type="submit">Update</button></Link>
                    </form>
                </div>
            </div>

        );
    } else {

        return (<div>
                <SideBar></SideBar>
                <div> Ooops...</div>
        </div>

    );
    }
}

export default UpdateUser;
