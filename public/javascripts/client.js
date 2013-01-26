requirejs(['socket.io', 'public/drawing'],
function(io, Drawing) {

//"use strict";

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
	return {x:event.pageX-canvas.offsetLeft,y:event.pageY-canvas.offsetTop};
}

function downEvent(event) {
	  var point = pointFromEvent(event);
	currentLine = drawing.startLine(point);
	socket.emit('newLine', currentLine.toJSON());
	event.preventDefault();
}

function moveEvent(event) {
	if(currentLine) {
		var point = pointFromEvent(event);
	  	currentLine.update(point);
	  	socket.emit('updateLine', [currentLine.id,point]);
	}
	event.preventDefault();
}

function upEvent(event) {
	socket.emit('lineFinished', currentLine.id);
	currentLine.isFinished = true;
	currentLine = null;
	event.preventDefault();
}

canvas.addEventListener('mousedown', downEvent, false);
canvas.addEventListener('mousemove', moveEvent, false);
canvas.addEventListener('mouseup', upEvent, false);
canvas.addEventListener('touchstart', downEvent, false);
canvas.addEventListener('touchmove', moveEvent, false);
canvas.addEventListener('touchend', upEvent, false);


});