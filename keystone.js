require('babel-register')({ only: /\/graphql\/.*/ });

// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');
var pkg = require('./package.json');


// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'PenangJS',
	'brand': 'JavaScript Malaysia',
	'back': '/me',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',
	'view cache': false,

	'emails': 'templates/emails',

	'auto update': true,
	'mongo': process.env.MONGO_URI || 'mongodb://localhost/' + pkg.name,
	'session': true,
	'session store': 'mongo',
	'cookie secret': process.env.COOKIE_SECRET || 'sydjs',

	'auth': true,
	'user model': 'User',

	'google api key': process.env.GOOGLE_BROWSER_KEY,
	'google server api key': process.env.GOOGLE_SERVER_KEY,

	'ga property': process.env.GA_PROPERTY,
	'ga domain': process.env.GA_DOMAIN,

	'cloudinary secure': true,

	'basedir': __dirname,
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	moment: require('moment'),
	js: 'javascript:;',
	env: keystone.get('env'),
	utils: keystone.utils,
	plural: keystone.utils.plural,
	editable: keystone.content.editable,
	google_api_key: keystone.get('google api key'),
	ga_property: keystone.get('ga property'),
	ga_domain: keystone.get('ga domain'),
});

keystone.set('email locals', {
	utils: keystone.utils,
	host: (function () {
		if (keystone.get('env') === 'staging') return 'http://sydjs-beta.herokuapp.com';
		if (keystone.get('env') === 'production') return 'http://www.sydjs.com';
		return (keystone.get('host') || 'http://localhost:') + (keystone.get('port') || '3000');
	})(),
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

keystone.set('nav', {
	meetups: ['meetups', 'talks', 'rsvps'],
	members: ['users', 'organisations'],
	posts: ['posts', 'post-categories', 'post-comments'],
	links: ['links', 'link-tags', 'link-comments'],
});

// Start Keystone to connect to your database and initialise the web server

if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
	console.log('----------------------------------------'
	+ '\nWARNING: MISSING MAILGUN CREDENTIALS'
	+ '\n----------------------------------------'
	+ '\nYou have opted into email sending but have not provided'
	+ '\nmailgun credentials. Attempts to send will fail.'
	+ '\n\nCreate a mailgun account and add the credentials to the .env file to'
	+ '\nset up your mailgun integration');
}

keystone.start();
