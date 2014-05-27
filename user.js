var openpgp = require('openpgp');
var crypto = require('crypto');

module.exports =

function User() {
    this.sessionId = 0;
    this.authenticated = 0;
    this.publicKey = 0;

    this.createSessionId = function() {
        this.sessionId = crypto.randomBytes(256).toString("Base64");
        return this.sessionId;

    };

    this.clear = function() {
        this.sessionId = 0;
        this.publicKey = 0;
        this.authenticated = 0;
    };

}
