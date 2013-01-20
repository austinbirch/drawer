
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Drawer' });
<<<<<<< HEAD
=======
};

exports.whiteboard = function(req,res) {
	res.render('whiteboard', { title: 'Whiteboard', token: req.params.token });
>>>>>>> refs/heads/develop
};