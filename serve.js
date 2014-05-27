var path = require('path');
var fs = require('fs');
var pfolder = "./client";


module.exports = {

    serve: function(req, res) {
        console.log(req.url);
        console.log(req.headers);
        console.log(req.method);
        console.log(req.trailers);

        return this.route(req, res);

    },

    route: function(req, res) {


        if (req.method == 'GET') {

            this.sendData(res, req.url);
        }

    },

    sendNotFound: function(res) {
        res.writeHead(404);
        res.end("404 Not Found");
        return;
    },


    //url is the url asked by the client
    sendData: function(res, url) {

        var nurl = path.resolve(url);
        nurl = pfolder + nurl;

        console.log(pfolder);
        console.log(url);

        var extname = path.extname(nurl);
        var ct = 0;
        switch (extname) {
            case ".html":
                ct = 'text/html';
                break;
            case ".js":
                ct = 'text/javascript';
                break;
            case ".css":
                ct = 'text/css';
                break;
        }

        if ((ct == 0)) {
            this.sendNotFound(res);
            return;
        }

        var data;
        try {

            data = fs.readFileSync(nurl, {
                encoding: "UTF-8"
            });
        } catch (e) {

            if (e.code === 'ENOENT') {
                this.sendNotFound(res);
                return;
            } else {
                throw (e);
            }
        }




        res.writeHead(200, {
            "Content-Type": ct
        });
        res.end(data);
        return;

    }


}
