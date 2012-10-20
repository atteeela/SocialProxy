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

"use strict";

var path             = require('path'),
    passport         = require('passport'),
    TwitterStrategy  = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function (app, config, customersDB, auth) {

    var mw = {

        // Middleware for checking whether a customer exists or not.
        // If so, we load the customer from the database and pass it
        // to the request object, so that the other routes can work
        // with this customer data.
        loadCustomer : function (req, res, next) {
            var customerId = req.params.customer,
                customer = customersDB.get(customerId);

            // Well, we have to check if the request goes
            // to a static file (like a resource *.css or something).
            // If so, we don't have to check for the customer.
            if (!path.extname(req.url)) {

                if (!customer) {
                    res.send('Customer not found.', 404);
                } else {
                    customer.id = customerId;
                    req.customer = customer;

                    next();
                }
            } else {
                next();
            }
        }
    };

    // Twitter authentication system.
    app.namespace('/twitter', function () {
        passport.use(new TwitterStrategy({
            consumerKey: config.services.twitter.consumer_key,
            consumerSecret: config.services.twitter.consumer_secret,
            callbackURL: config.environment.domain + 'twitter/authenticated'
        }, function (token, secret, profile, done) {
            var twitterId = profile.username,
                customer,
                customerId;

            customersDB.forEach(function (key, customerData) {
                if (customerData.services.twitter.id === twitterId) {
                    customerId = key;
                    customer = customerData;

                    return false;
                }
            });

            if (customer) {
                customer.services.twitter.oauth.token = token;
                customer.services.twitter.oauth.secret = secret;

                delete customer.id;

                customersDB.set(customerId, customer, function () {
                    return done(null, customer);
                });
            } else {
                // TODO: Better exception handling.
                return done(null, false, { message: 'Unknown customer' });
            }
        }));

        app.get('/authenticate', passport.authenticate('twitter'));

        // Twitter will redirect the user to this URL after approval.  Finish the
        // authentication process by attempting to obtain an access token.  If
        // access was granted, the user will be logged in. Otherwise,
        // authentication has failed.
        app.get('/authenticated', passport.authenticate('twitter'), function (req, res) {
            res.send("Alles ist cool. Dein Twitter-Account wurde nun im SocialProxy hinterlegt. Danke :).");

            req.session.destroy();
        });
    });

    // Facebook authentication system.
    app.namespace('/facebook', function () {
        passport.use(new FacebookStrategy({
            clientID: config.services.facebook.client_id,
            clientSecret: config.services.facebook.client_secret,
            callbackURL: config.environment.domain + 'facebook/authenticated'
        }, function (token, secret, profile, done) {
            var profileId = profile.id,
                customer,
                customerId;

            customersDB.forEach(function (key, customerData) {
                if (customerData.services.facebook.id === profileId) {
                    customerId = key;
                    customer = customerData;

                    return false;
                }
            });

            if (customer) {
                customer.services.facebook.oauth.token = token;
                customer.services.facebook.oauth.secret = secret;

                delete customer.id;

                customersDB.set(customerId, customer, function () {
                    return done(null, customer);
                });
            } else {
                // TODO: Better exception handling.
                return done(null, false, { message: 'Unknown customer' });
            }
        }));

        app.get('/authenticate', passport.authenticate('facebook', { scope: 'offline_access' }));

        // Facebook will redirect the user to this URL after approval.  Finish the
        // authentication process by attempting to obtain an access token.  If
        // access was granted, the user will be logged in. Otherwise,
        // authentication has failed.
        app.get('/authenticated', passport.authenticate('facebook'), function (req, res) {
            res.send("Alles ist cool. Dein Facebook-Account wurde nun im SocialProxy hinterlegt. Danke :)");

            req.session.destroy();
        });
    });

    // Init the api namespace.
    app.namespace('/:customer', function () {
        app.get('*', mw.loadCustomer);

        require('./twitter')(app, config, customersDB);

        require('./facebook')(app, config, customersDB);
    });
};