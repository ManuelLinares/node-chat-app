const socketIO = require('socket.io')
const moment = require('moment')

const socketConfig = server => {

  const io = socketIO(server)

  io.on('connection', socket => {
    console.log('New user connected');

    socket.broadcast.emit('newMessage', {
      from: 'Admin',
      text: 'New user joined',
      createdAt: moment().valueOf()
    })

    socket.emit('newMessage', {
      from: 'Admin',
      text: 'Welcome to the app',
      createdAt: moment().valueOf()
    })

    socket.on('disconnect', socket => {
      console.log('User disconnected');
    })

    socket.on('createMessage', data => {
      io.emit('newMessage', {
        ...data,
        createdAt: moment().valueOf()
      })
    })

    socket.on('createLocationMessage', data => {
      io.emit('newLocationMessage', {
        from: data.from,
        url: `https://www.google.com/maps?q=${data.lat},${data.lon}`,
        createdAt: moment().valueOf()
      })
    })
  })
}

module.exports = { socketConfig }