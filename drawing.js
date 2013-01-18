Line = function(drawing) {
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
		this.drawing.context.strokeStyle = 'hsla('+this.color+',100%,50%,1)';	
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


Drawing = function(context) {
	this.lines = [];
	this.context = context;
}

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
		this.context.clearRect(0, 0, canvas.width, canvas.height);
		
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
}