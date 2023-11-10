import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import styles from './Register.css';

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const [resume, setresume] = useState('');
    const handleRegister = async () => {


        if (password === password2) {
            try {
                const response = await axios.post('http://localhost:8080/api/login/work', {
                    username, password, resume
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
                    <input
                        className="input3"
                        type="password"
                        placeholder="Confirm Password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                    <div className="resumeInputContainer">
                        <label className="resumeLabel" htmlFor="resumeInput">
                            Resume:
                        </label>
                        <input
                            id="resumeInput"
                            onChange={(e) => setresume(e.target.value)}
                            type="file"
                        />
                    </div>
                    <button
                        className="Regbutton2"
                        onClick={handleRegister}
                        disabled={!passwordsMatch}
                    >
                        Register as Psychologist
                    </button>
                    <p className="passwordMismatch">
                        {passwordsMatch ? '' : 'Passwords do not match'}
                    </p>
                </div>
                <Link className="loginText" to="/login">
                    Sign in
                </Link>
            </div>
            <div className="RegMainPanel">
                <div>
                    <img className="mainImage2" src="/Group%201.svg" alt="Main" />
                </div>
                <div className="MainPanelText2">Make life easier</div>
            </div>
        </div>
    );
}

export default Register;
