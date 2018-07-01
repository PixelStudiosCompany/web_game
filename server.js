var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var fs=require('fs');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var width = 800;
var height = 600;
var bombw = 40;
var bombh=40;
var mapx = 10;
var mapy = 10;
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));


//CHECKING HERO POSITION

function dot_inside(x,y,kx,ky,w,h){
	var f = false;
	if (x>kx && x<kx+w && y>ky && y<ky+h){
		f=true;
	}
	return f;
}
function check_hero(map,x,y,w,h){
	var f = true;
	for (var i=0;i<map.length;i++){
		for (var j=0;j<map[0].length;j++){
			if (map[i][j]=='0'){
				if (dot_inside(x,y,i*w,j*h,w,h) || dot_inside(x+bombw,y,i*w,j*h,w,h) || dot_inside(x,y+bombh,i*w,j*h,w,h) || dot_inside(x+bombw,y+bombh,i*w,j*h,w,h)){
					f=false;
				}
			}
		}
	}
	return f;
}

//----------------------

//MAP CREATION

var map = Array(mapx);
for(var i=0;i<=mapx;i++){
	map[i]= new Array(mapy);
}

var s = fs.readFileSync('file.txt').toString();
for(var i=0;i<s.length;i++) {
    console.log(s[i]);
}
var t=0;
for (var i=0;i<mapx;i++){
	for(var j=0; j <= mapy; j++){
		if (s[t]=='\n') t++;
		if (s[t]=='\r') t++;
		map[j][i]=s[t];
		console.log(map[j][i]);
		t++;
	}
}
console.log(map);

//-------------



// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function(a) {
    players[socket.id] = {
      x: 300,
      y: 300,
	  ox: 300,
	  oy: 300,
	  name: a
    };
  });
  socket.on('movement', function(data) {
	   var w = width/map.length;
  var h=height/map[0].length;
    var player = players[socket.id] || {};
    if (data.left && player.x>0) {
      player.ox=player.x;
	  player.x -= 5;
    }
    if (data.up && player.y>0) {
		player.oy = player.y;
      player.y -= 5;
    }
    if (data.right && player.x+bombw<width) {
		player.ox=player.x;
      player.x += 5;
    }
    if (data.down && player.y+bombh<height) {
		player.oy=player.y;
      player.y += 5;
    }
	if (!check_hero(map,player.x,player.y,w,h)){
	    player.x=player.ox;
        player.y=player.oy;		
	}
  });
  
   socket.on('disconnect', function() {
    delete players[socket.id];
  });
});

setInterval(function() {
  io.sockets.emit('state', players,map);
}, 1000 / 60);