const { DBConnection } = require('./lib/db');

const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const db = DBConnection;

io.on('connection', (socket) => { 
  console.log('Call from client');
  
  socket.on('join-room', (user) => {
    if(!db.isUserExistInRoom(user)) {
      console.log('User LoggedIn : ', user, socket.id);
      const _user = {id: socket.id, ...user}
      db.addUser(_user);

      // Push in message
      const message = {message: `${user.email} joined`, roomId: user.roomId};
      db.addMessege(message);
      io.to(user.roomId).emit('new-message', message);
    } 
    let roomId = user.roomId;  
    
    socket.join(roomId);

  });

  socket.on('get-users', (param) => {
    const users = db.findByUserRoomId(param.roomId);
    io.to(param.roomId).emit('user-list', users);
    console.log('Users::', users);
  });

  socket.on('get-messages', (param) => {
    messages = db.findMessageByRoomID(param.roomId);
    console.log('Message:: ', messages);
    io.to(param.roomId).emit('message-list', messages);
  });

  socket.on('message-send', (message) => {
    console.log('Message recevied:: ' , message);
    db.addMessege(message);
    const roomId = message.roomId;
    io.to(roomId).emit('new-message', message);
  })

  socket.on('disconnect', () => {
    const leftUser = db.findByUserId(socket.id);

    if(leftUser.length > 0) {
      const user = leftUser[0];
      const message = {message: `${user.email} left`, roomId: user.roomId}
      db.addMessege(message);

      db.removeUserById(user.id);
      console.log("[DB]::disconncet::listUsers::", db.listUsers());

      io.to(user.roomId).emit('user-list', db.findByUserRoomId(user.roomId));
      io.to(user.roomId).emit('new-message', message);
      socket.leave(user.roomId);
    }
  });

  socket.on('leave', (user) => {
    console.log('User Info : ', user);
    
    db.removeUser(user);

    // Push in message
    const message = {message: `${user.email} left`, roomId: user.roomId}
    db.addMessege(message)

    io.to(user.roomId).emit('user-list', db.findByUserRoomId(user.roomId));
    io.to(user.roomId).emit('new-message', message);
    socket.leave(user.roomId);
  });

});


server.listen(3500, () => console.log('Server Started at 3500'));  