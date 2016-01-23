var express = require('express'),
config = require('./server/configure'),
app = express();
app.set('port', process.env.PORT || 3630);
app.set('views', __dirname + '/views');
app = config(app);

var mongoose = require('mongoose');

//app.get('/', function(req, res){
//	res.send('Hello World');
//});

mongoose.connect('mongodb://172.17.29.79/timer'); 

var http = require('http').Server(app);
var io = require('socket.io')(http);

var server = http.listen(app.get('port'), function(){
	console.log('Server up: http://localhost:' + app.get('port'));
});

//io.on('connection', function (socket) {
//  socket.emit('news', { hello: 'world' });
//  socket.on('my other event', function (data) {
//    console.log(data);
//  });
//});

//array to keep set of sockets
global.sockets = [];

//dynamic count of connected sockets
var cnt = 0;

//event handler for connection
io.sockets.on('connection', function(socket){
	global.sockets.push(socket);
	console.log("new connection - "+socket.id);

	socket.emit('request_username');

	socket.on('send_username', function(data){
		socket.username = data.username;
		console.log(data);
	});

//and register the disconnect handler on the SOCKET - not on the listener
	socket.on('disconnect',function() {
		//remove from array
		var s = [];
		var cnt = -1;
		for (var i=0, l=global.sockets.length; i<l; i++) {
			if (global.sockets[i].id !== socket.id) {
				s[++cnt] = global.sockets[i];
			}
		}
		console.log("Removing socket from array - oldCnt = " + global.sockets.length + " newcnt=" + s.length);
		global.sockets = s;

	});
});


