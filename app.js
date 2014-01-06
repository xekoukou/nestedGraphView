var host = '127.0.0.1:8000';
var secret = '234346hdsv b4dfngduingvkgnv';
var sessionExpiry = 10*60 * 1000; //if the user doesnt do anything
var cleanInterval = 60 * 1000;  //every minute


var fs = require('fs');

//tls certificate

var tlsOptions = {
    key: fs.readFileSync(__dirname + '/tls/server.key'),
    cert: fs.readFileSync(__dirname + '/tls/server.crt'),
    ca: fs.readFileSync(__dirname + '/tls/ca.crt'),
};

var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var express = require('express');
var app = express();
var server = require('https').createServer(tlsOptions, app);
var io = require('socket.io').listen(server);

//start server
server.listen(8000);

//a memoryStore
var sessionStore = new express.session.MemoryStore();

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


//configure passport


var users = new Object();

passport.use(new GoogleStrategy({
        returnURL: 'https://' + host + '/auth/google/return',
        realm: 'https://' + host +
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

//configure socket.io
var passportSocketIo = require('passport.socketio');

io.set('authorization', passportSocketIo.authorize({
    cookieParser: express.cookieParser,
    key: 'express.sid', // the name of the cookie where express/connect stores its session_id
    secret: secret, // the session_secret to parse the cookie
    store: sessionStore, // we NEED to use a sessionstore. no memorystore please
    success: onAuthorizeSuccess, // *optional* callback on success - read more below
    fail: onAuthorizeFail, // *optional* callback on fail/error - read more below
}));

function onAuthorizeSuccess(data, accept) {
    console.log('successful connection to socket.io');

    // The accept-callback still allows us to decide whether to
    // accept the connection or not.
    accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
    if (error)
        throw new Error(message);
    console.log('failed connection to socket.io:', message);

    // We use this callback to log all of our failed connections.
    accept(null, false);
}

//clean Session Information //TODO only usefull for a memoryStore

setInterval(function(sessionStore, users) {

        var sessions = sessionStore.sessions;
        var keys = Object.keys(sessions);
        var date = new Date(Date.now());

        for (var i = 0; i < keys.length; i++) {
            json = JSON.parse(sessions[keys[i]]);
            if (json.passport.user !== undefined) {
                if (date > users[json.passport.user].ld) {
                    delete users[json.passport.user]; //CAREFULL this is the serialized email
                    sessionStore.destroy(keys[i], null);

                }
            }
        }
    },
    cleanInterval, sessionStore, users);

function Node(id, parentId, level, childrenIds, summary, content, posX,
    posY) {

    this.id = id;
    this.level = level;
    this.parentId = parentd;
    this.childrenIds = childrenIds;
    this.posX = posX;
    this.posY = posY;
    this.content =
        '<div class = "nestedGraphNodeContent ' + id + '" >' + content + '</div>';
    this.summary =
        '<div class = "nestedGraphNode ' + id + '" >' + summary + '</div>';

}

io.of('/nestedGraphView').on('connection', function(socket) {
        socket.on('request', function(data) {
            socket.emit('data', data);
        });
    }

);
