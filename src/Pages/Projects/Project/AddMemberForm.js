import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddMemberForm = ({ projectId, members, onCancel }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get('https://localhost:7068/api/User/All');
            if (response.status === 200) {
                const users = response.data.filter(user => 
                    !members.some(member => member.id === user.id) && user.role !== 4
                );
                setAllUsers(users);
                setFilteredUsers(users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        const filtered = allUsers.filter(user =>
            `${user.firstname} ${user.lastname}`.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleAddMember = async (user) => {
        const url = user.role === 3 
            ? 'https://localhost:7068/api/Project/Add/Mentor'
            : 'https://localhost:7068/api/Project/Add/Student';
        try {
            const response = await axios.post(url, {
                projectId,
                userId: user.id
            });
            if (response.status === 200) {
                onCancel(); // Hide the form after successful addition
            }
        } catch (error) {
            console.error('Error adding member:', error);
        }
    };

    return (
        <div>
            <h2>Add Member</h2>
            <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
            />  
            <div className="users-list">
                {filteredUsers.map(user => (
                    <div key={user.id} className="user-item">
                        <img src={`data:image/jpeg;base64,${user.imageBase64}`}alt={`${user.firstname} ${user.lastname}`} className="user-avatar" />
                        <div className="user-info">
                            <h3>{`${user.firstname} ${user.lastname}`}</h3>
                            <button className="add-user-button" onClick={() => handleAddMember(user)}>+</button>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={onCancel} className="cancel-button">Cancel</button>
        </div>
    );
};

export default AddMemberForm;
