var requirejs = require('requirejs');

requirejs.config({
	nodeRequire: require,
	baseDir: __dirname,
	paths: {
		'public':'public/javascripts'
	}
});

requirejs(['underscore', 'express', './routes', 'http', 'path', 'socket.io', 'public/drawing', 'public/line'],
function   (_, express, routes, http, path, socketio, Drawing, Line) {

"use strict";

var app = express()
  , server = http.createServer(app)
  , io = socketio.listen(server);

server.listen(8080);

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
app.get('/require.js', function(req,res){
 res.sendfile(__dirname + '/node_modules/requirejs/require.js');
});
app.get('/javascripts/underscore.js', function(req,res){
 res.sendfile(__dirname + '/node_modules/underscore/underscore-min.js');
});

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

});