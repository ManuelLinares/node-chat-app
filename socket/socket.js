const socketIO = require('socket.io')

const socketConfig = server => {

  const io = socketIO(server)

  io.on('connection', socket => {
    console.log('New user connected');

    socket.broadcast.emit('newMessage', {
      from: 'Admin',
      text: 'New user joined',
      createdAt: new Date().getTime()
    })

    socket.emit('newMessage', {
      from: 'Admin',
      text: 'Welcome to the app',
      createdAt: new Date().getTime()
    })

    socket.on('disconnect', socket => {
      console.log('User disconnected');
    })

    socket.on('createMessage', data => {
      io.emit('newMessage', {
        ...data,
        createdAt: new Date().getTime()
      })
    })

    socket.on('createLocationMessage', data => {
      io.emit('newLocationMessage', {
        from: data.from,
        url: `https://www.google.com/maps?q=${data.lat},${data.lon}`,
        createdAt: new Date().getTime()
      })
    })
  })
}

module.exports = { socketConfig }