import React, { useEffect, useState } from 'react';
import refreshToken from '../../../Helpers/refreshToken';
import axios from "axios";
import './EditAcount.css';
import { jwtDecode } from "jwt-decode";
import UserSideBar from "../UserSideBar";
import SideBar from "../../MainPage/SideBar";
import { Link } from "react-router-dom";

function UpdateUser() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [newUser, setNewUser] = useState({
        firstname: '',
        lastname: '',
        avatar: '',
        username: '',
        email: '',
        description: '',
        password: '',
        skills: '',
        education: '',
        expirience: '',
        investment_info: '',
        id: ''
    });
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const authorized = await refreshToken();
                setIsAuthorized(authorized);

                if (authorized) {
                    let decoded = jwtDecode(localStorage.getItem("jwtToken"));
                    setUserRole(decoded.role);
                    const response = await axios.get(`https://localhost:7068/api/User/id/${decoded.Id}`);
                    if (response.status === 200) {
                        setUser(response.data);
                        setNewUser({
                            firstname: response.data.firstname,
                            lastname: response.data.lastname,
                            avatar: response.data.avatar,
                            username: response.data.username,
                            password: response.data.password,
                            skills: response.data.skills,
                            education: response.data.education,
                            expirience: response.data.expirience,
                            email: response.data.email,
                            description: response.data.description,
                            investment_info: response.data.investment_info,
                            id: decoded.Id
                        });
                        setPreviewImage(response.data.avatar ? `data:image/jpeg;base64,${response.data.avatar}` : '');
                        console.log(response.data);
                    }
                }
            } catch (ex) {
                console.error('Error during authorization check:', ex);
            }
        };

        checkAuthorization();
    }, []);

    const updateUser = async (e) => {
        e.preventDefault();
        const jwtToken = localStorage.getItem("jwtToken");

        try {
            const formData = new FormData();
            formData.append('id', newUser.id);
            formData.append('username', newUser.username);
            formData.append('password', newUser.password);
            formData.append('firstname', newUser.firstname);
            formData.append('lastname', newUser.lastname);
            formData.append('skills', newUser.skills);
            formData.append('education', newUser.education);
            formData.append('expirience', newUser.expirience);
            formData.append('email', newUser.email);
            formData.append('description', newUser.description);
            if (userRole === 'Investor') {
                formData.append('investment_info', newUser.investment_info);
            }
            if (newUser.avatar && newUser.avatar instanceof File) {
                formData.append('fromFile', newUser.avatar);
            }

            let response = await axios.post(
                `https://localhost:7068/api/User/Update`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            console.log(response.data);
            
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setNewUser({ ...newUser, avatar: file });
            };
            reader.readAsDataURL(file);
        }
    };

    if (isAuthorized) {
        return (
            <div>
                <UserSideBar />
                <div className="update-user">
                    <form onSubmit={updateUser}>
                        <h2>Update User</h2>
                        <label>
                            User Name:
                            <input
                                type="text"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            />
                        </label>
                        <label>
                            First Name:
                            <input
                                type="text"
                                value={newUser.firstname}
                                onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
                            />
                        </label>
                        <label>
                            Last Name:
                            <input
                                type="text"
                                value={newUser.lastname}
                                onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
                            />
                        </label>
                        <label>
                            Avatar:
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {previewImage && <img src={previewImage} alt="Avatar Preview" className="avatar-preview" />}
                        </label>
                        <label>
                            Password:
                            <input
                                type="text"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        </label>
                        <label>
                            Skills:
                            <input
                                type="text"
                                value={newUser.skills}
                                onChange={(e) => setNewUser({ ...newUser, skills: e.target.value })}
                            />
                        </label>
                        <label>
                            Education:
                            <input
                                type="text"
                                value={newUser.education}
                                onChange={(e) => setNewUser({ ...newUser, education: e.target.value })}
                            />
                        </label>
                        <label>
                            Experience:
                            <input
                                type="text"
                                value={newUser.expirience}
                                onChange={(e) => setNewUser({ ...newUser, expirience: e.target.value })}
                            />
                        </label>
                        <label>
                            Description:
                            <input
                                type="text"
                                value={newUser.description}
                                onChange={(e) => setNewUser({ ...newUser, description: e.target.value })}
                            />
                        </label>
                        {userRole === 'Investor' && (
                            <label>
                                Investment Info:
                                <input
                                    type="text"
                                    value={newUser.investment_info}
                                    onChange={(e) => setNewUser({ ...newUser, investment_info: e.target.value })}
                                />
                            </label>
                        )}
                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <SideBar />
                <div>Ooops...</div>
            </div>
        );
    }
}

export default UpdateUser;
