import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainFooter from '../MainPage/MainFooter';
import styles from './AllPsyhologist.css';
import SideBar from '../MainPage/SideBar';
import UserSideBar from '../UserPage/UserSideBar';
import refreshToken from '../../Helpers/refreshToken';
import axios from 'axios';

const PsychologistsPage = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [psychologists, setPsychologists] = useState([]);

    useEffect(() => {
        const getAllPsychologists = async () => {
            try {
                const response = await axios.get(`https://localhost:7224/api/Psychologist/GetAll`);
                if (response.status === 200) {
                    setPsychologists(response.data);
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
                await getAllPsychologists(); // Fetch psychologists after checking authorization
            } catch (error) {
                console.error('Error during data fetching:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {isAuthorized ? <UserSideBar /> : <SideBar />}
            <div className="psychologists-container">
                {psychologists.map((psychologist, index) => (
                    <PsychologistCard key={index} psychologist={psychologist} />
                ))}
            </div>
        </div>
    );
};

const PsychologistCard = ({ psychologist }) => {
    let navigate = useNavigate();

    function handleClick() {
        localStorage.setItem('cardId', psychologist.id);
        navigate(`/psychologist/`);
    }

    return (
        <div className="psychologist-card">
            <img className="psychologist-img" src={psychologist.avatar} alt={`${psychologist.firstName} ${psychologist.lastName}`} />
            <div className="psychologist-details">
                <h2>{`${psychologist.firstName} ${psychologist.lastName}`}</h2>
                <button onClick={handleClick}>Details</button>
                <p>{psychologist.experienceDescription}</p>
            </div>
        </div>
    );
};

export default PsychologistsPage;
