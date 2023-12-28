import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import refreshToken from "../../Helpers/refreshToken";
import UserSideBar from "../UserPage/UserSideBar";
import SideBar from "../MainPage/SideBar";
import "./Sessions.css"
import {Link} from "react-router-dom";
import AddSession from "./CreateSession";
const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [selectedUser,setSelectedUser]= useState(null)
    const [expandedSessions, setExpandedSessions] = useState({});


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        let decoded = jwtDecode(localStorage.getItem("jwtToken"));
        let jwtToken = localStorage.getItem("jwtToken");
        console.log(jwtToken, decoded.Id);

        console.log("our User id " + decoded.Id);
        const authorized = await refreshToken();

        if (authorized) {
            const response = await axios.get(
                `https://localhost:7224/api/Sessions/Psychologist/${decoded.Id}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
            if (response.status === 200) {
                console.log(response.data);
                setSessions(response.data);
            }
        }
    };

    const handleDateChange = (event) => {
        const selected = event.target.value;
        setSelectedDate(selected);

        // Фільтрація сесій за обраною датою
        const filtered = sessions.filter(session => {
            const sessionDate = new Date(session.beginDate).toISOString().split('T')[0];
            return sessionDate === selected;
        });
console.log("lox")
        console.log(filtered)
        console.log("lox")
        setFilteredSessions(filtered);
    };

    const handleSearch = () => {

    };
    const handleSessionClick = async (session) => {
        const response = await axios.get(`https://localhost:7224/api/User/Id/${session.userId}`);
        if (response.status === 200) {
            setSelectedUser(response.data);
        }

        // Копіюємо поточний стан expandedSessions
        const newExpandedSessions = { ...expandedSessions };

        // Перевіряємо, чи додаткова інформація для цієї сесії відкрита
        const isExpanded = expandedSessions[session.id];

        // Закриваємо додаткову інформацію для всіх сесій
        for (const sessionId in newExpandedSessions) {
            newExpandedSessions[sessionId] = false;
        }

        // Відкриваємо / закриваємо додаткову інформацію для поточної сесії
        newExpandedSessions[session.id] = !isExpanded;

        // Встановлюємо новий стан expandedSessions
        setExpandedSessions(newExpandedSessions);
    };

    const handleDeleteSession = async (session) => {
        console.log(selectedSession);
        let jwtToken = localStorage.getItem("jwtToken")
        console.log(expandedSessions)
        console.log(session)
        if (session.id) {
            const response = await axios.delete(`https://localhost:7224/api/Sessions/Delete/${session.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    }
                });
            if(response.status===200)
            {
                window.location.reload();

            }
        }
    };

    const handleAdd = () => {
        // Logic for handling addition of a session
        // For example, you can show a modal or a form for adding a new session
    };

    return (
        <div className="user-container">
            <div className="card">
                <div className="notes-section">
                    <h1>Нотатки</h1>
                    <div className="button-add">
                      <Link to="/addSession"><button onClick={handleAdd}>Додати</button></Link>
                    </div>
                </div>
                <div className="search-section">
                    <input
                        className="date-picker"
                        type="date"
                        placeholder="select date"
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
                </div>
                <div className="filtered-sessions">
                    {filteredSessions.map((session, index) => (
                        <div
                            className="session-card"
                            key={index}
                            onClick={() => handleSessionClick(session)}
                        >
                            <p>{session.name}</p>
                            <p>{new Date(session.endDate).toLocaleDateString()}</p>
                            {expandedSessions[session.id] && (
                                <div className="expanded-info">
                                    <h2>{session.name}</h2>
                                     <h3>{session.description}</h3>
                                    <p>{selectedUser.firstName} {selectedUser.lastName}</p>
                                    <button onClick={()=>{handleDeleteSession(session)}}>Видалити</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sessions;
