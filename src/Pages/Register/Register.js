import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.css';

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [password2, setPassword2] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [birthday, setBirthday] = useState(''); // Додали стан для дати

    const handleRegister = async () => {
        if (password === password2) {
            try {
                const response = await axios.post('https://localhost:7224/api/Account/Register', {
                    username: username,
                    email: email,
                    name: name,
                    lastname: lastname,
                    password: password,
                    birthday: birthday
                });
                if (response.status === 200) {
                    const jwtToken = response.data.JwtToken;
                    localStorage.setItem('jwtToken', jwtToken); // Зберігаємо JWT у localStorage
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
                    <input
                        className="input1"
                        value={name}
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="input1"
                        value={lastname}
                        placeholder="Lastname"
                        onChange={(e) => setLastname(e.target.value)}
                    />
                    <input
                        className="input1"
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                    />
                    <button className="Regbutton" onClick={handleRegister} disabled={!passwordsMatch}>
                        Register
                    </button>
                    <p className="passwordMismatch">
                        {passwordsMatch ? '' : 'Passwords do not match'}
                    </p>
                    <Link  className='registerText2' to="/register/psychologist">Register as Psychologist</Link>
                </div>
                <Link  className="loginText" to="/login">Sign in</Link>
            </div>
            <div className="RegMainPanel">
                <div>
                    <img className="mainImage2" src="/Group%201.svg"/>
                </div>
                <div className="MainPanelText2">Make life easier</div>

            </div>

        </div>
    );
}

export default Register;
