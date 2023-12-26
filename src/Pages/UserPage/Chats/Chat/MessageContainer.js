import { useEffect, useRef } from 'react';
import   './Chat.css'

const MessageContainer = ({ messages }) => {
    const messageRef = useRef();

    useEffect(() => {
        if (messageRef && messageRef.current) {
            const { scrollHeight, clientHeight } = messageRef.current;
            messageRef.current.scrollTo({ left: 0, top: scrollHeight - clientHeight, behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div ref={messageRef} className='message-container'>
            {messages.map((m, index) => (
                <div
                    key={index}
                    className={`user-message ${m.user === 'user1' ? 'from-left' : 'from-right'}`}
                >
                    <div className={`message bg-primary ${m.user === 'user1' ? 'left' : 'right'}`}>
                        {m.message}
                    </div>
                    <div className={`from-user ${m.user === 'user1' ? 'from-left' : 'from-right'}`}>
                        {m.user}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MessageContainer;
