import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.css'


function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async () => {
        try {
            const response = await axios.post('https://denma.azurewebsites.net/api/Account/Login', {
             email: username,
             password: password
            });
            if (response.status === 200) {
                navigate('/main');
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
                    <input className="input1"
                           value={username}
                           placeholder="Email"
                           onChange={(e) => setUsername(e.target.value)}/>
                    <input className="input2" type="password"
                           placeholder="Password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                    <button className="button"
                            onClick={handleLogin} >Login</button>
                </div>
                <p className="registerText">Sign up</p>
            </div>
            <div className="MainPanel"></div>
        </div>
    );
}


export default Login;




