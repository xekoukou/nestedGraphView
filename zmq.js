module.exports = {

    startZMQ: function(pos_connect_point, port) {
        var pos_connnect_point = "tcp://" + pos_connect_point + ":" + port;

        var zmq = require('zmq');

        //connect to to position server
        var dealer = zmq.socket('dealer');
        dealer.connect(pos_connect_point);

        return dealer;
    }

}
