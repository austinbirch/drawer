global._ = require('underscore');

var memcache = require('memcache')
  , app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
  
//var memcacheClient = new memcache.Client(11211, 'localhost');
//memcacheClient.connect();

server.listen(8080);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/drawing.js', function (req, res) {
  res.sendfile(__dirname + '/drawing.js');
});
app.get('/underscore.js', function (req, res) {
  res.sendfile(__dirname + '/node_modules/underscore/underscore.js');
});

require('./drawing.js');

var drawing = new Drawing();

function loadDrawing(callback) {
	
}
function saveDrawing() {
	
}

io.sockets.on('connection', function (socket) {
  socket.emit('reset', drawing.toJSON());
  socket.on('clear', function() {
  	drawing.setLines();
  	socket.broadcast.emit('reset', drawing.toJSON());
  });
  socket.on('newLine', function(line, fn) {
  	drawing.newLine(line);
  	socket.broadcast.emit('newLine', line);
  });
  socket.on('updateLine', function(data, fn) {
  	drawing.updateLine(data[0], data[1]);
  	socket.broadcast.emit('updateLine', data);
  });
  socket.on('lineFinished', function(id, fn) {
  	drawing.lineFinished(id);
  	socket.broadcast.emit('lineFinished', id);
  	saveDrawing();
  });
});