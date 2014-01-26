module.exports = {

    startHTTPServer: function(address,port, app) {

        var fs = require('fs');

        //tls certificate

        var tlsOptions = {
            key: fs.readFileSync(__dirname + '/tls/server.key'),
            cert: fs.readFileSync(__dirname + '/tls/server.crt'),
            ca: fs.readFileSync(__dirname + '/tls/ca.crt'),
        };

        var server = require('https').createServer(tlsOptions, app);

        //start server
        server.listen(port,address);

        return server;

    }


}
