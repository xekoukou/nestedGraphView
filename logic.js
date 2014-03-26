module.exports = {

    startLogic: function(io, dealer) {

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
                var result = validator.validate(data, schema.searchRequest);
                if (result.valid == false) {
                    console.log('received invalid data');
                    return;
                }

                var json_request = new Object();
                json_request.id = socket.id;
		json_request.type = 'searchRequest'
		json_request.browser_request = data;
                dealer.send(JSON.stringify(json_request));


            });
            socket.on('update', function(data) {
                var result = validator.validate(data, schema.insertRequest);
                if (result.valid == false) {
                    console.log('received invalid data');
                    return;
                }
                var json_request = new Object();
                json_request.id = socket.id;
		json_request.type = 'updateRequest';
		json_request.request = data;
                dealer.send(JSON.stringify(json_request));

		//TODO REMOVE THE BELOW CODE ,look at broker
                json_request.id = socket.id;
                if (data.request.type == "newNode") {
                json_request.type = 1;
                    json_request.posX = data.request.posX;
                    json_request.posY = data.request.posY;
                    //this is to show that it is a new node
                    json_request.id = -1;
                    dealer.send(JSON.stringify(json_request));
                }
                if (data.request.type == "delNode") {
                json_request.type = 2;
                    json_request.posX = data.request.posX;
                    json_request.posY = data.request.posY;
                    json_request.id = data.request.request.id;
                    dealer.send(JSON.stringify(json_request));
                }
                if (data.request.request.type == "newPosition") {
                json_request.type = 1;
                    json_request.posX = data.request.request.posX;
                    json_request.posY = data.request.request.posY;
                    json_request.id = data.request.request.id;
                    dealer.send(JSON.stringify(json_request));

                }




            });

        });



        dealer.on('message', function(msg) {
            var json_recv = JSON.parse(msg.toString);
            //TODO ask for content and summary

            if (json_recv.request == 'search' ) {
                io.of('/nestedGraphView').sockets.socket(json_recv.id).emit('data', json_recv.data);
            }else{
//TODO broadcast only to those that are close to the event
                io.of('/nestedGraphView').sockets.broadcast.emit('data', json_recv.data);
}
        });

    }
}
