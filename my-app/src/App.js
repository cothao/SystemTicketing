import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import ChatDialog from './components/ChatDialog';
import "./App.css"

const socket = io('http://localhost:3001'); // Change the URL if needed

const App = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        const storedTickets = localStorage.getItem('tickets');
        if (storedTickets) {
            setTickets(JSON.parse(storedTickets));
        }
    }, []);

    useEffect(() => {
        socket.on('receiveMessage', (ticketId, message) => {
            setTickets((prevTickets) => {
                const updatedTickets = prevTickets.map((ticket) => {
                    if (ticket.id === ticketId) {
                        // Check if the message is already present to avoid duplicates
                        if (!ticket.messages.includes(message)) {
                            return { ...ticket, messages: [...ticket.messages, message] };
                        }
                    }
                    return ticket;
                });

                // Update the selected ticket if it's currently open
                if (selectedTicket && selectedTicket.id === ticketId) {
                    setSelectedTicket((prev) => ({
                        ...prev,
                        messages: prev.messages.includes(message) ? prev.messages : [...prev.messages, message],
                    }));
                }

                return updatedTickets;
            });
        });

        socket.on('receiveTicket', (ticket) => {
            const ticketExists = tickets.some(t => t.id === ticket.id);
            if (!ticketExists) {
                setTickets((prevTickets) => {
                    const updatedTickets = [...prevTickets, ticket];
                    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
                    return updatedTickets;
                });
            }
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('receiveTicket');
        };
    }, [selectedTicket, tickets]);

    const addTicket = (ticket) => {
        const newTicket = { ...ticket, id: Date.now(), messages: [] };

        const ticketExists = tickets.some(t => t.title === newTicket.title);
        if (ticketExists) {
            alert("This ticket already exists!");
            return;
        }

        setTickets((prevTickets) => {
            const updatedTickets = [...prevTickets, newTicket];
            localStorage.setItem('tickets', JSON.stringify(updatedTickets));
            socket.emit('newTicket', newTicket);
            return updatedTickets;
        });
    };

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
    };

    const closeChat = () => {
        setSelectedTicket(null);
    };

    const addMessageToTicket = (message) => {
        if (!selectedTicket) return; // Guard clause

        const updatedTickets = tickets.map((ticket) =>
            ticket.id === selectedTicket.id
                ? { ...ticket, messages: [...ticket.messages, message] }
                : ticket
        );

        setTickets(updatedTickets);
        localStorage.setItem('tickets', JSON.stringify(updatedTickets));

        // Emit the message to other clients only once
        socket.emit('sendMessage', selectedTicket.id, message);
    };

    return (
        <div className="App">
            <h1>Ticketing System</h1>
            <TicketForm addTicket={addTicket} />
            <TicketList tickets={tickets} onTicketClick={handleTicketClick} />
            {selectedTicket && (
                <ChatDialog
                    ticket={selectedTicket}
                    onClose={closeChat}
                    addMessage={addMessageToTicket}
                />
            )}
        </div>
    );
};

export default App;
