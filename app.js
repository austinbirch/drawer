global._ = require('underscore');

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8082);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/javascripts/underscore.js', function(req,res){
 res.sendfile(__dirname + '/node_modules/underscore/underscore-min.js');
});


require('./public/javascripts/drawing.js');

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