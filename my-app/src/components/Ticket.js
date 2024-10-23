import React from 'react';

const Ticket = ({ ticket, onClick }) => {
    return (
        <div className="ticket" onClick={onClick}>
            <h3>{ticket.title}</h3>
            <p>{ticket.description}</p>
            {ticket.messages.length > 0 && (
                <span className="message-count">{ticket.messages.length}</span>
            )}
        </div>
    );
};

export default Ticket;
