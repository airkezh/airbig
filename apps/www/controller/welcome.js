var controlFns = {
	'index': function() {
		console.log('welcome index!!!!!!!!!!!!')
		var php = {};

		this.bindDefault(php);
		this.bridgeMuch(php);
		this.listenOver(function(data) {
			//data._CSSLinks = ['page/welcome'];
			this.render('welcome.html', data);
		});
	}
}

exports.__create = controller.__create(controlFns);
