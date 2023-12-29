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
                                <MainPageForm  text="Зв'язок і підтримка — основні аспекти нашої платформи. Тут ви зможете знайти не лише відповіді на ваші питання, але й нові знайомства з людьми, які поділяють ваші цінності та інтереси. Наші психологи готові допомогти вам у всіх життєвих сферах — від особистих взаємин до самопізнання та розвитку. " />
                            </div>
                            <div className="image-container">
                                <img className="mainImage2" src="/form3.svg" alt={""}/>
                                <MainPageForm text="
Групові заняття на нашій платформі створюють унікальну можливість спілкування та взаємодії з людьми, які поділяють подібні цінності та інтереси. Це чудова можливість обговорити теми та ситуації в розумній та підтримуючій атмосфері. Групові заняття дають можливість отримати підтримку не лише від психолога, а й від інших учасників групи, які можуть поділитися власним досвідом та точкою зору. " />
                            </div>
                        </div>
                        <div className="column">
                            <div className="image-container">
                                <MainPageForm text="
Наші психологи — це професіонали, які пройшли строго відбір та перевірку кваліфікації. Ми пильно обираємо експертів з великим досвідом і відмінними навичками, щоб забезпечити вам найвищий рівень підтримки. Кожен з наших психологів має не лише необхідну освіту, а й практичний досвід у різних сферах психології, що дозволяє надавати індивідуальний та професійний підхід у кожній консультації." />
                                <img className="mainImage2" src="/form2.svg" alt={""}/>
                            </div>
                            <div className="image-container">
                                <MainPageForm text="Наша платформа пропонує гнучкий графік консультацій, що дозволяє вам обирати зручний час для зустрічі з психологом. Ви можете отримати підтримку та поради, не виходячи з дому або офісу. Наша команда психологів працює у різний час доби, щоб відповідати вашим потребам та забезпечувати доступність консультацій у відповідності з вашим розкладом." />
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

