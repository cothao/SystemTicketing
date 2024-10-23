const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Change this to your production URL later
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build'))); // Serve static files from the React app

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sendMessage', (ticketId, message) => {
        io.emit('receiveMessage', ticketId, message); // Broadcast message to all clients
    });

    socket.on('newTicket', (ticket) => {
        io.emit('receiveTicket', ticket); // Broadcast new ticket to all clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Route to serve the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Set the port
const PORT = process.env.PORT || 3001;

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
