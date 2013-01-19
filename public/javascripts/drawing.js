define(['underscore', 'public/line'],
function(_,Line) {

"use strict";

var Drawing = function(context) {
	this.lines = [];
	this.context = context;
};

Drawing.prototype = {
	setLines: function(lines) {
		lines || (lines = []);
		var d = this;
		if(lines.length && !(lines[0] instanceof Line)) {
			_.each(lines, function(line, i) {
				d.newLine(line);
			});
		} else this.lines = lines;
		this.draw();
	},
	
	getLine: function(id) {
		return _.find(this.lines, function(line){ return line.id === id; });
	},
	
	_clearContext: function() {
		// Store the current transformation matrix
		this.context.save();
		
		// Use the identity matrix while clearing the canvas
		this.context.setTransform(1, 0, 0, 1, 0, 0);
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
		
		// Restore the transform
		this.context.restore();
	},
	
	draw: function() {
		if(!this.context) return;
		this._clearContext();
		_.each(this.lines, function(line) {
			line.draw();
		});
	},
	
	startLine: function(point) {
		var l = new Line(this);
		l.update(point);
		this.lines.push(l);
		return l;
	},
	
	newLine: function(line) {
		this.lines.push(Line.revive(this, line));
	},
	
	updateLine: function(id, newPoint) {
		var line = this.getLine(id);
		if(line)
			line.update(newPoint);
	},
	
	lineFinished: function(id) {
		this.getLine(id).isFinished = true;
	},
	
	toJSON: function(toStorage) {
		var lines = [];
		_.each(this.lines, function(line) {
			if(!toStorage || line.isFinished)
				lines.push(line.toJSON());
		});
		return lines;
	}
};

return Drawing;

});