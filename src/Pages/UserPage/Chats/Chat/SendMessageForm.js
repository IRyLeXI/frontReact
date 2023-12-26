import { Form, Button, FormControl, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import   './Chat.css'

const SendMessageForm = ({ sendMessage }) => {
    const [message, setMessage] = useState('');

    const CreateMessage = () =>
    {
        const Message = {
            message: message,
            user: localStorage.getItem("userId")
        };
        return Message;
    }
    
    return <div >
        <Form className="send-message-form"
            onSubmit={e => {
                e.preventDefault();
                sendMessage(message);
                setMessage('');
            }}>
            <InputGroup>
                <FormControl type="user" placeholder="message..."
                             onChange={e => setMessage(e.target.value)} value={message} />
                <div className='input-group-append'>
                    <Button variant="primary" type="submit" disabled={!message}>Send</Button>
                </div>
            </InputGroup>
        </Form>
    </div>
}

export default SendMessageForm;
