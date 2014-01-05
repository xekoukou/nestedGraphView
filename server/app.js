function Node(id, parentId, level, childrenIds , summary , content , posX, posY)
{

this.id = id;
this.level = level;
this.parentId = parentd;
this.childrenIds = childrenIds;
this.posX = posX;
this.posY = posY;
this.content = '<div class = "nestedGraphNodeContent '+id+'" >' + content + '</div>';
this.summary = '<div class = "nestedGraphNode '+id+'" >' + summary + '</div>';

}


var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

app.listen(8000);

function handler (req, res) {
  fs.readFile(__dirname + '/nestedGraphView/' + req.url,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading ' + req.url);
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.of('/nestedGraphView').on('connection', function (socket) {
  socket.on('request', function (data) {
    socket.emit('data',data);
  });
});
