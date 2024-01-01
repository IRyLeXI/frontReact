// FriendshipRequestModal.js

import React from 'react';
import "./UserCard.css"
const FriendshipRequestModal = ({ showModal, handleCloseModal }) => {
    return (
        showModal && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={handleCloseModal}>
                        &times;
                    </span>
                    <p>Friendship request sent!</p>
                    <button onClick={handleCloseModal}>Close</button>
                </div>
            </div>
        )
    );
};

export default FriendshipRequestModal;
