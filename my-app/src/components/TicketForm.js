import React, { useState } from 'react';

const TicketForm = ({ addTicket }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim() && description.trim()) {
            addTicket({ title, description });
            setTitle(''); // Clear title input after submission
            setDescription(''); // Clear description input after submission
        }
    };

    return (
        <form onSubmit={handleSubmit} className="ticket-form">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Ticket Title"
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Ticket Description"
                required
                rows="4"
            />
            <button type="submit">Add Ticket</button>
        </form>
    );
};

export default TicketForm;
