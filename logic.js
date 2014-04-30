module.exports = {

    startLogic: function(io, dealer, clientNodejsProtocol) {
        var validator = require('json-schema');

        io.of('/nestedGraphView').on('connection', function(socket) {
            socket.on('request', function(data) {
                var result = validator.validate(data, clientNodejsProtocol.request);
                if (result.valid == false) {
                    console.log('received invalid data');
                    return;
                }

                var json_request = new Object();
                json_request.sessionId = socket.id;
                json_request.clientRequest = data;
                dealer.send(JSON.stringify(json_request));
console.log("nodejs sent:" + JSON.stringify(json_request));

            });
        });



        dealer.on('message', function(zeroframe,msg) {
     console.log("nodejs received:" + msg.toString());

            var json_recv = JSON.parse(msg.toString());


            if (json_recv.type == 'response') {
                io.sockets.socket(json_recv.sessionId).emit('response', json_recv.clientResponse);
            } else {
                if (json_recv.type == 'newData') {
                    var i;
                    for (i = 0; i < json_recv.sessionIds.length; i++) {
                        io.of('/nestedGraphView').sockets.socket(json_recv.sessionIds[i]).emit('newData', json_recv.newData);
                    }
                }
            }
        });

    }
}
