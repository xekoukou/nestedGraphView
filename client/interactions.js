    var interactions = function(view) {
    
    var parentId = null;
    var prevNode = null;
    var escKey = 27;
    var iKey = 73;
    var cKey = 67;
    var mouseX;
    var mouseY;

//tracking the mouse 
     var mouseTracking = function(){      
     $(window).on('mousemove', function(e) {
                    mouseX = e.pageX;
                    mouseY = e.pageY;
                });
};

mouseTracking(mouseX,mouseY);

        //disable context menu so as to use right click
        document.oncontextmenu = function() {
            return false;
        };

        // right clicking moves the map
        $(window).on('mousedown', function(e) {
            if (e.which == 3) {
                var initX = e.pageX;
                var initY = e.pageY;

                $(window).unbind('mousemove');
                $(window).on('mousemove', function(e) {
                    mouseX = e.pageX;
                    mouseY = e.pageY;
                    view.posX = Math.floor(view.posX + ((e.pageX - initX) / 20) * view.zoom);
                    view.posY = Math.floor(view.posY + ((e.pageY - initY) / 20) * view.zoom);

                    view.softChangeView(view.cleanUnNodes(Object.keys(view.data.nodes)));

                });
            }
        });

        $(window).on('mouseup', function(e) {
            if (e.which == 3) {

                $(window).unbind('mousemove');
                mouseTracking(mouseX,mouseY);
                view.data.requestData(view.posX, view.posY, view.zoom);
            }
        });


        //zoom event
        $(window).on('mousewheel', function(e) {
            if ((view.zoom + e.deltaY) > 0) {
                view.zoom = view.zoom * (1 + 0.1 * e.deltaY);
                view.softChangeView(view.cleanUnNodes(Object.keys(view.data.nodes)));
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
                        var posY = Math.floor(view.posY + mouseY * view.zoom);
                        var posX = Math.floor(view.posX + mouseX * view.zoom);
//TODO temporary
node.nodeData = new Object();
node.nodeData.summary = 'new Node';
              view.data.postNewNode(posX,posY,node); 
};


                //TODO add more actions 
                //they should only send data to server
                // the server will have to accept the action and send back a verification
            });


        };

        escUp(view);








    }
