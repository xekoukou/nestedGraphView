module.exports = {

    startSocketIO: function(server, express, secret, sessionStore) {

        var io = require('socket.io').listen(server);

        //configure socket.io
        var passportSocketIo = require('passport.socketio');

        io.set('authorization', passportSocketIo.authorize({
            cookieParser: express.cookieParser,
            key: 'express.sid', // the name of the cookie where express/connect stores its session_id
            secret: secret, // the session_secret to parse the cookie 
            store: sessionStore, // we NEED to use a sessionstore.
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


        return io;
    }

}
