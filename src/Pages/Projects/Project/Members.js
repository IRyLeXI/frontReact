import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import AddMemberForm from './AddMemberForm';

const Members = ({ projectId }) => {
    const [members, setMembers] = useState([]);
    const [isCreator, setIsCreator] = useState(false);
    const [showAddMemberForm, setShowAddMemberForm] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await axios.get(`https://localhost:7068/api/Project/GetAll/Members/${projectId}`);
            if (response.status === 200) {
                console.log(response.data);
                const membersData = response.data.map(member => ({
                    ...member,
                    project_role: convertRole(member.project_role)
                }));
                setMembers(membersData);

                const token = localStorage.getItem('jwtToken');
                const decodedToken = jwtDecode(token);
                const currentUserId = decodedToken.Id;

                const currentUser = membersData.find(member => member.id === currentUserId);
                if (currentUser && currentUser.project_role === 'creator') {
                    setIsCreator(true);
                }
            }
        } catch (error) {
            console.error('Error fetching project members:', error);
        }
    };

    const convertRole = (project_role) => {
        switch (project_role) {
            case 0: 
                return 'member';
            case 1:
                return 'creator';
            case 2:
                return 'mentor';
            default:
                return 'unknown';
        }
    };

    const handleAddMemberClick = () => {
        setShowAddMemberForm(true);
    };

    const handleCancelAddMember = () => {
        setShowAddMemberForm(false);
    };

    return (
        <div>
            <h2>Учасники</h2>
            {isCreator && !showAddMemberForm && (
                <button className="add-member-button" onClick={handleAddMemberClick}>Add Member</button>
            )}
            {showAddMemberForm ? (
                <AddMemberForm projectId={projectId} members={members} onCancel={handleCancelAddMember} />
            ) : (
                <div className="members-list">
                    {members.map(member => (
                        <div key={member.id} className="member-item">
                            <img src={`data:image/jpeg;base64,${member.imageBase64}`} alt={`${member.firstname} ${member.lastname}`} className="member-avatar" />
                            <div className="member-info">
                                <h3>{`${member.firstname} ${member.lastname}`}</h3>
                                <p>{member.project_role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Members;
