import React, {useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.css';
import refreshToken from "../../Helpers/refreshToken";

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [password2, setPassword2] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [role, setRole] = useState('');
    const [specialization, setSpecialization] = useState(''); // New state for specialization

    const specializationOptions = [
        'Student',
        'Mentor',
       
    ];

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                if (localStorage.getItem("jwtToken") != null) {
                    let response =await refreshToken();
                    console.log(response)
                    if(response)
                    {
                        navigate("/main");
                    }

                }
            } catch (ex) {
                console.error('Error during authorization check:', ex);
            }
        };
        checkAuthorization();
    }, []);

    const handleRegister = async () => {
        if (password === password2) {
            try {
                var introle;
                if(role==="Student") introle=2;
                else if(role==="Mentor") introle=3;
                const response = await axios.post('https://localhost:7068/Register', {
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    password: password,
                    role:introle
                });
                if (response.status === 200) {
                    const jwtToken = response.data.jwtToken;
                    console.log(response);
                    localStorage.setItem('jwtToken', jwtToken);
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
                        value={firstname}
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                    />
                       <select
                        className="input1"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="" disabled>
                            Select Role
                        </option>
                        {specializationOptions.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <input
                        className="input1"
                        value={lastname}
                        placeholder="Lastname"
                        onChange={(e) => setLastname(e.target.value)}
                    />
                    <button className="Regbutton" onClick={handleRegister} disabled={!passwordsMatch}>
                        Register
                    </button>
                    <p className="passwordMismatch">
                        {passwordsMatch ? '' : 'Passwords do not match'}
                    </p>

                    <Link  className='registerText2' to="/register/psychologist">Register as Investor</Link>
                    <Link  className="loginText" to="/login">Sign in</Link>
                </div>

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
