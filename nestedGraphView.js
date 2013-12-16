// zoom , the zoom level in centimeters per real centimeter
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
this.nodes = {};
this.socket = io.connect("htttp://localhost:8000/nestedGraphView");


this.getData = function(x,y,level,zoom){
this.socket.emit("request", {posX:x , posY:y , level:level , zoom:zoom});

}

this.socket.on("data", function(data){
//data are objects not jsons
//a hash of nodes

ids = {};

Object.keys(data).forEach(function(id){
if(data[id]==null){
delete this.nodes[id];
}
else{
this.nodes[id]=data[id];
ids[i] = data[id];
}
});

view.hardChangeView(ids);

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

Object.keys(this.data.nodes).forEach(function(id){
var node = this.data.nodes[id];

diffX = node.posX -this.posX;
diffY = node.posY -this.posY;

if(diffX < 0 || diffY < 0 || diffX > this.width || diffY > this.height){

delete this.data.nodes[id];

} else {
$('.'+node.id+'.nestedGraphNode').css('top',(diffY/zoom).toString()+'px');
$('.'+node.id+'.nestedGraphNode').css('left',((diffX)/zoom).toString()+'px');
$('.'+node.id+'.nestedGraphNodeContent').css('top',((diffY +20)/zoom).toString()+'px');
$('.'+node.id+'.nestedGraphNodeContent').css('left',(diffX/zoom).toString()+'px');
}
});

}

this.hardChangeView = function(changedIds){


for(var i = 0; i < changedIds.length, i++;){

node = this.data.nodes[changedIds[i]];
$('.'+node.id).remove();

$(rootId).append(node.summary);
$(rootId).append(node.Content);

//make things draggable

$('.'+node.id+'.nestedGraphNode').draggable();
$('.'+node.id+'.nestedGraphNode').on("dragstop",function(event,ui){
node.posY = this.posY + ui.position.top;
node.posX = this.posX + ui.position.left;

this.data.updateNode(node);

});

}

this.softChangeView();

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
this.data.getData(posX,posY, level,zoom);
});

//level change
$(this.rootId).on('keyup', function(e){
if(event.which == 38 ){
level = level + 1;
this.data.empty();
this.data.getData(posX,posY, level,zoom);
}
if(event.which == 40 ){
level = level - 1;
this.data.empty();
this.data.getData(posX,posY, level,zoom);
}

});


//zoom event
$(this.rootId).on('mousewheel',function(e){

this.zoom = this.zoom + e.deltaY;
this.softChangeView();

}
);
}
