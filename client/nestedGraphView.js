var host = '127.0.0.1:8000';
var id_connector = 'graphCanvas';

// zoom , the zoom level in centimeters per real centimeter
// level, the level of abstraction or nest


function node(id, parentId, level, childrenIds, summary, content, posX, posY) {

    this.id = id;
    this.level = level;
    this.parentId = parentd;
    this.childrenIds = childrenIds;
    this.posX = posX;
    this.posY = posY;
    this.content = '<div class = "nestedGraphNodeContent ' + id + '" >' + content + '</div>';
    this.summary = '<div class = "nestedGraphNode ' + id + '" >' + summary + '</div>';
    this.arrows = new Array();
}


function Data(view) {
    this.view = view;
    this.nodes = new Object();
    this.socket = io.connect('https://' + host + '/nestedGraphView');


    // passing data to the closure 
    var thiss = this;

    this.updateNode = function(node) {

        this.socket.emit("update", node);

    }

    this.getData = function(x, y, level, zoom) {
        this.socket.emit("request", {
            posX: x,
            posY: y,
            level: level,
            zoom: zoom
        });

    }



    this.socket.on("data", function(data) {

        //data are objects not jsons
        //a hash of nodes

        var ids = new Array();
        var i = 0;
        Object.keys(data).forEach(function(id) {
            if (data[id] == null) {
                if (id in nodes) {
                    thiss.view.removeNode(id);
                }
            } else {
                thiss.nodes[id] = data[id];
                ids[i] = id;
                i++;
            }
        });
        view.hardChangeView(ids);

    });


}
//rootId has #
function ArrowCanvas(rootId, nodes) {

    var nodes = nodes;
    var thiss = this;

    //creating the canvas element
    $(rootId).append('<canvas id = "canvas"></canvas>');
    var canvas = oCanvas.create({
        canvas: "#canvas",
        background: "#ccc"
    });


    this.drawArrow = function(x, y, toX, toY) {
        //head length
        var headlen = 10;
        var arrow = new Object();
        arrow[0] = canvas.display.line({
            start: {
                x: x,
                y: y
            },
            end: {
                x: toX,
                y: toY
            }
        });

        arrow[1] = canvas.display.line({
            start: {
                x: toX,
                y: toY
            },
            end: {
                x: toX - headlen * Math.cos(angle - Math.PI / 6),
                y: toY - headlen * Math.cos(angle - Math.PI / 6)
            }
        });

        arrow[2] = canvas.display.line({
            start: {
                x: x,
                y: y
            },
            end: {
                x: toX - headlen * Math.cos(angle + Math.PI / 6),
                y: toY - headlen * Math.cos(angle + Math.PI / 6)
            }
        });
        return arrow;
    }

    this.drawArrows = function(changedIds) {

        for (var i = 0; i < changedIds.length; i++) {
            var origin = nodes[changedIds[i]];
            Object.keys(origin.fNodes).forEach(function(n) {
                if (n in nodes) {
                    //  redraw or draw ?
                    //  TODO for now we just destroy the arrow
                    if (n in origin.arrows) {
                        canvas.removeChild(origin.arrows[n]);
                        origin.arrows[n] = thiss.drawArrow(origin.posX, origin.posY, nodes[n].posX, nodes[n].posY);
                        canvas.addChild(origin.arrows[n]);
                    } else {
                        origin.arrows[n] = thiss.drawArrow(origin.posX, origin.posY, nodes[n].posX, nodes[n].posY);
                        canvas.addChild(origin.arrows[n]);
                    }

                }

            });

            Object.keys(origin.bNodes).forEach(function(n) {
                if (n in nodes) {
                    //  redraw or draw ?
                    //  TODO for now we just destroy the arrow
                    if (origin.id in nodes[n].arrows) {
                        canvas.removeChild(nodes[n].arrows[origin.id]);
                        nodes[n].arrows[origin.id] = thiss.drawArrow(nodes[n].posX, nodes[n].posY, origin.posX, origin.posY);
                        canvas.addChild(nodes[n].arrows[origin.id]);
                    } else {
                        nodes[n].arrows[origin.id] = thiss.drawArrow(nodes[n].posX, nodes[n].posY, origin.posX, origin.posY);
                        canvas.addChild(nodes[n].arrows[origin.id]);
                    }

                }

            });


        }

    };


    this.removeArrows = function(id) {
        Object.keys(origin.fNodes).forEach(function(n) {
            if (n in nodes) {
                if (n in origin.arrows) {
                    canvas.removeChild(origin.arrows[n]);
                    delete origin.arrows[n];
                }

            }

        });

        Object.keys(origin.bNodes).forEach(function(n) {
            if (n in nodes) {
                if (origin.id in nodes[n].arrows) {
                    canvas.removeChild(nodes[n].arrows[origin.id]);
                    delete nodes[n].arrows[origin.id];
                }

            }

        });


    };


}


function View(posX, posY, zoom, level, id_connector, width, height) {

    this.posX = posX;
    this.posY = posY;
    this.zoom = zoom;
    this.level = level;
    this.data = new Data(this);

    this.width = width;
    this.height = height;
    this.rootId = "#" + id_connector;

    this.arrowCanvas = new ArrowCanvas(this.rootId, this.data.nodes);



    this.setCanvasSize = function(width, height) {

        this.width = width;
        this.height = height;
        $(this.rootId).css('width', this.width);
        $(this.rootId).css('height', this.height);

        $('#canvas').css('width', this.width);
        $('#canvas').css('height', this.height);
    };

    this.setCanvasSize(this.width, this.height);


    //for closures
    var thiss = this;

    //no new data
    this.softChangeView = function() {

        Object.keys(this.data.nodes).forEach(function(id) {
            var node = thiss.data.nodes[id];


            console.log('Inside softChange');
            console.log(thiss.posX);
            console.log(thiss.posY);

            var diffX = node.posX - thiss.posX;
            var diffY = node.posY - thiss.posY;
            console.log(diffX);
            console.log(diffY);
            if (diffX < 0 || diffY < 0 || diffX > thiss.width || diffY > thiss.height) {
                delete thiss.removeNode[id];

            } else {
                $('.' + node.id + '.nestedGraphNode').css('top', (diffY / zoom).toString() + 'px');
                $('.' + node.id + '.nestedGraphNode').css('left', ((diffX) / zoom).toString() + 'px');
                $('.' + node.id + '.nestedGraphNodeContent').css('top', ((diffY + 20) / zoom).toString() + 'px');
                $('.' + node.id + '.nestedGraphNodeContent').css('left', (diffX / zoom).toString() + 'px');
            }
        });
    };

    this.hardChangeView = function(changedIds) {
        console.log('Inside hardChange');

        for (var i = 0; i < changedIds.length; i++) {

            var node = this.data.nodes[changedIds[i]];
            console.log('changedids:' + changedIds);
            $('.' + node.id).remove();
            $(this.rootId).append(node.summary);
            $(this.rootId).append(node.content);

            //make things draggable
            $('.' + node.id + '.nestedGraphNode').draggable();
            $('.' + node.id + '.nestedGraphNode').on("dragstop", function(event, ui) {
                node.posY = thiss.posY * zoom + ui.position.top;
                node.posX = thiss.posX * zoom + ui.position.left;

                $('.' + node.id + '.nestedGraphNodeContent').css('top', (ui.position.top + 20).toString() + 'px');
                $('.' + node.id + '.nestedGraphNodeContent').css('left', (ui.position.left).toString() + 'px');


                thiss.data.updateNode(node);

            });
        }
        this.softChangeView();

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
            console.log('i was here' + ' ' + 'mousedown');
            var initX = e.pageX;
            var initY = e.pageY;

            $(thiss.rootId).on('mousemove', function(e) {
                console.log('i was here' + ' ' + 'mousemove');
                //change the position of the nodes
                console.log(e.pageX);
                console.log(e.pageY);
                thiss.posX = thiss.posX + ((e.pageX - initX) / 20) * thiss.zoom;
                thiss.posY = thiss.posY + ((e.pageY - initY) / 20) * thiss.zoom;

                thiss.softChangeView();

            });
        }
    });

    $(this.rootId).on('mouseup', function(e) {
        if (e.which == 3) {
            console.log('i was here' + ' ' + 'mouseup');

            $(thiss.rootId).unbind('mousemove');
            thiss.data.getData(posX, posY, level, zoom);
        }
    });

    //level change
    $(this.rootId).on('keyup', function(e) {
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

    });


    //zoom event
    $(this.rootId).on('mousewheel', function(e) {
        if ((thiss.zoom + e.deltaY) > 0) {
            thiss.zoom = thiss.zoom + e.deltaY;
            console.log('zoom level:' + thiss.zoom);
            thiss.softChangeView();
        }
    });


    //first actions of the View function
    this.data.getData(this.x, this.y, this.level, this.zoom);

}

$(window).load(function(e) {
    var view = new View(0, 0, 1, 0, id_connector, $(window).width(), $(window).height());
    $(window).on('resize', function(e) {
        view.setCanvasSize($(window).width(), $(window).height());
    });
});
