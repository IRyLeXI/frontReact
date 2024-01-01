import React, { useEffect, useState } from 'react';
import './Psyholog.css';
import SideBar from '../../MainPage/SideBar';
import refreshToken from '../../../Helpers/refreshToken';
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import UserSideBar from "../../UserPage/UserSideBar";
import {Link} from "react-router-dom";
import Rating from 'react-rating-stars-component';

const SinglePsychology = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [psyhologist, setPsyhologist] = useState();
    const [selectedRating, setSelectedRating] = useState(0);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {

        const checkAuthorization = async () => {
            try {
                const authorized = await refreshToken();
                setIsAuthorized(authorized);
            } catch (ex) {
                console.error('Error during authorization check:', ex);
            }
        };

        const getPsyhologist = async () => {
            try {
                const response = await axios.get(`http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/User/Id/${localStorage.getItem("cardId")}`);
                if (response.status === 200) {
                    setPsyhologist(response.data);
                    console.log(response.data);
                }
            } catch (error) {
                console.error('Error during data fetching:', error);
            }
        };

        const fetchData = async () => {
            try {
                const authorized = await refreshToken();
                setIsAuthorized(authorized);
                await getPsyhologist();
            } catch (error) {
                console.error('Error during data fetching:', error);
            }
        };

        fetchData();


        checkAuthorization();
    }, []);

    const handleSendMessage = () => {
        let decoded = jwtDecode(localStorage.getItem("jwtToken"))
        if(decoded.Id!=psyhologist.id) {
            localStorage.setItem("user2Id", psyhologist.id)
        }
    };

    const handleAddFriend = () => {
        let decoded = jwtDecode(localStorage.getItem("jwtToken"))
        console.log(decoded.Id+"--------"+ psyhologist.id);
        if(decoded.Id!=psyhologist.id) {
            let response = axios.post("http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Friends/SendRequest", {
                user1id: decoded.Id,
                user2id: psyhologist.id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            })
        }
    };
    const handleRatingChange = async (newRating) => {
        let jwtToken = localStorage.getItem("jwtToken")
        let decoded = jwtDecode(localStorage.getItem("jwtToken"));
        setSelectedRating(newRating);
        setShowModal(true);
        try {
            const response = await axios.post(`http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Reviews/Create`,
                {
                    psychologistId:psyhologist.id,
                    reviewerId: decoded.Id,
                    rating:newRating
            }
            ,{
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            if (response.status === 200) {

                console.log(response.data);
            }
        } catch (error) {
            console.error('Error during data fetching:', error);
        }
        console.log(newRating)
    };

    const handleCloseModal = () => {
        setShowModal(false);

    };
    return (
        <div>
            <div className="main-container">
                {psyhologist && ( // Додана перевірка на наявність даних про психолога
                    <div className="single-psychologist-card">
                        <div className="psychologist-info">
                            <img className="psychologist-photo" src={psyhologist.avatar} alt={`${psyhologist.firstName} ${psyhologist.lastName}`} />
                            <div className="psychologist-details">
                                <h1>{`${psyhologist.firstName} ${psyhologist.lastName}`}</h1>
                                <h3>{`${psyhologist.description? psyhologist.description : "НЕМА ОПИСУ"}`}</h3>
                                <div className="psychologist-buttons">
                                    <button className="user-messages-button">написати повідомлення</button>
                                    <button>Додати до друзів</button>
                                </div>
                            </div>
                        </div>
                        <div className="psychologist-rating">
                            <h3>Поставте рейтинг:</h3>
                            <Rating
                                count={5}
                                onChange={(newRating) => handleRatingChange(newRating)}
                                size={24}
                                activeColor="#ffd700"
                            />
                        </div>
                        <p className="psychologist-description">{psyhologist.description}</p>
                    </div>
                )}
                {!psyhologist && (
                    <p>Дані про психолога не знайдено.</p>
                )}
            </div>

            {/* Модальне вікно */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                    <span className="close" onClick={handleCloseModal}>
                        &times;
                    </span>
                        <p>Дякуємо за ваш відгук!</p>
                        <button onClick={handleCloseModal}>Закрити</button>
                    </div>
                </div>
            )}
        </div>
    );

};

export default SinglePsychology;
