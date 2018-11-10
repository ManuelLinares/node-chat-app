$(document).ready(function () {
  var socket = io();

  socket.on('connect', function () { console.log('Connected to server') })
  
  socket.on('disconnect', function () { console.log('Disconnected from server') })

  socket.on('newMessage', function(data) {
    var li = $('<li></li>').text(data.from + ': ' + data.text)
    $('#messages').append(li)
  })

  $('#message-form').on('submit', function (e) {
    e.preventDefault()
    socket.emit('createMessage', {
      from: 'User',
      text: $('[name=message]').val()
    })
    $('[name=message]').val('')
  })
})