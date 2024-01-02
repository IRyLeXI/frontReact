import React, { useState, useEffect } from 'react';

import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.css';
import refreshToken from "../../Helpers/refreshToken";

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);
    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                if (localStorage.getItem("jwtToken") != null) {
                    let response = await refreshToken();
                    console.log(response)
                    if (response) {
                        navigate("/main");
                    }
                }
            } catch (ex) {
                console.error('Error during authorization check:', ex);
            }
        };
        checkAuthorization();
    }, [navigate]);


    const handleLogin = async () => {
        try {
            const response = await axios.post('http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Account/Login', {
                email: username,
                password: password
            });
            if (response.status === 200) {
                const jwtToken = response.data.jwtToken;
                const  RefreshToken=response.data.refreshToken;
                console.log(response);
                localStorage.setItem('jwtToken', jwtToken);
                localStorage.setItem('refreshToken', RefreshToken);
                navigate('/user/page');
            } else {
                console.error('Помилка авторизації');
            }
        } catch (error) {
            console.error('Помилка відправлення запиту:', error.message);
        }
    };

    return (
        <div className="loginPage">
            <div className="loginPanel">
                <div>
                    <input
                        className="input1"
                        value={username}
                        placeholder="Email"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="input2"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="button" onClick={handleLogin}>
                        Login
                    </button>
                </div>
                <Link className="registerText" to="/register">
                    Sign up
                </Link>
            </div>
            <div className="MainPanel">
                <div className="mainImage">
                    <img src="/svg%20img2.svg" alt="SVG" />

                </div>
                <div className="mainPanelText">Make life easier</div>
            </div>
        </div>
    );
}

export default Login;
