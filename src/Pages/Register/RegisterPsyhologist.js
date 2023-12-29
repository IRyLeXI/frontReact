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
    const [email, setEmail] = useState(''); // Додали стан для імейла
    const [resume, setresume] = useState('');
    const [details, setdetails] = useState('');
    const [birthday, setBirthday] = useState(''); // Додали стан для дати
    const [jwt,setJwt] =useState(null)

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
                  console.log(username,email,name,lastname,password,birthday,details)
                    const createResponse= await axios.post(`http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Account/Register`,
                        {
                            username: username,
                            email: email,
                            firstname: name,
                            lastname: lastname,
                            password: password,
                            birthday: birthday,
                            avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1200px-User_icon_2.svg.png"

                        })
                if (createResponse.status === 200) {
                    const jwtToken = createResponse.data.jwtToken;
                    setJwt(jwtToken);

                    const  RefreshToken=createResponse.data.refreshToken;
                    localStorage.setItem('jwtToken', jwtToken);
                    localStorage.setItem('refreshToken', RefreshToken);// Зберігаємо JWT у localStorage

                }
                else {
                    console.error('Помилка авторизації');
                }



            } catch (error) {
                console.error('Помилка відправлення запиту:', error.message);
            }
        } else {
            setPasswordsMatch(false);
        }
    }

     useEffect( () => {

         const fetchData =async () => {
             if (jwt != null) {
                 const formData = new FormData();
                 formData.append('description', details);
                 formData.append('resume', resume);

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
                     console.error('Помилка авторизації');
                 }
             }
         }
         fetchData();


     },[jwt])

    return (
        <div className="RegisterPage">
            <div className="RegisterPanel">
                <div>
                    <input
                        className="input1"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)} // Змінив setUsername на setEmail
                    />
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
                        value={details}
                        placeholder="resumeDetails"
                        onChange={(e) => setdetails(e.target.value)}
                    />
                    <input
                        className="input1"
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                    />
                    <div className="resumeInputContainer">
                        <label className="resumeLabel" htmlFor="resumeInput">
                            Resume:
                        </label>
                        <input
                            id="resumeInput"
                            onChange={(e) => setresume(e.target.files[0])}
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
