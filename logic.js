var clientNodejsProtocol = require("./clientNodejsProtocol.js");
var nodeSchema = require("./node.js");
var tv4 = require('tv4');
tv4.addSchema("node.js", nodeSchema);



module.exports = {

    io: function(socket, io, dealer, users) {
        socket.on('request', function(data) {
            console.log("nodejs received: " + JSON.stringify(data));
            var report = tv4.validateResult(data, clientNodejsProtocol.request);
            if (report.valid == true) {
                console.log(report);

                var json_request = new Object();
                json_request.sessionId = socket.id;
                json_request.clientRequest = data;
                dealer.send(JSON.stringify(json_request));
                console.log("nodejs sent:" + JSON.stringify(json_request));
            } else {
                console.log('received invalid data');
                console.log(report);
                console.log("suberrors:");
                if (report.error.subErrors != null) {
                    var i;
                    for (i = 0; i < report.error.subErrors.length; i++) {
                        console.log(report.error.subErrors[i]);
                    }
                }
            }
        });
    },



    zmq: function(dealer, io) {
        dealer.on('message', function(zeroframe, msg) {
            console.log("nodejs received:" + msg.toString());

            var json_recv = JSON.parse(msg.toString());


            if (json_recv.type == 'response') {
                io.of('/graph').socket(json_recv.sessionId).emit('response', json_recv.clientResponse);
            } else {
                if (json_recv.type == 'newData') {
                    var i;
                    for (i = 0; i < json_recv.sessionIds.length; i++) {
                        io.of('/graph').socket(json_recv.sessionIds[i]).emit('newData', json_recv.newData);
                    }
                }
            }
        });

    }
}
