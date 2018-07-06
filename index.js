var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

var roomname = ""

const chat = io.of('/chat')
chat.on('connection', function(socket){
  socket.on('join', function(data) {
    console.log(data)
    roomname = data.roomname
    socket.join(data.roomname)
    chat.to(data.roomname).emit('join', data.userid)

    console.log(chat.adapter.rooms)
  })

  socket.on('message', function(data){
    chat.to(roomname).emit('message', data.message)
  });

  socket.on('leave', function(data) {
    chat.to(data.roomname).emit('leave', data.userid)
    socket.leave(data.roomname)

    console.log(chat.adapter.rooms)
  })

  socket.on('disconnect', function () {})
});


http.listen(5050, function() {
  console.log("server listening...", "5050")
})
