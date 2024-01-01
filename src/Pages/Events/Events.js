import React, { useEffect, useState } from 'react';
import './EventsPage.css';
import SideBar from '../MainPage/SideBar';
import UserSideBar from '../UserPage/UserSideBar';
import makeAuthorizedRequest from '../../Helpers/refreshToken';

const EventsPage = () => {
    const [articles, setArticles] = useState([]);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authorized = await makeAuthorizedRequest();
                setIsAuthorized(authorized);

                if (authorized) {
                    // Fetch articles from the API
                    const response = await fetch('http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Articles/All');
                    const data = await response.json();
                    setArticles(data);
                    //console.log(articles);
                }
            } catch (ex) {
                console.error('Error during authorization check:', ex);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {isAuthorized ? <UserSideBar /> : <SideBar />}
            <div className="events-container">
                {articles.map((article) => (
                    <EventCard key={article.id} article={article} />
                ))}
            </div>
        </div>
    );
};

const EventCard = ({ article }) => {
    const formattedDate=new Date(article.createdAt).toUTCString();
    return (
        <div className="event-page">
        <div className="event-card">
            <div className="event-image">
                <img src={article.photo} alt={`Article ${article.id}`} />
            </div>

            <div className="event-details">
                <div className="event-location">
                    <h1>{article.title}</h1>
                </div>
                <div className="event-description">
                    <p>{article.content}</p>
                </div>
                <div className="event-time">
                    <p>{formattedDate}</p>
                </div>
            </div>
        </div>
        </div>
    );
};

export default EventsPage;