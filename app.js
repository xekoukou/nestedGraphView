if (process.argv.length != 4) {
    console.log("Please provide the ip and port to which nodejs will connect to the position_server");
    return -1;
}

var users = new Object();

var config = require("./config.js").config;
var expressModule = require("./express.js");
var express = require('express');
var passport = require('passport');
var sessionStore = expressModule.startSessionStore(express, config.cleanInterval, users);
var app = expressModule.startExpressApp(express, passport, config.secret, sessionStore);
var passportJs = require("./passport.js")
passportJs.startPassport(passport, config.address, config.port, config.sessionExpiry, users);
passport = passportJs.appAuth(passport, app);
var server = require("./http.js").startHTTPServer(config.address, config.port, app);
var io = require("./socketIO.js").startSocketIO(server, express, passport, config.secret, sessionStore);
var dealer = require("./zmq.js").startZMQ(process.argv[2], process.argv[3]);
//logic
var clientNodejsProtocol = require("./clientNodejsProtocol.js");
require("./logic.js").startLogic(io, dealer, clientNodejsProtocol);
