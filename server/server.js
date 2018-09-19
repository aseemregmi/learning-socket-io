const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { User } = require('./utils/users');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new User();

app.use(express.static(publicPath));

io.on('connection', socket => {
  const roomList = users.getAllAvailableRooms();

  socket.emit('getAvailableRooms', roomList);

  socket.on('join', (params, callback) => {
    if (
      !isRealString(params['display-name']) ||
      !isRealString(params['room-name'])
    ) {
      return callback('Name and room name are required');
    }

    const usersList = users.getUserList(params['room-name'].toLowerCase());
    let doesUserExist;
    usersList.forEach(user => {
      if (user === params['display-name']) {
        doesUserExist = true;
      }
    });

    if (doesUserExist) {
      return callback('User Already Exists');
    }
    socket.join(params['room-name'].toLowerCase());
    users.removeUser(socket.id);
    users.addUser(
      socket.id,
      params['display-name'],
      params['room-name'].toLowerCase()
    );

    io.to(params['room-name'].toLowerCase()).emit(
      'updateUserList',
      users.getUserList(params['room-name'].toLowerCase())
    );

    // Message from admin for new user : Welcome to chat app
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chat App'));
    // Message from admin that new user joined chatroom
    socket.broadcast
      .to(params['room-name'])
      .emit(
        'newMessage',
        generateMessage('Admin', `${params['display-name']} has joined`)
      );

    callback();
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit(
        'newMessage',
        generateMessage('Admin', `${user.name} has left`)
      );
    }
  });

  socket.on('createMessage', (message, callback) => {
    const user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.to(user.room).emit(
        'newMessage',
        generateMessage(user.name, message.text)
      );
      callback();
    }
  });

  socket.on('createLocationMessage', coords => {
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        'newLocationMessage',
        generateLocationMessage(user.name, coords.lattitude, coords.longitude)
      );
    }
  });
});

server.listen(port, () => {
  console.log(`Listening in PORT ${port}`);
});
