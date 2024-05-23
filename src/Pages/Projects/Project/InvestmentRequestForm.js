import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import "./InvestmentRequests.css"
const InvestmentRequestForm = ({ projectId }) => {
    const [message, setMessage] = useState('');
    const [contactData, setContactData] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.Id;

        const requestData = {
            userId,
            projectId,
            message,
            contactData,
            status: 'Pending'
        };

        try {
            await axios.post('https://localhost:7068/api/Requests/Create', requestData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Request submitted successfully');
        } catch (error) {
            console.error('Error creating investment request:', error);
        }
    };

    return (
        <div className="investment-request-form">
            <h2>Investment Request</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="contactData">Contact Data</label>
                    <input type="text" id="contactData" name="contactData" value={contactData} onChange={(e) => setContactData(e.target.value)} required />
                </div>
                
                <button type="submit">Submit Request</button>
                
            </form>
        </div>
    );
};

export default InvestmentRequestForm;
