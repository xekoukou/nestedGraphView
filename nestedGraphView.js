//zoom , the zoom level in centimeters per real centimeter
// level, the level of abstraction or nest

// window.onLoad(alert("lol");

function node(id, parentId, level, childrenIds , summary , content , posX, posY){

this.id = id;
this.parentId = parentd;
this.childrenIds = childrenIds;
this.posX = posX; 
this.posY = posY;
this.content = '<div class = "nestedGraphNodeContent '+id+'" >' + content + '</div>';
this.summary = '<div class = "nestedGraphNode '+id+'" >' + summary + '</div>';

}

function data(){

this.nodes;

this.getdiff = function(x,newX,y,newY, level){

};

this.getLevel = function(x,y,level){

}

}

function View(posX,posY,zoom,level,id_connector,width,height){

this.zoom = zoom;
this.level = level;
this.data = new data();


this.width =width;
this.height = height;
this.rootId = "#"+id_connector;

this.render = function(){

(rootId).empty();

for(i = 0; i++; i < this.data.nodes.length){

var node = this.data.nodes[i];
$(rootId).append(node.summary);
$(rootId).append(node.Content);
$('.'+node.id+'.nestedGraphNode').css('bottom',((node.posY - this.posY)/zoom).toString()+'px');
$('.'+node.id+'.nestedGrapgNode').css('left',((node.posX - this.posX)/zoom).toString()+'px');
$('.'+node.id+'.nestedGraphNodeContent').css('bottom',((node.posY -this.posY +20)/zoom).toString()+'px');
$('.'+node.id+'.nestedGrapgNodeContent').css('left',((node.posX - this.posX)/zoom).toString()+'px');

}

};

this.onZoomChange = function(zoom){
this.zoom = zoom;
this.render();
}

this.onLevelChange = function(level){
this.level = level;
this.data.getLevel(posX,posY, level);

this.render();
};


this.posX = posX;
this.posY = posY;

this.onLeftKey = funcion(){
this.data.getDiff(posX,posX-zooom,posY,posY, level);
posX = posX-zoom;

this.render();
};

this.onRightKey = funcion(){
getData(posX,posX+zooom,posY,posY, level);
posX = posX + zoom;

this.render();
};

this.onDownKey = funcion(){
getData(posX,posX,posY,posY-zoom, level);
posY = posY - zoom;

this.render();
};

this.onUpKey = function(){
getData(posX,posX,posY,posY + zoom, level);
posY = posY + zoom;

this.render();
};

}
