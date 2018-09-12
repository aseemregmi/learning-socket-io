const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New User connected');

  // Message from admin for new user : Welcome to chat app
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chat App'));
  // Message from admin that new user joined chatroom
  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', 'New User Joined')
  );

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('createMessage', message => {
    console.log('New Message', message);

    io.emit('newMessage', generateMessage(message.from, message.text));
  });
});

server.listen(port, () => {
  console.log(`Listening in PORT ${port}`);
});
