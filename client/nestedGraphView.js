var host = '127.0.0.1:8000';
var id_connector = 'graphCanvas';
var maxWidth = 1920;
var maxHeight = 1080;

// zoom , the zoom level in centimeters per real centimeter
// level, the level of abstraction or nest


function node(id, parentId, level, childrenIds, summary, content, posX, posY) {

    this.id = id;
    this.level = level;
    this.parentId = parentd;
    this.childrenIds = childrenIds;
    this.posX = Math.floor(posX);
    this.posY = Math.floor(posY);
    this.content = '<div class = "nestedGraphNodeContent ' + id + '" >' + content + '</div>';
    this.summary = '<div class = "nestedGraphNode ' + id + '" >' + summary + '</div>';
    this.arrows = new Object();
}


function Data(view) {
    this.view = view;
    this.nodes = new Object();
    this.socket = io.connect('https://' + host + '/nestedGraphView');


    // passing data to the closure 
    var thiss = this;

    this.updateNode = function(updateRequest) {

        this.socket.emit("update", updateRequest);

    }

    this.getData = function(x, y, level, zoom) {
        this.socket.emit("request", {
            level: level,
            searchArray: [{
                posX: Math.floor(x),
                posY: Math.floor(y),
                crit_pos: 64 - Math.floor(Math.max(Math.log(maxWidth * zoom) / Math.LN2, Math.log(maxHeight * zoom) / Math.LN2))

            }]
        });

    }



    this.socket.on("data", function(data) {

        //data are objects not jsons
        //a hash of nodes

        var ids = new Array();
        var i = 0;
        Object.keys(data).forEach(function(id) {
            //remove if it exists 
            if (id in thiss.nodes) {
                thiss.view.removeNode(id);
            }

            if (data[id] == null) {
                // we have already removed the node
            } else {
                //add arrows property
                data[id].arrows = new Object();
                thiss.nodes[id] = data[id];
                ids[i] = id;
                i++;
            }
        });
        view.hardChangeView(view.cleanUnNodes(ids));

    });

    this.empty = function() {

        Object.keys(this.nodes).forEach(this.view.removeNode(id));

    }
}
//rootId has #
function ArrowCanvas(rootId, nodes) {

    var nodes = nodes;
    var thiss = this;

    var canvas = oCanvas.create({
        canvas: "#canvas",
        background: "#ccc"
    });

    this.changeArrow = function(arrow, x, y, toX, toY) {
        //head length
        var headlen = 10;
        var angle = Math.atan2(toY - y, toX - x);
        arrow[0].start = {
            'x': x,
            'y': y
        };
        arrow[0].end = {
            'x': toX,
            'y': toY
        };
        arrow[1].start = {
            'x': (toX + x) / 2,
            'y': (toY + y) / 2
        };
        arrow[1].end = {
            'x': (toX + x) / 2 - headlen * Math.cos(angle - Math.PI / 6),
            'y': (toY + y) / 2 - headlen * Math.sin(angle - Math.PI / 6)
        };
        arrow[2].start = {
            x: (toX + x) / 2,
            y: (toY + y) / 2
        };
        arrow[2].end = {
            x: (toX + x) / 2 - headlen * Math.cos(angle + Math.PI / 6),
            y: (toY + y) / 2 - headlen * Math.sin(angle + Math.PI / 6)
        };

        return arrow;
    };


    this.createArrow = function(x, y, toX, toY) {
        var arrow = new Array();
        arrow[0] = canvas.display.line({
            start: {
                x: 0,
                y: 0
            },
            end: {
                x: 0,
                y: 0
            },
            stroke: "2px #0aa",
            cap: "round"
        });
        arrow[1] = canvas.display.line({
            start: {
                x: 0,
                y: 0
            },
            end: {
                x: 0,
                y: 0
            },
            stroke: "2px #0aa",
            cap: "round"
        });
        arrow[2] = canvas.display.line({
            start: {
                x: 0,
                y: 0
            },
            end: {
                x: 0,
                y: 0
            },
            stroke: "2px #0aa",
            cap: "round"
        });
        return this.changeArrow(arrow, x, y, toX, toY);
    };

    //internal functions
    // they require redraw to work

    this.drawArrow = function(arrow) {
        canvas.addChild(arrow[0]);
        canvas.addChild(arrow[1]);
        canvas.addChild(arrow[2]);

    };

    this.removeArrow = function(arrow) {
        arrow[0].remove();
        arrow[1].remove();
        arrow[2].remove();

    };

    this.drawArrows = function(changedIds, posX, posY, zoom) {
        for (var i = 0; i < changedIds.length; i++) {
            var origin = nodes[changedIds[i]];
            Object.keys(origin.fNodes).forEach(function(n) {
                if (n in nodes) {
                    //  redraw or draw ?
                    if (n in origin.arrows) {
                        origin.arrows[n] = thiss.changeArrow(origin.arrows[n], (origin.posX - posX) / zoom, (origin.posY - posY) / zoom, (nodes[n].posX - posX) / zoom, (nodes[n].posY - posY) / zoom);
                    } else {
                        origin.arrows[n] = thiss.createArrow((origin.posX - posX) / zoom, (origin.posY - posY) / zoom, (nodes[n].posX - posX) / zoom, (nodes[n].posY - posY) / zoom);
                        thiss.drawArrow(origin.arrows[n]);
                    }

                }

            });

            Object.keys(origin.bNodes).forEach(function(n) {
                if (n in nodes) {
                    //  redraw or draw ?
                    if (origin.id in nodes[n].arrows) {
                        nodes[n].arrows[origin.id] = thiss.changeArrow(nodes[n].arrows[origin.id], (nodes[n].posX - posX) / zoom, (nodes[n].posY - posY) / zoom, (origin.posX - posX) / zoom, (origin.posY - posY) / zoom);

                    } else {
                        nodes[n].arrows[origin.id] = thiss.createArrow((nodes[n].posX - posX) / zoom, (nodes[n].posY - posY) / zoom, (origin.posX - posX) / zoom, (origin.posY - posY) / zoom);
                        thiss.drawArrow(nodes[n].arrows[origin.id]);
                    }

                }

            });


        }
        thiss.redraw();
    };


    this.removeArrows = function(id) {

        var origin = nodes[id];
        Object.keys(origin.fNodes).forEach(function(n) {
            if (n in nodes) {
                if (n in origin.arrows) {
                    thiss.removeArrow(origin.arrows[n]);
                    delete origin.arrows[n];
                }

            }

        });

        Object.keys(origin.bNodes).forEach(function(n) {
            if (n in nodes) {
                if (origin.id in nodes[n].arrows) {
                    thiss.removeArrow(nodes[n].arrows[origin.id]);
                    delete nodes[n].arrows[origin.id];
                }

            }

        });


    };

    this.redraw = function() {
        canvas.redraw();
    }



}


function View(posX, posY, zoom, level, id_connector, width, height) {

    this.posX = Math.floor(posX);
    this.posY = Math.floor(posY);
    this.zoom = zoom;
    this.level = level;
    this.data = new Data(this);

    this.width = width;
    this.height = height;
    this.rootId = "#" + id_connector;


    this.arrowCanvas = new ArrowCanvas(this.rootId, this.data.nodes);

    //for closures
    var thiss = this;


    this.cleanUnNodes = function(ids) {
        var remIds = new Array();

        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var node = this.data.nodes[id];


            var diffX = (node.posX - this.posX) / this.zoom;
            var diffY = (node.posY - this.posY) / this.zoom;
            if (diffX < 0 || diffY < 0 || diffX > this.width || diffY > this.height) {
                this.removeNode[id];

            } else {
                remIds.push(id);
            }
        }
        return remIds;
    }

    //no new data
    this.softChangeView = function(ids) {
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var node = this.data.nodes[id];
            var diffX = node.posX - this.posX;
            var diffY = node.posY - this.posY;
            $('.' + node.id + '.nestedGraphNode').css('top', (diffY / this.zoom).toString() + 'px');
            $('.' + node.id + '.nestedGraphNode').css('left', ((diffX) / this.zoom).toString() + 'px');
            $('.' + node.id + '.nestedGraphNodeContent').css('top', ((diffY + 20) / this.zoom).toString() + 'px');
            $('.' + node.id + '.nestedGraphNodeContent').css('left', (diffX / this.zoom).toString() + 'px');
        }
        //draw Arrows
        this.arrowCanvas.drawArrows(ids, this.posX, this.posY, this.zoom);


    };

    this.hardChangeView = function(changedIds) {

        for (var i = 0; i < changedIds.length; i++) {

            var node = this.data.nodes[changedIds[i]];
            $(this.rootId).append(node.summary);
            $(this.rootId).append(node.content);

            //make things draggable
            $('.' + node.id + '.nestedGraphNode').draggable();
            $('.' + node.id + '.nestedGraphNode').on("drag", function(event, ui) {
                var classN = event.target.className.split(' ', 2)[1];
                thiss.data.nodes[classN].posY = Math.floor(thiss.posY + ui.position.top * thiss.zoom);
                thiss.data.nodes[classN].posX = Math.floor(thiss.posX + ui.position.left * thiss.zoom);

                $('.' + node.id + '.nestedGraphNodeContent').css('top', (ui.position.top + 20).toString() + 'px');
                $('.' + node.id + '.nestedGraphNodeContent').css('left', (ui.position.left).toString() + 'px');

                //draw Arrows
                var ids = new Array();
                ids.push(node.id);
                thiss.arrowCanvas.drawArrows(ids, thiss.posX, thiss.posY, thiss.zoom);
                //TODO create a newPosition json request
                thiss.data.updateNode(node);

            });
        }
        this.softChangeView(changedIds);

    };

    this.removeNode = function(id) {
        this.arrowCanvas.removeArrows(id);
        $('.' + id).remove();
        delete thiss.data.nodes[id];


    };



    //interactions

    //change of point of view
    //
    //disable context menu so as to use right click
    document.oncontextmenu = function() {
        return false;
    };

    $(this.rootId).on('mousedown', function(e) {
        if (e.which == 3) {
            var initX = e.pageX;
            var initY = e.pageY;

            $(thiss.rootId).on('mousemove', function(e) {
                thiss.posX = Math.floor(thiss.posX + ((e.pageX - initX) / 20) * thiss.zoom);
                thiss.posY = Math.floor(thiss.posY + ((e.pageY - initY) / 20) * thiss.zoom);

                thiss.softChangeView(thiss.cleanUnNodes(Object.keys(thiss.data.nodes)));

            });
        }
    });

    $(this.rootId).on('mouseup', function(e) {
        if (e.which == 3) {

            $(thiss.rootId).unbind('mousemove');
            thiss.data.getData(posX, posY, level, zoom);
        }
    });

    $('.nestedGraphNode .nestedGraphNode').dbclick(function(e) {
        //TODO change from wiki output to wiki syntax and focus on form


        //disable keydown actions so that keys are used to insert characters
        $(this.rootId).off('keydown');
    });

    $(this.rootId).on('keyup', function(e) {

        if (event.which == esc) {

            //TODO remove focus from element, turn text into wiki output

            //set keydown actions
            $(this.rootId).on('keydown', function(e) {

                //level change
                if (event.which == 38) {
                    level = level + 1;
                    thiss.data.empty();
                    thiss.data.getData(posX, posY, level, zoom);
                }
                if (event.which == 40) {
                    level = level - 1;
                    thiss.data.empty();
                    thiss.data.getData(posX, posY, level, zoom);
                }

                //TODO add more actions 
                //they should only send data to server
                // the server will have to accept the action and send back a verification
            });

        }

    });

    //pressing esc focuses out of an input and bounds specific events to keys


}

});

//pressing esc focuses out of an input and bounds specific events to keys





//zoom event
$(this.rootId).on('mousewheel', function(e) {
    if ((thiss.zoom + e.deltaY) > 0) {
        thiss.zoom = thiss.zoom * (1 + 0.1 * e.deltaY);
        thiss.softChangeView(thiss.cleanUnNodes(Object.keys(thiss.data.nodes)));
    }
});


//first actions of the View function
this.data.getData(this.x, this.y, this.level, this.zoom);

}

$(window).load(function(e) {
    var view = new View(0, 0, 1, 0, id_connector, maxWidth, maxHeight);

});
