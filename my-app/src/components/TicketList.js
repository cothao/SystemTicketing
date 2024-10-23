import React from 'react';

const TicketList = ({ tickets, onTicketClick }) => {
    return (
        <div className="ticket-list">
            {tickets.map((ticket) => (
                <div key={ticket.id} className="ticket-item" onClick={() => onTicketClick(ticket)}>
                    <h3>{ticket.title}</h3>
                    <p>{ticket.description}</p>
                    <span>{ticket.messages.length} messages</span>
                </div>
            ))}
        </div>
    );
};

export default TicketList;
