var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'about';
	locals.page.title = 'About PenangJS';

	locals.organisers = [
		{ name: 'CY Lim', image: '/images/organisers/cy_400_round.png', twitter: 'cylim226', title: 'Founder, MC, Coordinator', profile: '/member/cy' }
	]

	view.render('site/about');
}
