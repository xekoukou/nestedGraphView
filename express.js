module.exports = {


    startExpressApp: function(express, passport, secret, sessionStore) {




        var app = express();


        //configure express
        app.configure(function() {
            app.use(express.static(__dirname + '/client/'));
            app.use(express.cookieParser());
            app.use(express.bodyParser());
            app.use(express.session({
                key: 'express.sid',
                store: sessionStore,
                secret: secret,
            }));
            app.use(passport.initialize());
            app.use(passport.session());
            app.use(app.router);
        });

        return app;
    },

    startSessionStore: function(express) {
        //a memoryStore
        var sessionStore = new express.session.MemoryStore();


        return sessionStore;

    },
    cleanSessionStore: function(sessionStore, express, cleanInterval, users, io) {
        //clean Session Information //TODO only usefull for a memoryStore

        setInterval(function(sessionStore, users) {

                var sessions = sessionStore.sessions;
                var keys = Object.keys(sessions);
                var date = new Date(Date.now());

                for (var i = 0; i < keys.length; i++) {
                    json = JSON.parse(sessions[keys[i]]);
                    if ('user' in json.passport) {
                        if (date > users[json.passport.user].ld) {
                            delete users[json.passport.user];
                            sessionStore.destroy(keys[i], null);
                            io.of('/nestedGraphView').socket(keys[i]).disconnect(true);

                        }
                    }
                }
            },
            cleanInterval, sessionStore, users);

    }




}
