var socket = io();
var width = 800;
var height = 600;
var bombw = 40;
var bombh=40;
var backimg = new Image(width/20,height/20);
  backimg.src="/static/sand.jpg";
var bomber_img= new  Image(bombw,bombh);
bomber_img.src = "/static/bomber.png";
var wall_img = new Image(500,500);
wall_img.src="/static/wall.jpg";
var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}

/*function dot_inside(x,y,kx,ky,w,h){
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
}*/

document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});
var a = prompt("enter your name: ");
socket.emit('new player',a);
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
var cFont = context.font;
socket.on('state', function(players,map) {
  console.log(players);
  context.clearRect(0, 0, width, height);
  
  var ptrn= context.createPattern(backimg,'repeat');
  context.fillStyle=ptrn;
  context.fillRect(0,0,width,height);
  //context.drawImage(backimg,0,0,width,height);
 
  context.fillStyle = 'green';
  for (var id in players) {
    var player = players[id];
    //context.beginPath();
    //context.arc(player.x, player.y+10, 10, 0, 2 * Math.PI);
    //context.fill();
	
	context.drawImage(bomber_img,player.x,player.y,bombw,bombh);
	var fontArgs = context.font.split(' ');
    var newSize = '20px';
    context.font = newSize + ' ' + fontArgs[fontArgs.length - 1];
	context.fillStyle='black';
	context.fillText(player.name,player.x, player.y);
  }
  var w = width/map.length;
  var h=height/map[0].length;
  for (var i=0;i<map.length-1;i++){
	  for (var j=0;j<map[0].length;j++){
		 if (map[i][j]=='0') context.drawImage(wall_img,i*w,j*h,w,h);
	  }
  }

});