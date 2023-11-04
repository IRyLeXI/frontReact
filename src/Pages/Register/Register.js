import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.css';

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // Додали стан для імейла
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleRegister = async () => {
        if (password === password2) {
            try {
                const response = await axios.post('https://denma.azurewebsites.net/api/Account/Register', {
                    username: username,
                    email: email,
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
        } else {
            setPasswordsMatch(false);
        }
    }

    return (
        <div className="RegisterPage">
            <div className="RegisterPanel">
                <div>
                    <input
                        className="input1"
                        value={username}
                        placeholder="Username" // Змінили текст вводу на "Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="input1"
                        value={email}
                        placeholder="Email" // Додали інпут для імейла
                        onChange={(e) => setEmail(e.target.value)} // Використовуємо стан для імейла
                    />
                    <input
                        className="input2"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className="input3"
                        type="password"
                        placeholder="Confirm Password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                    <button className="Regbutton" onClick={handleRegister} disabled={!passwordsMatch}>
                        Register
                    </button>
                    <p className="passwordMismatch">
                        {passwordsMatch ? '' : 'Passwords do not match'}
                    </p>
                    <Link  className='registerText2' to="/register/psychologist">Register as Psychologist</Link>
                </div>
                <p className="loginText">
                    Sign in
                </p>
            </div>
            <div className="RegMainPanel"></div>
        </div>
    );
}

export default Register;