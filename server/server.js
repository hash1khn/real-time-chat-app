const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = {};

app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
  });

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
    // console.log("hello")
  });

  socket.on('send-chat-message', ({ message, room }) => {
    console.log("hello")
    if (room) {
        console.log("inside if")
      socket.to(room).emit('chat-message', { message: message, name: users[socket.id] });
    } else {
        console.log("inside else")
      socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    }
  });

  socket.on('join-room', (room, previousRoom) => {
    if (previousRoom) {
      socket.leave(previousRoom);
    }
    socket.join(room);
    socket.to(room).emit('user-connected', users[socket.id]);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
