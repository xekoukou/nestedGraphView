var openpgp = require('openpgp');
var User = require('./user.js');
//TODO Can an attacker give us malicious data that compromise the server

module.exports = function(socket, users) {

    socket.on("req_auth", function(data) {
        console.log("received req.auth");
        var user = new User();
        users[socket.id] = user;

        if (data.publicKey != null) {
            var result = openpgp.key.readArmored(data.publicKey);
            if (result.err == null) {
                user.publicKey = result.keys[0];
                console.log("transmitting session_auth");
                socket.emit("session_auth", {
                    "sessionId": user.createSessionId()
                });
                console.log("new sessionId:" + user.sessionId);
                return;
            }
        }
        //else
        delete users[socket.id];


    });

    socket.on("signed_auth", function(data) {

        var user = users[socket.id];
        if (user != null) {
            if (data.signed != null) {
                console.log("data.signed:" + data.signed);
                var cleartext = openpgp.cleartext.readArmored(data.signed);
                if (cleartext != null) {
                    var result = openpgp.verifyClearSignedMessage([user.publicKey], cleartext);
                    var valid = result.signatures[0].valid;
                    console.log("is it valid? " + valid);

                    if (valid) {
                        user.authenticated = 1;
                        console.log("one user authenticated");
                        return;
                    }

                }
            }
        }

        //else
        delete users[socket.id];

    });


}
