const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3001;

app.prepare().then(() => {
    const server = express();

    // Enable CORS
    server.use(cors());

    // Handle WebSocket connections
    const httpServer = http.createServer(server);
    const io = new Server(httpServer, {
        cors: {
            origin: '*',  // Adjust as necessary
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('chat message', (msg) => {
            io.emit('chat message', msg);
            console.log('Message received: ' + msg);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    // Serve Next.js pages
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    httpServer.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`Server running on port ${PORT}`);
    });
});
