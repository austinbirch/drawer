define(['underscore'],
function(_) {

"use strict";

var Line = function(drawing) {
	this.drawing = drawing;
	this.color = 0;
	this.size = 1;
	this.points = [];
	this.id = new Date().getTime();
	this.isFinished = false;
}

Line.revive = function(drawing, line) {
	var l = new Line(drawing);
	_.extend(l, line);
	return l;
}

Line.prototype = {
	setupContext: function() {
		if(!this.drawing.context) return;
		this.drawing.context.strokeStyle = 'hsla('+this.color+',100%,0%,1)';	
		this.drawing.context.lineWidth = this.size;	
	},

	draw: function() {
		if(!this.points.length || !this.drawing.context) return;
		this.setupContext();	
		this.drawing.context.beginPath();
		this.drawing.context.moveTo(this.points[0].x, this.points[0].y);
		for(var i = 1; i < this.points.length; i++) {
			var p = this.points[i];
			this.drawing.context.lineTo(p.x,p.y);
		}
		this.drawing.context.stroke();
	},
	
	update: function(newPoint) {
		this.points.push(newPoint);
		if(this.points.length <= 1 || !this.drawing.context) return;
		this.setupContext();
		this.drawing.context.beginPath();
		this.drawing.context.moveTo(this.points[this.points.length-2].x, this.points[this.points.length-2].y);
		this.drawing.context.lineTo(this.points[this.points.length-1].x, this.points[this.points.length-1].y);
		this.drawing.context.stroke();
	},
	
	toJSON: function() {
		return {
			points: this.points,
			size: this.size,
			color: this.color,
			id: this.id
		};
	}
};

return Line;

});