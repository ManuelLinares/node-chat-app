$(document).ready(function () {
  var socket = io();

  socket.on('connect', function () { console.log('Connected to server') })

  socket.on('disconnect', function () { console.log('Disconnected from server') })

  socket.on('newMessage', function(data) {
    var li = $('<li></li>').text(data.from + ': ' + data.text)
    $('#messages').append(li)
  })

  socket.on('newLocationMessage', function(data) {
    var li = $('<li></li>')
    var aTag = $('<a target="__blank">My current location</a>')

    aTag.attr('href', data.url)
    li.text(data.from + ': ')
    li.append(aTag)
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

  $('#send-location').on('click', function() {
    if (!navigator.geolocation) {
      return alert('Geolocation not supported')
    }

    navigator.geolocation.getCurrentPosition(function(pos){
      socket.emit('createLocationMessage', {
        from: 'User',
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      })
    }, function() {
      alert('Unable to get your location')
    })
  })
})