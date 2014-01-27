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
                json_request.type = 0;
                json_request.id = socket.id;

                var json_data = new Array();
                json_data[0] = new Object();
                json_data[0].posX = data.posX;
                json_data[0].posY = data.posY;
                //the critical bit
                json_data[0].pos = 64 - Math.floor(Math.max(Math.log(maxWidth * data.zoom) / Math.LN2, Math.log(maxHeight * data.zoom) / Math.LN2));

                json_request.data = json_data;
                dealer.send(JSON.stringify(json_request));

            });
            socket.on('update',function(data){
                var result = validator.validate(data, schema.insertRequest);
                if (result.valid == false) {
                    console.log('received invalid data');
                    return;
                }

                var json_request = new Object();
                json_request.type = 1;
                json_request.id = socket.id;
if(data.request.type == "newNode"){
json_request.posX = data.request.posX;
json_request.posY = data.request.posY;
//this is to show that it is a new node
json_request.id = -1;
                dealer.send(JSON.stringify(json_request));
}
if(data.requuest.request.type == "newPosition"){
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

//TODO if insert type broadcast to all except socketid
if(json_recv.type == 0){
            io.of('/nestedGraphView').sockets.socket(json_recv.id).emit('data', response);
 }

if(json_recv.type == 1){
io.of('/nestedGraphView').sockets.socket(json_recv.id).broadcast.emit('data',response);

}
       });

    }
}
