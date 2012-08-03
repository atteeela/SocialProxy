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
var crypto = require('crypto'),
    form = require("express-form"),
	field = form.field,
	LocalStrategy = require('passport-local').Strategy,
    passport = require('passport');     

module.exports = function (app, config, usersDB) {

	// The layout into which we render the views from
	// the several routes.
	var layout = 'admin/layout';

	// The middleware we want to use in some routes.
	var mw = {
		validate : function (req, res, next) {
			var fields = {
				email: 'email',
				firstName: 'firstName',
				lastName: 'lastName',
				password: 'password',
				passwordConfirmation: 'passwordConfirmation'
			};

			return form(
				field(fields.email).required(null, 'Bitte gebe eine E-Mail Adresse ein.'),
				field(fields.email).trim().isEmail('Das ist leider keine gültige E-Mail Adresse.'),
				field(fields.firstName).required(null, 'Bitte gebe einen Vornamen ein.'),
				field(fields.lastName).required(null, 'Bitte gebe einen Nachnamen ein.'),
				field(fields.password).required(null, 'Bitte gebe ein Passwort ein.'),
				field(fields.passwordConfirmation).required(null, 'Bitte gebe dein Passwort erneut ein.'),
				field(fields.passwordConfirmation).equals('field::password', 'Die beiden Passwörter stimmen nicht überein.')
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
		hash: function (thisString) {
			var shasum = crypto.createHash('sha1');

			return shasum.update(thisString).digest('hex');
		}
	};

	// #### Passport functions
	// Serializing the user for the session handling.
	passport.serializeUser(function (email, done) {
	    done(null, email);
	});

	// Deserializing the user for the session handling.
	passport.deserializeUser(function (email, done) {
		var user = usersDB.get(email);
		user.email = email;

		done(null, user);
	});

	// Setting up the passport local authentication strategy.
	passport.use(new LocalStrategy(function (email, password, done) {
		// The email address is the key ;)

		var user = usersDB.get(email);

		var _failure = function () {
			return done(null, false, { message: 'Fehlerhafter Login' });
		};

		var failureMessage = 'Fehlerhafter Login.';

		if (user) {
			if (user.password === helpers.hash(password)) {

				return done(null, email);
			} else {
				return _failure();
			}
		} else {
			return _failure();
		}
	}));

	// -- LIST --
	app.get('/', function (req, res) {
		var users = [];

		usersDB.forEach(function (key, value) {
			if (value) {
				users.push({
					email: key,
					name: value.name
				});
			}
		});

		res.render('admin/users/list', {
			users: users,
			layout: layout,
			locals: {flash: req.flash()}
		});
	});

	// -- LOGIN --
	app.get('/login', function (req, res) {
		res.render('admin/users/login', {
			locals: {flash: req.flash()}
		});
	});

	app.post('/login',
		passport.authenticate('local', {
            failureRedirect: '/admin/users/login',
            failureFlash: true 
        }), function (req, res) {
		// After a successful login, we redirect the user to the
		// admins panel welcome page.
		res.redirect('/admin');
	});

	// -- CREATE --
	app.get('/create', function (req, res) {
		res.render('admin/users/create', {
			layout: layout,
			locals: {flash: req.flash()}
		});
	});

	app.post('/create', mw.validate, function (req, res) {
		var formData = req.body;

		var renderTemplate = function () {
			res.render('admin/users/create', {
				layout: layout,
				email: formData.email,
				firstName: formData.firstName,
				lastName: formData.lastName,
				locals: {flash: req.flash()}
			});
		};

		if (!req.form.isValid) {
			renderTemplate();
		} else {
			var user = usersDB.get(formData.email);
			
			if (!user) {
				usersDB.set(formData.email, {
					name: {
						first: formData.firstName,
						last: formData.lastName
					},
					password: helpers.hash(formData.password)
				}, function () {
					req.flash('info', 'Der Benutzer wurde erfolgreich angelegt.');

					res.redirect('/admin/users/');
				});
			} else {
				req.flash('error', 'Der Benutzer existiert bereits.');

				renderTemplate();
			}
		}
	});

	// -- EDIT --
	app.get('/:email/edit', function (req, res) {
		var email = req.params.email;

		var user = usersDB.get(email);

		if (user) {
			res.render('admin/users/edit', {
				layout: layout,
				email: email,
				firstName: user.name.first,
				lastName: user.name.last,
				password: user.password,
				locals: {flash: req.flash()}
			});
		} else {
			req.flash('error', 'Der Benutzer existiert nicht.');

			res.redirect('/admin/users');
		}
	});

	app.post('/:email/edit',  mw.validate, function (req, res) {
		var email = req.params.email;
		var formData = req.body;

		var user = usersDB.get(email);
		
		if (user) {
			// We have to check if the admin has changed the users
			// password. If so, we have to create a new hash from
			// the changed password.
			if (formData.password !== user.password) {
				user.password = helpers.hash(formData.password);
			}

			user.name.first = formData.firstName;
			user.name.last = formData.lastName;

			usersDB.set(email, user, function () {
				req.flash('info', 'Der Benutzer wurde gespeichert.');
			});
		} else {
			req.flash('error', 'Der Benutzer existiert nicht.');
		}

		res.redirect('/admin/users');
	});

	// -- DELETE --
	app.get('/:email/delete', function (req, res) {
		var emailFromDeletableUser = req.params.email;
		var loggedInUser = req.user;

		// Check that we don't delete the user who
		// is currently logged in.
		if (emailFromDeletableUser !== loggedInUser.email) {
			usersDB.rm(emailFromDeletableUser, function () {
				req.flash('info', 'Der Benutzer wurde gelöscht.');

				res.redirect('/admin/users');
			});
		} else {
			req.flash('error', 'Du kannst dich nicht selbst löschen ;)');

			res.redirect('/admin/users');
		}
	});
};