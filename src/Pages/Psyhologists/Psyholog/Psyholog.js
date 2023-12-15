import React, { useEffect, useState } from 'react';
import './Psyholog.css';
import SideBar from '../../MainPage/SideBar';
import refreshToken from '../../../Helpers/refreshToken';

const SinglePsychology = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    // Тут ваш код з psychologist
    const psychologist = {
        firstName: 'Jane',
        lastName: 'Smith',
        photo: 'https://teletype.in/files/a1/ab/a1ab88bd-db77-4676-8266-5aeef01d9ea0.png',
        education: 'University of Psychology',
        description: 'Привіт, я Ігор. Моя спеціалізація - психологія розвитку та робота зі стресом. Мій досвід у цій галузі становить 8 років. Я працюю з людьми різного віку, допомагаючи їм розвивати стратегії подолання стресу та досягати психологічного благополуччя. Моя мета - створити з вами індивідуальні стратегії, щоб ви могли розвивати свій потенціал та досягати бажаних цілей.'
    };
    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const authorized = await refreshToken();
                setIsAuthorized(authorized);
            } catch (ex) {
                console.error('Error during authorization check:', ex);
            }
        };

        checkAuthorization();
    }, []);

    const handleSendMessage = () => {
        console.log('Написати повідомлення');
    };

    const handleAddFriend = () => {
        console.log('Додати до друзів');
    };

    return (
        <div>
            <SideBar></SideBar>
            <div className="main-container"> {/* Основний контейнер */}

            <div className="single-psychologist-card">
                <div className="psychologist-info">
                    <img className="psychologist-photo" src={psychologist.photo} alt={`${psychologist.firstName} ${psychologist.lastName}`} />
                    <div className="psychologist-details">
                        <h1>{`${psychologist.firstName.toUpperCase()} ${psychologist.lastName.toUpperCase()}`}</h1>
                        <p>{psychologist.education}</p>
                        <div className="psychologist-buttons">
                            <button onClick={handleSendMessage}>Написати повідомлення</button>
                            <button onClick={handleAddFriend}>Додати до друзів</button>
                        </div>
                    </div>
                </div>
                <p className="psychologist-description">{psychologist.description}</p>
            </div>
            <div><b>${localStorage.getItem("cardId")}</b></div>
        </div></div>

    );
};

export default SinglePsychology;
