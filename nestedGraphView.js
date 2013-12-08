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

function data(){

this.nodes;

this.getData = function(x,y,level,zoom){

}

}

function View(posX,posY,zoom,level,id_connector,width,height){

this.zoom = zoom;
this.level = level;
this.data = new data();


this.width = width;
this.height = height;
this.rootId = "#"+id_connector;

this.render = function(){

(rootId).empty();

for(i = 0; i++; i < this.data.nodes.length){

var node = this.data.nodes[i];
$(rootId).append(node.summary);
$(rootId).append(node.Content);
$('.'+node.id+'.nestedGraphNode').css('top',((node.posY - this.posY)/zoom).toString()+'px');
$('.'+node.id+'.nestedGraphNode').css('left',((node.posX - this.posX)/zoom).toString()+'px');
$('.'+node.id+'.nestedGraphNodeContent').css('top',((node.posY -this.posY +20)/zoom).toString()+'px');
$('.'+node.id+'.nestedGraphNodeContent').css('left',((node.posX - this.posX)/zoom).toString()+'px');

//make things draggable

$('.'+node.id+'.nestedGraphNode').draggable();
$('.'+node.id+'.nestedGraphNode').on("dragstop",function(event,ui){
//update the server info
});

}

};

this.onChangedZoom = function(diff){
//this happens after the zoom event stops
this.zoom = this.zoom * (1+(diff/100));
this.data.getData(posX,posY, level,zoom);
this.render();
}


this.onIncreasedLevel = function(){
this.level = level+1;
this.data.getData(posX,posY, level,zoom);

this.render();
};

this.onDecreasedLevel = function(){
this.level = level - 1;
this.data.getData(posX,posY,level, zoom);
}


this.posX = posX;
this.posY = posY;

this.onLeftKey = funcion(){

posX = posX-zoom;
this.data.getData(posX,posY, level,zoom);
this.render();

};

this.onRightKey = funcion(){

posX = posX + zoom;
this.data.getData(posX,posY, level,zoom);

this.render();
};

this.onDownKey = funcion(){

posY = posY + zoom;
this.data.getData(posX,posY, level,zoom);
this.render();
};

this.onUpKey = function(){
posY = posY - zoom;
this.data.getData(posX,posY, level,zoom);

this.render();
};

}
