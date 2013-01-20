var requirejs = require('requirejs');

<<<<<<< HEAD
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);
=======
requirejs.config({
	nodeRequire: require,
	baseDir: __dirname,
	paths: {
		'public':'public/javascripts'
	}
});

requirejs(['underscore', 'express', 'crypto', './routes', 'http', 'path', 'socket.io', 'public/drawing', 'public/line'],
function   (_, express, crypto, routes, http, path, socketio, Drawing, Line) {

"use strict";

var app = express()
  , server = http.createServer(app)
  , io = socketio.listen(server);
>>>>>>> refs/heads/develop

server.listen(8082);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
<<<<<<< HEAD
  app.use(express.bodyParser());
=======
  // parse input data
  app.use(express.bodyParser());
  // allow _method=PUT or DELETE overrides
>>>>>>> refs/heads/develop
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
<<<<<<< HEAD
});

app.get('/', routes.index);
app.get('/javascripts/underscore.js', function(req,res){
 res.sendfile(__dirname + '/node_modules/underscore/underscore-min.js');
});


require('./public/javascripts/drawing.js');
=======
});

var sessions = {};
>>>>>>> refs/heads/develop

app.get('/', routes.index);
app.get('/new', function(req,res) {
	crypto.randomBytes(12, function(ex, buf) {
		var token = buf.toString('hex');
		sessions[token] = {
			drawing: new Drawing()
		};
		res.writeHead(302, {
			Location: '/b/'+token
		});
		res.end();
	});
});
app.get('/b/:token', routes.whiteboard);
app.get('/require.js', function(req,res){
 res.sendfile(__dirname + '/node_modules/requirejs/require.js');
});
app.get('/javascripts/underscore.js', function(req,res){
 res.sendfile(__dirname + '/node_modules/underscore/underscore-min.js');
});

function loadDrawing(callback) {
	
}
function saveDrawing() {
	
}

io.configure(function() {
	io.set('authorization', function(handshakeData, callback) {
		var error = null;
		var referer = handshakeData.headers.referer;
		if(referer) {
			var matches = referer.match(/b\/([a-z0-9]+)$/i);
			if(matches[1] && sessions[matches[1]]) {
				handshakeData.token = matches[1];
				callback(null, true);
			} else error = 'bad_token';
		} else error = 'no_referer';
		callback(error, false);
	});
});

io.sockets.on('connection', function (socket) {
	var token = socket.handshake.token;
	socket.join(token);
	var session = sessions[socket.handshake.token];
	socket.emit('reset', session.drawing.toJSON());
	socket.on('clear', function() {
		session.drawing.setLines();
		socket.broadcast.to(token).emit('reset', session.drawing.toJSON());
	});
	socket.on('newLine', function(line, fn) {
		session.drawing.newLine(line);
		socket.broadcast.to(token).emit('newLine', line);
	});
	socket.on('updateLine', function(data, fn) {
		session.drawing.updateLine(data[0], data[1]);
		socket.broadcast.to(token).emit('updateLine', data);
	});
	socket.on('lineFinished', function(id, fn) {
		session.drawing.lineFinished(id);
		socket.broadcast.to(token).emit('lineFinished', id);
		saveDrawing();
	});
});

});