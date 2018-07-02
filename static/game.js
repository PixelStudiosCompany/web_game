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
  right: false,
  chat: false,
  txt: ""
}

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
	 case 67: //C
	  movement.chat=true;
	  var n = prompt("enter message");
	  movement.txt=n; 
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

//Обработка браузрных кнопок

var up = document.getElementById('up');
up.addEventListener("mousedown",function(event){
	movement.up = true;
}
);
up.addEventListener("mouseup",function(event){
	movement.up = false;
}
);

var down = document.getElementById('down');
down.addEventListener("mousedown",function(event){
	movement.down = true;
}
);
down.addEventListener("mouseup",function(event){
	movement.down = false;
}
);

var left = document.getElementById('left');
left.addEventListener("mousedown",function(event){
	movement.left = true;
}
);
left.addEventListener("mouseup",function(event){
	movement.left = false;
}
);

var right = document.getElementById('right');
right.addEventListener("mousedown",function(event){
	movement.right = true;
}
);
right.addEventListener("mouseup",function(event){
	movement.right = false;
}
);

var chat = document.getElementById('chat');
chat.addEventListener("click",function(event){
	 movement.chat=true;
	  var n = prompt("enter message");
	  movement.txt=n; 
}
);

var a = prompt("enter your name: ");
socket.emit('new player',a);
var date = new Date();
setInterval(function() {
	
  socket.emit('movement', movement);
  
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
var cFont = context.font;


socket.on('state', function(players,map) {
	
  context.clearRect(0, 0, width, height);
  var ptrn= context.createPattern(backimg,'repeat');
  context.fillStyle=ptrn;
  context.fillRect(0,0,width,height);
  context.fillStyle = 'green';
  
  for (var id in players) {
    var player = players[id];
	context.drawImage(bomber_img,player.x,player.y,bombw,bombh);
	var fontArgs = context.font.split(' ');
    var newSize = '20px';
    context.font = newSize + ' ' + fontArgs[fontArgs.length - 1];
	context.fillStyle='black';
	context.fillText(player.name,player.x, player.y);
	context.fillText(player.message,player.x,player.y+bombh+20);	
  }
 
  var w = width/map.length;
  var h=height/map[0].length;
  for (var i=0;i<map.length-1;i++){
	  for (var j=0;j<map[0].length;j++){
		 if (map[i][j]=='0') context.drawImage(wall_img,i*w,j*h,w,h);
	  }
  }
 
});