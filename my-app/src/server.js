const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow your React app's origin
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.static('build')); // Serve your React app

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

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
