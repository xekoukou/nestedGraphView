var id_connector = 'graphCanvas';
var maxWidth = 1920;
var maxHeight = 1080;

var divNode = function(id, content) {

    return "<div class='" + id + " nestedGraphNode'>" + content + "</div>";

}

// zoom , the zoom level in centimeters per real centimeter



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
                var origin = nodes[changedIds[i]].node;
                var j;
                for (j = 0; j < origin.output.length; j++) {
                    var link = origin[j];
                    var n = link.endId;
                    if (n in nodes) {
                        //  redraw or draw ?
                        if (n in origin.arrows) {
                            origin.arrows[n] = thiss.changeArrow(origin.arrows[n], (origin.posX - posX) * zoom, (origin.posY - posY) * zoom, (nodes[n].posX - posX) * zoom, (nodes[n].posY - posY) * zoom);
                        } else {
                            origin.arrows[n] = thiss.createArrow((origin.posX - posX) * zoom, (origin.posY - posY) * zoom, (nodes[n].posX - posX) * zoom, (nodes[n].posY - posY) * zoom);
                            thiss.drawArrow(origin.arrows[n]);
                        }

                    }

                };
                for (j = 0; j < origin.input.length; j++) {
                    var link = origin[i];
                    var n = link.origId;
                    if (n in nodes) {
                        //  redraw or draw ?
                        if (origin.id in nodes[n].arrows) {
                            nodes[n].arrows[origin.id] = thiss.changeArrow(nodes[n].arrows[origin.id], (nodes[n].posX - posX) * zoom, (nodes[n].posY - posY) * zoom, (origin.posX - posX) * zoom, (origin.posY - posY) * zoom);

                        } else {
                            nodes[n].arrows[origin.id] = thiss.createArrow((nodes[n].posX - posX) * zoom, (nodes[n].posY - posY) * zoom, (origin.posX - posX) * zoom, (origin.posY - posY) * zoom);
                            thiss.drawArrow(nodes[n].arrows[origin.id]);
                        }

                    }

                };


            }
            thiss.redraw();
        };


        this.removeArrows = function(id) {

            var origin = nodes[id].node;
            Object.keys(origin.output).forEach(function(n) {
                if (n in nodes) {
                    if (n in origin.arrows) {
                        thiss.removeArrow(origin.arrows[n]);
                        delete origin.arrows[n];
                    }

                }

            });

            Object.keys(origin.input).forEach(function(n) {
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


    function View(posX, posY, zoom, id_connector, width, height) {

        this.posX = Math.floor(posX);
        this.posY = Math.floor(posY);
        this.zoom = zoom;
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


                var diffX = (node.posX - this.posX) * this.zoom;
                var diffY = (node.posY - this.posY) * this.zoom;
                if (diffX < 0 || diffY < 0 || diffX > this.width || diffY > this.height) {
                    this.removeNode(id);

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
                $('.' + node.id + '.nestedGraphNode').css('top', (diffY * this.zoom).toString() + 'px');
                $('.' + node.id + '.nestedGraphNode').css('left', ((diffX) * this.zoom).toString() + 'px');
            }
            //draw Arrows
            this.arrowCanvas.drawArrows(ids, this.posX, this.posY, this.zoom);


        };

        this.hardChangeView = function(changedIds) {

            for (var i = 0; i < changedIds.length; i++) {

                var node = this.data.nodes[changedIds[i]];
                $(this.rootId).append(divNode(node.id, node.node.nodeData.summary));

                //make things draggable
                $('.' + node.id + '.nestedGraphNode').draggable();
                $('.' + node.id + '.nestedGraphNode').on("drag", function(event, ui) {
                    var id = parseInt(event.target.className.split(' ', 2)[0]);
                    thiss.data.nodes[id].posY = Math.floor(thiss.posY + ui.position.top / thiss.zoom);
                    thiss.data.nodes[id].posX = Math.floor(thiss.posX + ui.position.left / thiss.zoom);

                    //draw Arrows
                    var ids = new Array();
                    ids.push(node.id);
                    thiss.arrowCanvas.drawArrows(ids, thiss.posX, thiss.posY, thiss.zoom);

                });
                $('.' + node.id + '.nestedGraphNode').on("dragstop", function(event, ui) {
                    var id = parseInt(event.target.className.split(' ', 2)[0]);
                    thiss.data.updatePosition(thiss.data.nodes[id].posX, thiss.data.nodes[id].posY, id);

                });
            }

            this.softChangeView(changedIds);

        };

        this.removeNode = function(id) {
            this.arrowCanvas.removeArrows(id);
            $('.' + id + '.nestedGraphNode').remove();
            delete thiss.data.nodes[id];


        };

        //load the interactions
        interactions(this);

        //first actions of the View function
        this.data.requestData(this.posX, this.posY, this.zoom);

    }

    //global context of view
var view;
$(window).load(function(e) {
    view = new View(0, 0, 1, id_connector, maxWidth, maxHeight);

});
