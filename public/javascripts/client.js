<<<<<<< HEAD
=======
requirejs(['socket.io', 'public/drawing'],
function(io, Drawing) {

"use strict";

>>>>>>> refs/heads/develop
var socket = io.connect(location.origin);
var canvas = document.getElementById('drawing');
var ctx = canvas.getContext('2d');
var drawing = new Drawing(ctx);
var currentLine;

socket.on('serverError', function() {
	alert('There was a server error');
});

socket.on('reset', function(lines) {
	drawing.setLines(lines);
});

socket.on('newLine', function(line) {
	drawing.newLine(line);
});
socket.on('updateLine', function(data) {
	drawing.updateLine(data[0], data[1]);
});
socket.on('lineFinished', function(id) {
	drawing.lineFinished(id);
});


document.getElementById('reset').addEventListener('click', function(event) {
	drawing.setLines();
	socket.emit('clear');
}, false);

var pointFromEvent = function(event) {
	return {x:event.clientX-canvas.offsetLeft,y:event.clientY-canvas.offsetTop};
}

canvas.addEventListener('mousedown', function(event) {
	  var point = pointFromEvent(event);
	currentLine = drawing.startLine(point);
	socket.emit('newLine', currentLine.toJSON());
}, false);
canvas.addEventListener('mousemove', function(event) {
	if(currentLine) {
		var point = pointFromEvent(event);
	  	currentLine.update(point);
	  	socket.emit('updateLine', [currentLine.id,point]);
	}
}, false);
canvas.addEventListener('mouseup', function(event) {
	socket.emit('lineFinished', currentLine.id);
	currentLine.isFinished = true;
	currentLine = null;
<<<<<<< HEAD
}, false);
=======
}, false);

});
>>>>>>> refs/heads/develop
