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
var form = require("express-form"),
	field = form.field;

module.exports = function (app, config, customersDB) {

	var layout = 'admin/layout';

	var mw = {
		validate : function (req, res, next) {
			var fields = {
				name: 'name'
			};

			return form(
				field(fields.name).required(null, 'Bitte gebe einen Namen für den Kunden ein.')
			)(req, res, function () {
				// Prepare the flash messages.
				if (!req.form.isValid) {
					req.flash('error', req.form.errors);
				}

				next();
			});
		}
	};

	var helpers = {
		createSlug: function (str) {
			str = str.replace(/^\s+|\s+$/g, '');
			str = str.toLowerCase();

			var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
			var to   = "aaaaeeeeiiiioooouuuunc------";
			for (var i=0, l=from.length ; i<l ; i++) {
			    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
			}

			str = str.replace(/[^a-z0-9 -]/g, '')
			  .replace(/\s+/g, '')
			  .replace(/-+/g, '');

			return str;
		}
	};

	// -- LIST --
	app.get('/', function (req, res) {
		var customers = [];

		customersDB.forEach(function (key, value) {
			if (value) {
				var modules = [];

				var twitter = value.services.twitter.active;
				if (twitter) {
					modules.push('Twitter');
				}

				var facebook = value.services.facebook.active;
				if (facebook) {
					modules.push('Facebook');
				}

				customers.push({
					id: key,
					name: value.name,
					modules: (modules.length !== 0) ? modules : undefined
				});
			}
		});

		res.render('admin/customers/list', {
			customers: customers,
			layout:layout,
			locals: {flash: req.flash()}
		});
	});

	// -- CREATE --
	app.get('/create', function (req, res) {
		res.render('admin/customers/create', {
			layout: layout,
			locals: {flash: req.flash()}
		});
	});

	app.post('/create', mw.validate, function (req, res) {
		var formData = req.body;

		var renderTemplate = function () {
			res.render('admin/customers/create', {
				layout: layout,
				name: formData.name,
				twitterId: formData.twitterId,
				facebookId: formData.facebookId,
				locals: {flash: req.flash()}
			});
		};

		if (!req.form.isValid) {
			renderTemplate();
		} else {
			var id = helpers.createSlug(formData.name);

			var exists = customersDB.get(id);

			if (!exists) {
				customersDB.set(id, {
					name: formData.name,
					services: {
						twitter: {
							active: (formData.twitterId) ? true : false,
							id: formData.twitterId,
							oauth: {
								token: '',
								secret: ''
							}
						},
						facebook: {
							active: (formData.facebookId) ? true : false,
							id: formData.facebookId,
							oauth: {
								token: '',
								secret: ''
							}
						}
					}
				}, function () {
					req.flash('info', 'Der Kunde wurde angelegt.');

					res.redirect('/admin/customers');
				});
			} else {
				req.flash('error', 'Der Kunde existiert bereits.');

				renderTemplate();
			}
		}
	});

	// -- EDIT --
	app.get('/:customer/edit', function (req, res) {
		var id = req.params.customer;
		var customer = customersDB.get(id);

		if (customer) {
			customer.id = id;

			res.render('admin/customers/edit', {
				customer: customer,
				layout: layout,
				locals: {flash: req.flash()}
			});
		} else {
			req.flash('error', 'Der Kunde existiert nicht.')

			res.redirect('/admin/customers');
		}
	});

	app.post('/:customer/edit', mw.validate, function (req, res) {
		var key = req.params.customer;
		var data = req.body;

		var customer = customersDB.get(key);

		var renderTemplate = function () {
			res.render('admin/customers/edit', {
				customer: customer,
				layout: layout,
				locals: {flash: req.flash()}
			});
		};

		if (customer) {
			customer.name = data.name;

			data.twitterActive = (data.twitterActive === 'on');
			data.facebookActive = (data.facebookActive === 'on');

			if (data.twitterActive) {
				customer.services.twitter.active = true;

				if (!data.twitterId) {
					req.flash('error', 'Wenn Twitter aktiv ist, so muss auch ein Username angegeben werden.');
					renderTemplate();

					return;
				}
			} else {
				customer.services.twitter.active = false;				
			}

			if (data.facebookActive) {
				customer.services.facebook.active = true;

				if (!data.facebookId) {
					req.flash('error', 'Wenn Facebook aktiv ist, so muss auch eine Profil-ID angegeben werden.');
					renderTemplate();

					return;
				}
			} else {
				customer.services.facebook.active = false;
			}

			// Check if the admin has changed the facebook id and/or twitter id.
			// If so, we have to clear the oauth credentials.
			if (customer.services.twitter.id !== data.twitterId) {
				customer.services.twitter.oauth.token = '';
				customer.services.twitter.oauth.secret = '';
			}

			if (customer.services.facebook.id !== data.facebookId) {
				customer.services.facebook.oauth.token = '';
				customer.services.facebook.oauth.secret = '';
			}

			customer.services.twitter.id = data.twitterId;
			customer.services.facebook.id = data.facebookId;

			// TODO: Check why there is actually an id.
			delete customer.id;

			customersDB.set(key, customer, function () {
				req.flash('info', 'Der Kunde wurde gespeichert.');

				res.redirect('/admin/customers');
			});
		} else {
			req.flash('error', 'Der Kunde existiert nicht.');
			renderTemplate();
		}
	});

	// -- DELETE --
	app.get('/:customer/delete', function (req, res) {
		var id = req.params.customer;
		var customer = customersDB.get(id);

		var _redirect = function () {
			res.redirect('/admin/customers');
		};

		if (customer) {
			customersDB.rm(id, function () {
				_redirect();
			});
		} else {
			req.flash('error', 'Der Kunde existiert nicht.');

			_redirect();
		}
	});
};