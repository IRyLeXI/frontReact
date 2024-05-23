import { useNavigate, Link } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import styles from './MainPage.css';
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";
import MainPageForm from "./MainPageForm";


import SideBar from "./SideBar";
import UserSideBar from "../UserPage/UserSideBar";
import axios from "axios";
import makeAuthorizedRequest from "../../Helpers/refreshToken";
import refreshToken from "../../Helpers/refreshToken";
import {jwtDecode} from "jwt-decode";
function MainPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        let decoded = jwtDecode(localStorage.getItem("jwtToken"));
        console.log(decoded.Id)
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
    return (
        <div className={`container`}>
            {isAuthorized ? <UserSideBar /> : <SideBar />}
            <div className="content">
                <MainHeader  isAuthenticated={isAuthorized} />
                <main className="main-content">
                    <div className="row">
                        <div className="column">
                            <div className="image-container">

                                <img className="mainImage2" src="/form1.svg" alt={""}/>
                                <MainPageForm  text= "Наша платформа допомогла вже сотням студентів реалізувати свої стартапи, та залучити десятки інвесторів не тільки з України а й з країн Європи.  Зважаючи на наш успішний шлях, ми постійно розвиваємося і розширюємо свої можливості, надаючи студентам доступ до наставництва, навчальних ресурсів та мережі контактів, необхідних для втілення їхніх ідей у життя. Наша місія - створювати сприятливе середовище для інновацій та підтримувати молоді таланти у їхньому шляху до успіху. " />
                            </div>
                            <div className="image-container">
                                <img className="mainImage2" src="/form3.svg" alt={""}/>
                                <MainPageForm text="
Наш проект дозволяє студентам створювати власні стартапи та залучати до них учасників. Ця можливість не лише сприяє розвитку нових ідей, а й стимулює знайомства з новими людьми. Взаємодія в рамках команд допомагає студентам розвивати навички комунікації та спільної роботи, що є надзвичайно важливими для їхнього майбутнього успіху. Набуваючи досвіду спільної творчості та вирішення завдань в команді, студенти отримують цінні знання та навички, які стануть основою для їхньої професійної кар'єри. " />
                            </div>
                        </div>
                        <div className="column">
                            <div className="image-container">
                                <MainPageForm text="
Ми ретельно перевіряємо кожен стартап, та гарантуємо його надійність, що є основою довіри наших інвесторів до нашої платформи. Наш команда експертів проводить детальний аналіз кожного проекту з урахуванням його концепції, ризиків та потенціалу. Тільки після тщательного огляду ми включаємо стартапи до нашого портфоліо, що забезпечує нашим інвесторам впевненість у виборі та перспективності проектів." />
                                <img className="mainImage2" src="/form2.svg" alt={""}/>
                            </div>
                            <div className="image-container">
                                <MainPageForm text="
Наша платформа забезпечує конфіденційність всіх її користувачів. Ми вкладаємо великі зусилля для забезпечення безпеки та приватності наших користувачів, гарантуючи, що дані кожного стартапу залишаються захищеними від несанкціонованого доступу. Ми ретельно дотримуємося високих стандартів безпеки й конфіденційності, щоб кожен учасник нашої платформи міг працювати у спокої та впевненості у збереженні своїх конфіденційних даних." />
                                <img className="mainImage2" src="/form4.svg" alt={""}/>
                            </div>
                            </div>
                    </div>
                </main>

            </div>
        </div>
    );
}

export default MainPage;

