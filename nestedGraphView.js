//zoom , the zoom level in centimeters per real centimeter
// level, the level of abstraction or nest

// window.onLoad(alert("lol");

function node(id, parentId, level, childrenIds , summary , content , posX, posY){

this.id = id;
this.level = level;
this.parentId = parentd;
this.childrenIds = childrenIds;
this.posX = posX; 
this.posY = posY;
this.content = '<div class = "nestedGraphNodeContent '+id+'" >' + content + '</div>';
this.summary = '<div class = "nestedGraphNode '+id+'" >' + summary + '</div>';

}


function Data(view){

this.view = view;
this.nodes = new Object();
this.socket = io.connect("htttp://localhost:8000/nestedGraphView");


this.socket.on('changes', function (data) {
//  array with the changed nodes
for(var i = 0; i < data.length(); i++){

this.nodes[data[i].id]=data[i];

}

view.render();

});

this.getData = function(x,y,level,zoom){
this.socket.emit("request", {posX:x , posY:y , level:level , zoom:zoom});

}

this.socket.on("data", function(data){
//data are objects not jsons
//an aray of nodes

for(var i = 0; i < data.length(); i++){

this.nodes[data[i].id]=data[i];

view.render();
}



});


this.updateNode(node){

this.socket.emit("update", node);

}

}

function View(posX,posY,zoom,level,id_connector,width,height){

this.posX = posX;
this.posY = posY;
this.zoom = zoom;
this.level = level;
this.data = new data();


this.width = width;
this.height = height;
this.rootId = "#"+id_connector;

//no new data
this.softChangeView = function(){

//TODO find correct iterate method

for(var i = 0;  i < this.data.nodes.length; i++){
$('.'+node.id+'.nestedGraphNode').css('top',((node.posY - this.posY)/zoom).toString()+'px');
$('.'+node.id+'.nestedGraphNode').css('left',((node.posX - this.posX)/zoom).toString()+'px');
$('.'+node.id+'.nestedGraphNodeContent').css('top',((node.posY -this.posY +20)/zoom).toString()+'px');
$('.'+node.id+'.nestedGraphNodeContent').css('left',((node.posX - this.posX)/zoom).toString()+'px');
}

}

this.hardChangeView = function(){

(rootId).empty();

//TODO find correct iterate method
for(var i = 0;  i < this.data.nodes.length; i++){

var node = this.data.nodes[i];
$(rootId).append(node.summary);
$(rootId).append(node.Content);

//make things draggable

$('.'+node.id+'.nestedGraphNode').draggable();
$('.'+node.id+'.nestedGraphNode').on("dragstop",function(event,ui){
//TODO update the server info plus the posX, posY of the node
});

}

this.softChangeView();

};


this.onChangedLevel = function(){
this.data.getData(posX,posY, level,zoom);
this.hardChangeView();
};


//interactions

//change of point of view
$(this.rootId).on('mousedown', function(e){
$(this.rootId).om('mousemove',function(e){
//change the position of the nodes
this.posX = e.pageX;
this.posY = e.pageY;

this.softChangeView();

});
});

$(this.rootId).on('mouseup', function(e){

$(this.rootId).unbind('mousemove');
this.render();
});

//level change
$(this.rootId).on('keyup', function(e){
if(event.which == 38 ){
level = level + 1;
this.onChangedLevel();
}
if(event.which == 40 ){
level = level - 1;
this.onChangedLevel();
}

});


//zoom event
$(this.rootId).on('mousewheel',function(e){

this.zoom = this.zoom + e.deltaY;
this.hardChangeView();

}
);
}
