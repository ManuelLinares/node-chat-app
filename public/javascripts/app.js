$(document).ready(function () {
  var socket = io();

  socket.on('connect', function () { console.log('Connected to server') })

  socket.on('disconnect', function () { console.log('Disconnected from server') })

  socket.on('newMessage', function(data) {
    var renderedLi = Mustache.render($('#message-template').html(), {
      from: data.from,
      text: data.text,
      createdAt: moment(data.createdAt).format('HH:MM a')
    })
    $('#messages').append(renderedLi)
  })

  socket.on('newLocationMessage', function(data) {
    var renderedLi = Mustache.render($('#location-message-template').html(), {
      from: data.from,
      url: data.url,
      createdAt: moment(data.createdAt).format('HH:MM a')
    })
    $('#messages').append(renderedLi)
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

    $('#send-location').attr('disabled', 'disabled').text('Sending location...')

    navigator.geolocation.getCurrentPosition(function(pos){
      socket.emit('createLocationMessage', {
        from: 'User',
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      })
      $('#send-location').removeAttr('disabled').text('Send location')
    }, function() {
      alert('Unable to get your location')
      $('#send-location').removeAttr('disabled').text('Send location')
    })
  })
})