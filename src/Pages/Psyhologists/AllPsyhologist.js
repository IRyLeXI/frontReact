import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainFooter from '../MainPage/MainFooter';
import  './AllPsyhologist.css';
import SideBar from '../MainPage/SideBar';
import UserSideBar from '../UserPage/UserSideBar';
import refreshToken from '../../Helpers/refreshToken';
import axios from 'axios';

const PsychologistCard = ({ psychologist }) => {
    let navigate = useNavigate();

    function handleClick() {
        localStorage.setItem('cardId', psychologist.id);
        navigate(`/psychologist/`);
    }

    const RatingStars = ({ rating }) => {
        const integerPart = Math.floor(rating);
        const remainder = rating - integerPart;

        const createStars = (count, isHalf) => {
            const stars = [];
            for (let i = 0; i < count; i++) {
                stars.push(<span key={i}>&#9733;</span>);
            }
            if (isHalf) {
                stars.push(<span key={count}>&#9734;</span>);
            }
            return stars;
        };

        return (
            <div className="rating-stars">
                {createStars(integerPart, remainder >= 0.5)}
            </div>
        );
    };

    return (

        <div className="psychologist-card">
            <img className="psychologist-img" src={psychologist.avatar} alt={`${psychologist.firstName} ${psychologist.lastName}`} />
            <div className="psychologist-details">
                <h2>{`${psychologist.firstName} ${psychologist.lastName}`}</h2>
                <RatingStars rating={psychologist.rating} />
                <button onClick={handleClick}>Details</button>
                <p>{psychologist.experienceDescription}</p>
            </div>
        </div>

    );
};

const PsychologistsPage = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [psychologists, setPsychologists] = useState([]);

    useEffect(() => {
        const getAllPsychologists = async () => {
            try {
                const response = await axios.get('http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Psychologist/GetAll');
                if (response.status === 200) {
                    const psychologistsWithRatings = await Promise.all(response.data.map(async (psychologist) => {
                        const ratingResponse = await axios.get(`http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Reviews/Avg/${psychologist.id}`);
                        if (ratingResponse.status === 200) {
                            psychologist.rating = ratingResponse.data;
                        }
                        return psychologist;
                    }));
                    setPsychologists(psychologistsWithRatings);
                }
            } catch (error) {
                console.error('Error during data fetching:', error);
            }
        };

        const fetchData = async () => {
            try {
                const authorized = await refreshToken();
                setIsAuthorized(authorized);
                await getAllPsychologists();
            } catch (error) {
                console.error('Error during data fetching:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div  className="background-123">
        {isAuthorized ? <UserSideBar /> : <SideBar />}
        <div className="users-page">

            <div className="psychologists-container">
                {psychologists.map((psychologist, index) => (
                    <PsychologistCard key={index} psychologist={psychologist} />
                ))}
            </div>
        </div>
        </div>
    );
};

export default PsychologistsPage;
