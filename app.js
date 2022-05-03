var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);
var port    =  process.env.PORT||5000;

//Add recent chats to messages array
var messages = [];
var prevChat = 10;
var storeMessage = function(name,data){
  messages.push({name:name,data:data});
if(messages.length>prevChat){
  messages.shift();
}
};

app.use(express.static(__dirname+'/public'));

io.on('connection',function(socket){

socket.on('join',function(name){

socket.userName = name;
socket.broadcast.emit('chat',name + ' has joined the chat')
console.log(name+' has joined the chat');

socket.on('disconnect',function(){
  socket.broadcast.emit('chat',name + ' has left the chat');
  console.log(name+' has left the chat');
});
});

socket.on('chat',function(message){
 io.emit('chat',socket.userName + ': ' + message);
 storeMessage(socket.userName,message);
 console.log(socket.userName + ': ' + message);

});

messages.forEach(function(message){
  socket.emit('chat',message.name + ": " + message.data);

});
});


server.listen(port,function(){
  console.log('server listening on port 2323');
})