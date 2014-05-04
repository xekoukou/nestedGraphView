    var interactions = function(view) {

        var parentId = 0;
        var prevNode = null;
        var escKey = 27;
        var iKey = 73;
        var cKey = 67;
        var mouseX;
        var mouseY;


        // these var should have been local
        var initX;
        var initY;

        //tracking the mouse 
        var mouseTracking = function(e) {
            mouseX = e.pageX;
            mouseY = e.pageY;
        };

        var moveSpace = function(e) {

            mouseX = e.pageX;
            mouseY = e.pageY;
            var nposX = Math.floor(view.posX + ((-e.pageX + initX) / 20) / view.zoom);
            var nposY = Math.floor(view.posY + ((-e.pageY + initY) / 20) / view.zoom);
            if (nposX >= 0) {
                view.posX = nposX;
            }
            if (nposY >= 0) {
                view.posY = nposY;
            }

            var changedIds = Object.keys(view.data.nodes);
            view.softChangeView(view.cleanUnNodes(changedIds));

        };

        $(window).on('mousemove', mouseTracking);


        //disable context menu so as to use right click
        document.oncontextmenu = function() {
            return false;
        };

        // right clicking moves the map
        $(window).on('mousedown', function(e) {
            if (e.which == 3) {
                initX = e.pageX;
                initY = e.pageY;

                $(window).off('mousemove', mouseTracking);
                $(window).on('mousemove', moveSpace);

            }
        });

        $(window).on('mouseup', function(e) {
            if (e.which == 3) {

                $(window).off('mousemove', moveSpace);
                $(window).on('mousemove', mouseTracking);
                view.data.requestData(view.posX, view.posY, view.zoom);
            }
        });


        //zoom event
        $(window).on('mousewheel', function(e) {
            var oldzoom = view.zoom;
            var nzoom = view.zoom * (1 + 0.1 * e.deltaY);
            var nposX = Math.floor(view.posX + (view.width / 2) * ((1 / oldzoom) - (1 / nzoom)));
            var nposY = Math.floor(view.posY + (view.height / 2) * ((1 / oldzoom) - (1 / nzoom)));
            if ((nzoom > 0) && (nposY >= 0) && (nposX >= 0)) {
                view.zoom = nzoom;
                view.posX = nposX;
                view.posY = nposY;
                var changedIds = Object.keys(view.data.nodes);
                view.softChangeView(view.cleanUnNodes(changedIds));
            }
        });


        //Esc and i are used to allow or disallow keydown actions


        var escUp = function(view) {
            $(window).on('keyup', function(e) {
                if (e.which == escKey) {

                    $(window).off('keyup');

                    commandsUp(view);
                }
            });

        };

        var commandsUp = function(view) {
            $(window).on('keydown', function(event) {

                if (event.which == iKey) {

                    $(window).off('keydown');
                    escUp(view);
                };

                if (event.which == escKey) {
                    $('div#commands').css('visibility', function(i, visibility) {
                        return (visibility == 'visible') ? 'hidden' : 'visible';
                    });
                };


                if (event.which == cKey) {
                    var node = new Object();
                    node.parentId = parentId;
                    var posY = Math.floor(view.posY + mouseY / view.zoom);
                    var posX = Math.floor(view.posX + mouseX / view.zoom);
                    //TODO temporary
                    node.nodeData = new Object();
                    node.input = new Array();
                    node.output = new Array();
                    node.id = -1;
                    node.nodeData.summary = 'summary';
                    node.nodeData.content = 'content';
                    view.data.postNewNode(posX, posY, node);
                };


                //TODO add more actions 
                //they should only send data to server
                // the server will have to accept the action and send back a verification
            });


        };

        escUp(view);








    }