import React, {useEffect, useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import styles from './Register.css';
import refreshToken from "../../Helpers/refreshToken";

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [name, setName] = useState(''); // Додали стан для імені
    const [lastname, setLastname] = useState('');
  
    const [investment_info, setinvestment_info] = useState('');

    const [jwt,setJwt] =useState(null)
    const [specialization, setSpecialization] = useState(''); // New state for specialization

    
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
            console.log(username,name,lastname,password)
                const response = await axios.post('https://localhost:7068/Register', {
                    username: username,
                    firstname: name,
                    lastname: lastname,
                    password: password,
                    role:4
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



         useEffect(() => {
             const fetchData = async () => {
                 try {
                     if (jwt != null) {
                         const formData = new FormData();
                         formData.append('description', investment_info);

                         const response = await axios.post(
                             'http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Account/PsychologistConfirm',
                             formData,
                             {
                                 headers: {
                                     Authorization: `Bearer ${jwt}`,
                                     'Content-Type': 'multipart/form-data',
                                 },
                             }
                         );

                         if (response.status === 200) {
                             navigate('/main');
                         } else {
                             console.error('Помилка: ', response.statusText);
                         }
                     }
                 } catch (error) {
                     console.error('Помилка з\'єднання: ', error.message);
                 }
             };

             fetchData();

     },[jwt])

    useEffect(()=>{console.log(specialization)},[specialization])
    return (
        <div className="RegisterPage">
            <div className="RegisterPanel">
                <div>
                   
                    <input
                        className="input1"
                        value={username}
                        placeholder="username" // Додали інпут для імейла
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
                        value={investment_info}
                        placeholder="InvestorInfo"
                        onChange={(e) => setinvestment_info(e.target.value)}
                    />
                    
                    
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
