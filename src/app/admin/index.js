/*!
 * socialproxy
 *
 * Copyright(c) 2012 Konex Media, Stuttgart, Germany
 *
 * Author:
 *     André König <andre.koenig@konexmedia.com>
 *
 * MIT Licensed
 *
 */

module.exports = function (app, config, databases) {

	var mw = {
		authenticated: function (req, res, next) {
			if (!req.user) {
				if (req.url.indexOf('login') === -1) {
					req.flash('error', 'Für diesen Bereich musst Du angemeldet sein.');

					res.redirect('/admin/users/login');
				} else {
					next();
				}
			} else {
				next();
			}
		}
	};

	// A dynamic helper for accessing the user object from
	// within the views.
	app.dynamicHelpers({
	    userSession: function (req, res) {
	        return (req.user) ? req.user : {};
	    }
	});

	// DOCME
	app.namespace('/admin', function() {

		// The WELCOME route.
		//
		// If the user is already logged in, we say "Hello" and
		// send him to the dashboard.
		app.get('/', mw.authenticated, function (req, res) {
			res.render('admin/dashboard', {
				user: req.user
			});
		});

		// The ABOUT route.
		//
		// Description of the SocialProxy app.
		app.get('/about', mw.authenticated, function (req, res) {
			res.render('admin/about', {
				user: req.user,
				meta: config.meta
			});
		});

		// The USER namespace.
		//
		// Contains all routes which are necessary for
		// managing the users that can access this administration area.
		app.namespace('/users', mw.authenticated, function () {

			require('./users')(app, config, databases.users);
		});

		// DOCME
		app.namespace('/customers', mw.authenticated, function () {

			require('./customers')(app, config, databases.customers);
		});
	});
};