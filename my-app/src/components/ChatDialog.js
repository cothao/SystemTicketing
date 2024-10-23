import React, { useState } from 'react';

const ChatDialog = ({ ticket, onClose, addMessage }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            addMessage(message); // This should trigger the addMessageToTicket in App.js
            setMessage(''); // Clear input
        }
    };

    return (
        <div className="chat-dialog">
            <h2>Chat for Ticket: {ticket.title}</h2>
            <div className="messages">
                {ticket.messages.map((msg, index) => (
                    <div key={index} className="message">
                        {msg}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={handleSend}>Send</button>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default ChatDialog;
