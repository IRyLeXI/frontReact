import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import MainFooter from "../MainPage/MainFooter";
import styles from './AllPsyhologist.css'
import SideBar from "../MainPage/SideBar";
const PsychologistsPage = () => {
    const psychologists = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            photo: 'https://teletype.in/files/a1/ab/a1ab88bd-db77-4676-8266-5aeef01d9ea0.png',
            experienceDescription: 'Привіт, мене звати Олександр. Я - психолог зі спеціалізацією на міжособистісних відносинах та самопізнанні. Мій 15-річний досвід роботи в цій галузі дозволяє мені допомагати вам розуміти власні емоції, розвивати навички ефективного спілкування та покращувати взаєморозуміння у ваших стосунках. Мій підхід базується на емпатії та роботі зі свідомим сприйняттям себе та інших.\n' +
                '\n',
        },
        {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            photo: 'https://teletype.in/files/a1/ab/a1ab88bd-db77-4676-8266-5aeef01d9ea0.png',
            experienceDescription: 'Привіт, я Ігор. Моя спеціалізація - психологія розвитку та робота зі стресом. Мій досвід у цій галузі становить 8 років. Я працюю з людьми різного віку, допомагаючи їм розвивати стратегії подолання стресу та досягати психологічного благополуччя. Моя мета - створити з вами індивідуальні стратегії, щоб ви могли розвивати свій потенціал та досягати бажаних цілей.',
        },
        {
            id: 3,
            firstName: 'Jane',
            lastName: 'Smith',
            photo: 'https://teletype.in/files/a1/ab/a1ab88bd-db77-4676-8266-5aeef01d9ea0.png',
            experienceDescription: 'Привіт, я Марія! Моя психологічна практика вже триває протягом 10 років. За цей час я отримала багатий досвід у роботі зі стресом, тривожністю та розвитком особистості. Моя мета - створити безпечне середовище для вас, де ви можете відкрито висловлювати свої почуття та думки. Мій підхід базується на когнітивно-поведінковій терапії та практиці медитації, щоб допомогти вам знайти гармонію та внутрішній спокій.',
        },
        {
            id: 4,
            firstName: 'Jane',
            lastName: 'Smith',
            photo: 'https://teletype.in/files/a1/ab/a1ab88bd-db77-4676-8266-5aeef01d9ea0.png',
            experienceDescription: 'Привіт, я Ігор. Моя спеціалізація - психологія розвитку та робота зі стресом. Мій досвід у цій галузі становить 8 років. Я працюю з людьми різного віку, допомагаючи їм розвивати стратегії подолання стресу та досягати психологічного благополуччя. Моя мета - створити з вами індивідуальні стратегії, щоб ви могли розвивати свій потенціал та досягати бажаних цілей.',
        },
        // Додайте інших психологів за аналогією
    ];
    //


    return (
        <div >
          <SideBar></SideBar>
            <div className="psychologists-container">
                {psychologists.map(psychologist => (
                    <PsychologistCard key={psychologist.id} psychologist={psychologist} />
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
            <img className="psychologist-img" src={psychologist.photo} alt={`${psychologist.firstName} ${psychologist.lastName}`} />
            <div className="psychologist-details">
                <h2>{`${psychologist.firstName} ${psychologist.lastName}`}</h2>
                <button onClick={handleClick}>Details</button>
                <p>{psychologist.experienceDescription}</p>
            </div>
        </div>
    );
};

export default PsychologistsPage;
