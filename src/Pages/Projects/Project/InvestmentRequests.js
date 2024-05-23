import React, { useEffect, useState } from 'react';
import axios from 'axios';
import  "./InvestmentRequests.css"
const InvestmentRequests = ({ projectId }) => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axios.get(`https://localhost:7068/api/Requests/GetAll/${projectId}`);
            if (response.status === 200) {
                setRequests(response.data);
            }
        } catch (error) {
            console.error('Error fetching investment requests:', error);
        }
    };

    const handleStatusChange = async (requestId, status) => {
        try {
            await axios.post('https://localhost:7068/api/Requests/Change/status/', { requestId, status });
            fetchRequests(); // Refresh the list of requests
        } catch (error) {
            console.error('Error changing request status:', error);
        }
    };

    return (
        <div className="investment-requests">
            <h2>Investment Requests</h2>
            {requests.map(request => (
                <div key={request.id} className="request-card">
                    <p>{request.message}</p>
                    <p><strong>Contact:</strong> {request.contactData}</p>
                    <p><strong>Investor:</strong> {request.userId}</p>
                    <div className="request-actions">
                        <button onClick={() => handleStatusChange(request.id, 'Accepted')}>Accept</button>
                        <button onClick={() => handleStatusChange(request.id, 'Declined')}>Decline</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InvestmentRequests;
