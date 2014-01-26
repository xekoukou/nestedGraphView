module.exports = {

    startPassport: function(passport, app,address,port, sessionExpiry, users) {

        var GoogleStrategy = require('passport-google').Strategy;

        //configure passport



        passport.use(new GoogleStrategy({
                returnURL: 'https://' + address +":"+ port + '/auth/google/return',
                realm: 'https://' + address + ":" + port +
                    '/'
            },
            function(identifier, profile, done) {
                user = new Object();
                user.ld = new Date(Date.now() + sessionExpiry);
                user.profile = profile;
                users[profile.emails[0].value] = user;
                return done(null, user);
            }

        ));



        passport.serializeUser(function(user, done) {
            done(null, user.profile.emails[0].value);
        });

        passport.deserializeUser(function(id, done) {
            user = users[id];
            done(null, user);
        });

        app.get('/auth/google', passport.authenticate('google'));

        app.get('/auth/google/return',
            passport.authenticate('google', {
                successRedirect: '/graph.html',
                failureRedirect: '/login.html'
            }));

        return passport;
    }

}
