import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import refreshToken from "../../Helpers/refreshToken";
import UserSideBar from "../UserPage/UserSideBar";
import SideBar from "../MainPage/SideBar";
import "./Sessions.css"
import {Link, useNavigate} from "react-router-dom";
import AddSession from "./CreateSession";
const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [selectedUser,setSelectedUser]= useState(null)
    const [expandedSessions, setExpandedSessions] = useState({});
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                if (localStorage.getItem("jwtToken") != null) {
                    let response =await refreshToken();
                    if(!response) {
                        navigate("/main");
                    }
                }

            } catch (ex) {
                console.error('Error during authorization check:', ex);
            }
        };
        checkAuthorization();
        fetchData();
    }, []);
    const renderStatusIcon = (status) => {
        switch (status) {
            case 0:
                return <div className="status-icon pending">Pending</div>;
            case 1:
                return <div className="status-icon success">Success</div>;
            case 2:
                return <div className="status-icon problem">Problem</div>;
            default:
                return null;
        }
    };
    const fetchData = async () => {
        let decoded = jwtDecode(localStorage.getItem("jwtToken"));
        let jwtToken = localStorage.getItem("jwtToken");
        console.log(jwtToken, decoded.Id);

        console.log("our User id " + decoded.Id);
        const authorized = await refreshToken();
        setIsAuthorized(authorized)
        console.log(isAuthorized);


        if (authorized) {
            const response = await axios.get(
                `http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Sessions/Psychologist/${decoded.Id}`,
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
        const response = await axios.get(`http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/User/Id/${session.userId}`);
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
            const response = await axios.delete(`http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Sessions/Delete/${session.id}`,
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

    const handleUpdateSession = async (status,session) => {
        let jwtToken = localStorage.getItem("jwtToken")
        const decoded = jwtDecode(localStorage.getItem("jwtToken"));
        const updatedSession = { ...selectedSession, status: status };
        try {
          console.log(updatedSession,session);
            const response = await axios.put('http://ec2-51-20-249-147.eu-north-1.compute.amazonaws.com:7224/api/Sessions/Update',
                {
                    id:session.id,
                    psychologistId: decoded.Id,
                    userId:session.userId,
                    name:session.name,
                    beginDate:session.beginDate,
                    endDate:session.endDate,
                    description:session.description,
                    sessionStatus:status

                },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    }});
            if (response.status === 200) {
                console.log('Session updated successfully');
                window.location.reload();

            }
        } catch (error) {
            console.error('Error updating session:', error);
        }
    };







    return (
        <>
            {isAuthorized ? (
                <div>
                    <UserSideBar></UserSideBar>

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
                            <div className={`session-status ${session.sessionStatus === 0 ? 'pending' : session.sessionStatus === 1 ? 'success' : session.sessionStatus === 2 ? 'problem' : ''}`}>
                                {session.sessionStatus === 0 && <div className="status-icon pending-icon"></div>}
                                {session.sessionStatus === 1 && <div className="status-icon success-icon"></div>}
                                {session.sessionStatus === 2 && <div className="status-icon problem-icon"></div>}
                            </div>

                            <p>{session.name}</p>
                            <p>{new Date(session.endDate).toLocaleDateString()}</p>

                            {expandedSessions[session.id] && (
                                <div className="expanded-info">
                                    <h2>{session.name}</h2>
                                    <h3>{session.description}</h3>
                                    <p>{selectedUser.firstName} {selectedUser.lastName}</p>
                                    <button onClick={() => {handleDeleteSession(session)}}>Видалити</button>
                                    <button onClick={() => handleUpdateSession(1,session)}>Успішно</button>
                                    <button onClick={() => handleUpdateSession(2,session)}>Виникли проблеми</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
                </div>
    ) : (
        <div>Not authorized</div>
    )}

</>
    );
};

export default Sessions;
