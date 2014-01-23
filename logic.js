module.exports = {

    startLogic = function(io, dealer) {

        function Node(id, parentId, level, childrenIds, fNodes, bNodes, summary, content, posX,
            posY) {

            this.id = id;
            this.fNodes = fNodes; //a hashed collection of  ids  fnodes[id]=true
            this.bNodes = bNodes;
            this.id = id;
            this.level = level;
            this.parentId = parentId;
            this.childrenIds = childrenIds;
            this.posX = posX;
            this.posY = posY;
            this.content =
                '<div class = "nestedGraphNodeContent ' + id + '" >' + content + '</div>';
            this.summary =
                '<div class = "nestedGraphNode ' + id + '" >' + summary + '</div>';

        }

        io.of('/nestedGraphView').on('connection', function(socket) {
            socket.on('request', function(data) {
                var result = validator.validate(data, schema.client - request);
                if (result.valid == false) {
                    console.log('received invalid data');
                    return;
                }
                var json_request = new Array();
                json_request[0] = new Object();
                json_request[0].type = 0;
                json_request[0].id = socket.id;
                json_request[0].posX = data.posX;
                json_request[0].posY = data.posY;
                //the critical bit
                json_request[0].pos = 64 - Math.floor(Math.max(Math.log(maxWidth * data.zoom) / Math.LN2, Math.log(maxHeight * data.zoom) / Math.LN2));

                dealer.send(JSON.stringify(json_request));

            });

        });



        dealer.on('message', function(msg) {
            var json_recv = JSON.parse(msg.toString);
            //TODO ask for content and summary


            io.of('/nestedGraphView').sockets.socket(json_recv.id).emit('data', response);
        });

    }
}
