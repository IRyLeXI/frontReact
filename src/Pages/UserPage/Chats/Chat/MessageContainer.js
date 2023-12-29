import { useEffect, useRef, useState } from 'react';
import './Chat.css'
import { jwtDecode } from "jwt-decode"

const MessageContainer = ({ messages }) => {
    const messageRef = useRef();
    const [username, setUsername] = useState('');

    useEffect(() => {
        let decoded = jwtDecode(localStorage.getItem("jwtToken"));
        setUsername(decoded.unique_name)
        const user1 = localStorage.getItem("userId");
    }, [])
    useEffect(() => {
        if (messageRef && messageRef.current) {
            const { scrollHeight, clientHeight } = messageRef.current;
            messageRef.current.scrollTo({ left: 0, top: scrollHeight - clientHeight, behavior: 'smooth' });
            console.log(messages)
        }
    }, [messages]);

    return (
        <div ref={messageRef} className='message-container'>
            {messages.map((m, index) => {
                const formattedDate = new Date(m.sendDate).toLocaleString();
                if (m.user === username) {
                    return (
                        <div>
                            <div key={index} className="user-message from-right">
                                <div className="message bg-primary right">
                                    {m.message}
                                </div>

                            </div>
                            <div className='message-send-date-right'>
                                {formattedDate}
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <div key={index} className="user-message from-left">
                                <div className="message bg-primary left">
                                    {m.message}
                                </div>
                                <div className="from-user from-left">
                                    {m.user}
                                </div>
                            </div>
                            <div className='message-send-date-left'>
                                {formattedDate}
                            </div>
                        </div>
                    );
                }
            })}
        </div>
    );
}

export default MessageContainer;