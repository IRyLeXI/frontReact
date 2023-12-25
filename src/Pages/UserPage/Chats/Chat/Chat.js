import SendMessageForm from './SendMessageForm';
import MessageContainer from './MessageContainer';
import { Button } from 'react-bootstrap';
import   './Chat.css'
import React from "react";
const Chat = ({ sendMessage, messages,  closeConnection }) => <div className="chat-page">
    <div className='leave-room'>
        <Button className='leave-room' variant='danger' onClick={() => closeConnection()}>Chats</Button>
    </div>
    <div className='chat'>
        <MessageContainer messages={messages} />
        <SendMessageForm sendMessage={sendMessage} />
    </div>
    <div className="chat-image">
        <img src="/123.svg" alt="SVG" />
    </div>
</div>

export default Chat;
