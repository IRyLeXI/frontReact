import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './InvestorRequests.css';

const InvestorRequests = () => {
    const [requests, setRequests] = useState([]);
    const [projects, setProjects] = useState({});
    const userId = jwtDecode(localStorage.getItem("jwtToken")).Id;

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axios.get(`https://localhost:7068/api/Requests/GetAll/ByInvestor/${userId}`);
            if (response.status === 200) {
                const reqs = response.data;
                console.log(response.data)
                setRequests(reqs);
                fetchProjects(reqs);
            }
        } catch (error) {
            console.error('Error fetching investment requests:', error);
        }
    };

    const fetchProjects = async (requests) => {
        const projectsInfo = {};
        for (let request of requests) {
            console.log(request)
            if (!projectsInfo[request.PtojectId]) {
                const response = await axios.get(`https://localhost:7068/api/Project/id/${request.projectId}`);
                if (response.status === 200) {
                    projectsInfo[request.PtojectId] = response.data.name;
                }
            }
        }
        setProjects(projectsInfo);
    };

    return (
        <div className="investor-requests">
            <h2>Your Investment Requests</h2>
            {requests.map(request => (
                <div key={request.Id} className="investor-request-card">
                    <h3>{projects[request.ProjectId]}</h3>
                    <p>{request.message}</p>
                    <p><strong>Contact:</strong> {request.contactData}</p>
                    <p className={`status ${request.status}`}>{request.status}</p>
                </div>
            ))}
        </div>
    );
};

export default InvestorRequests;
