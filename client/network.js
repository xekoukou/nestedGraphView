function Data(view) {
    this.view = view;
    this.nodes = new Object();
    this.socket = io.connect('https://' + window.location.host + '/nestedGraphView');

    this.clientRequestId = 0;

    // passing data to the closure 
    var thiss = this;

    this.requestData = function(x, y, zoom) {
        this.socket.emit("request", {
            clientRequestId: thiss.clientRequestId,
            request: {
                type: "searchRequest",
                searchArray: [{
                    posX: Math.floor(x),
                    posY: Math.floor(y),
                    crit_pos: 63 - Math.floor(Math.max(Math.log(maxWidth / zoom) / Math.LN2, Math.log(maxHeight / zoom) / Math.LN2)) - 2

                }]
            }
        });
        thiss.clientRequestId++;
    }


    this.postNewNode = function(x, y, node) {

        this.socket.emit("request", {
            clientRequestId: thiss.clientRequestId,
            request: {
                type: "newNode",
                node: {
                    posX: x,
                    posY: y,
                    node: node
                }
            }
        });
        console.log("request transmitted");
        thiss.clientRequestId++;

    }

    this.updatePosition = function(posX, posY, id) {

    }

    this.socket.on("newData", function(data) {
        console.log("newData:" + JSON.stringify(data));

        var ids = new Array();

        var newNodes = data.newNodes;

        for (i = 0; i < newNodes.length; i++) {
            var node = newNodes[i];
            var id = node.id;
            //remove if it exists 
            if (id in thiss.nodes) {
                thiss.view.removeNode(id);
            }
            //add arrows property
            node.arrows = new Object();
            thiss.nodes[id] = node;
            ids[i] = id;

        }

        var deletedNodes = data.deletedNodes;

        for (i = 0; i < deletedNodes.length; i++) {
            var node = deletedNodes[i];
            var id = node.id;
            //remove if it exists 
            if (id in thiss.nodes) {
                thiss.view.removeNode(id);
            }

        }
        view.hardChangeView(view.cleanUnNodes(ids));

    });

    this.socket.on("response", function(data) {
        console.log("response:" + JSON.stringify(data));

        //TODO do something with the id
        var clientRequestId = data.clientRequestId;

        if (data.response.type == "searchResponse") {

            // delete everything
            Object.keys(thiss.nodes).forEach(function(id) {
                thiss.view.removeNode(id);

            });


            var nodeArray = data.response.nodeArray;


            var ids = new Array();



            for (i = 0; i < nodeArray.length; i++) {
                var node = nodeArray[i];
                var id = node.id;
                //remove if it exists 
                if (id in thiss.nodes) {
                    thiss.view.removeNode(id);
                }
                //add arrows property
                node.arrows = new Object();
                thiss.nodes[id] = node;
                ids[i] = id;

            }

            view.hardChangeView(view.cleanUnNodes(ids));
        } else {
            //TODO handle the remaining cases
            // there are no other cases at the moment

        }
    });




    this.empty = function() {

        Object.keys(this.nodes).forEach(this.view.removeNode(id));

    }
}
