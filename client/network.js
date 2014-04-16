function Data(view) {
    this.view = view;
    this.nodes = new Object();
    this.socket = io.connect('https://' + host + '/nestedGraphView');

    this.clientRequestId = 0;

    // passing data to the closure 
    var thiss = this;

    this.requestData = function(x, y, zoom) {
        this.socket.emit("request", {
            clientRequestId: thiss.clientRequestId,
            request: {
                type: "SearchRequest",
                searchArray: [{
                    posX: Math.floor(x),
                    posY: Math.floor(y),
                    crit_pos: 64 - Math.floor(Math.max(Math.log(maxWidth * zoom) / Math.LN2, Math.log(maxHeight * zoom) / Math.LN2))

                }]
            }
        });
        thiss.clientRequestId++;
    }

    this.socket.on("newData", function(data) {

        var ids = new Array();

        var nuNodes = data.nuNodes;

        for (i = 0; i < nuNodes.length, i++) {
            var node = nuNodes.indeof(i);
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

        for (i = 0; i < deletedNodes.length, i++) {
            var node = deletedNodes.indeof(i);
            var id = node.id;
            //remove if it exists 
            if (id in thiss.nodes) {
                thiss.view.removeNode(id);
            }

        }
        view.hardChangeView(view.cleanUnNodes(ids));

    });

    this.socket.on("response", function(data) {

      


        var ids = new Array();

        var nuNodes = data.nuNodes;

        for (i = 0; i < nuNodes.length, i++) {
            var node = nuNodes.indeof(i);
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

        for (i = 0; i < deletedNodes.length, i++) {
            var node = deletedNodes.indeof(i);
            var id = node.id;
            //remove if it exists 
            if (id in thiss.nodes) {
                thiss.view.removeNode(id);
            }

        }
        view.hardChangeView(view.cleanUnNodes(ids));

    });




    this.empty = function() {

        Object.keys(this.nodes).forEach(this.view.removeNode(id));

    }
}
