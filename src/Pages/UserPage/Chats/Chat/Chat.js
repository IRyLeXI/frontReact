import React, { useState } from 'react';
import './Chat.css'; // Підключаємо файли стилів

function FullChatPage() {
    const username = localStorage.getItem('chatname');



    const initialMessages = [
        { id: 1, text: 'Hello!', sender: 'User1' },
        { id: 2, text: 'Hi there!', sender: username },
        // Додайте більше повідомлень за необхідності
    ];

    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');

    const handleMessageSend = () => {
        if (newMessage.trim() !== '') {
            const newMsg = {
                id: messages.length + 1,
                text: newMessage,
                sender: username,
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h3>{username}</h3>
            </div>
            <div className="chat-messages">
                {messages.map((message) => (
                    <div key={message.id} className={message.sender === username ? 'my-message' : 'other-message'}>
                        <p>{message.text}</p>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleMessageSend}>Send</button>
            </div>
        </div>
    );
}

export default FullChatPage;
