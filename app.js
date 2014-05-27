if (process.argv.length != 4) {
    console.log("Please provide the ip and port to which nodejs will connect to the position_server");
    return -1;
}

var users = new Object();

var config = require("./config.js");

var serve = require("./serve.js");

var server = require("./http.js")(config.address, config.port, serve);

var io = require("./socketIO.js")(server);

var dealer = require("./zmq.js")(process.argv[2], process.argv[3]);


var logic = require("./logic.js");
var authorization = require("./authorization.js");

io.of('/graph').on('connection', function(socket) {
    authorization(socket, users);
    logic.io(socket, io, dealer, users);

    socket.on('disconnect', function() {

        delete users[socket.id];
        console.log("one user disconnected");
    });

});


logic.zmq(dealer, io);
