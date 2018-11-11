const socketIO = require('socket.io')
const moment = require('moment')
const { isRealString } = require('../utils/validation')
const { Users } = require('../utils/users')

const socketConfig = server => {

  const io = socketIO(server)
  const users = new Users()

  io.on('connection', socket => {
    console.log('New user connected');

    socket.on('join', (data, callback) => {
      if (!isRealString(data.name) || !isRealString(data.room)) {
        return callback('Name and Room must be valid strings.')
      }
      data.room = data.room.toLowerCase()
      if (users.getUserByNameAndRoom(data.name, data.room)) {
        return callback('User name already taken in this room.')
      }

      socket.join(data.room)
      users.removeUser(socket.id)
      users.addUser(socket.id, data.name, data.room)

      io.to(data.room).emit('updateUsersList', users.getUserList(data.room))

      socket.broadcast.to(data.room).emit('newMessage', {
        from: 'Admin',
        text: `${data.name} joined`,
        createdAt: moment().valueOf()
      })

      socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the app',
        createdAt: moment().valueOf()
      })

      callback()
    })

    socket.on('disconnect', () => {
      const user = users.removeUser(socket.id)
      if (user) {
        io.to(user.room).emit('updateUsersList', users.getUserList(user.room))
        io.to(user.room).emit('newMessage', {
          from: 'Admin',
          text: `${user.name} has left the room`,
          createdAt: moment().valueOf()
        })
      }

    })

    socket.on('createMessage', (data, callback) => {
      const user = users.getUser(socket.id)
      if (user && isRealString(data.text)) {
        io.to(user.room).emit('newMessage', {
          from: user.name,
          text: data.text,
          createdAt: moment().valueOf()
        })
        callback()
      }
    })

    socket.on('createLocationMessage', data => {
      const user = users.getUser(socket.id)
      if (user) {
        io.to(user.room).emit('newLocationMessage', {
          from: user.name,
          url: `https://www.google.com/maps?q=${data.lat},${data.lon}`,
          createdAt: moment().valueOf()
        })
      }
    })
  })
}

module.exports = { socketConfig }