var WIDTH;
var HEIGHT;
var g;
var lander;
var rightDown;
var leftDown;
var upDown;
var downDown;
var myImage = new Image();
myImage.src = "lander.jpg";	
var landerHeight = 62;
var landerWidth = 74;
var stopGame;
var gameLoop;
var maxSpeed = 5;
var startFuel = 50;
var snd = new Audio("thruster.mp3");



$(function(){
	gameLoop = start();
});

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

function start() {
	g = $('#MainCanvas')[0].getContext("2d");
	WIDTH = $("#MainCanvas").width();
	HEIGHT = $("#MainCanvas").height();
	lander = new Lander(140,0,0,0.25,startFuel);
	return setInterval(draw, 25);
}
function draw() {
	clear();
	lander.move();
	lander.draw();
	drawBackground();
	drawStats();
	collideTest();
	checkStopGame();
}

function checkStopGame() {
	if(stopGame) {
		clearInterval(gameLoop);
		if (lander.dy > maxSpeed) {
			writeMessage("You lose!", "#222", 100, 100);
		}
		else {
			writeMessage("You win!", "#222", 100, 100);
		}
		
	}
}

function drawStats() {
	
	var speedColour = "#00ff00";
	if (lander.dy > maxSpeed) {
		speedColour = "#ff0000";
	}

	writeMessage("Speed: " + (Math.round(lander.dy*100)/100), speedColour, 200, 20);
	writeMessage("Fuel: " + lander.fuel, "#222", 200, 50);
}

function writeMessage(message,colour, x, y) {
	g.fillStyle = colour;
	g.font = "bold 14px sans-serif";
	g.fillText(message, x, y);
}

function drawBackground() {
	g.fillStyle = "#777";
	g.fillRect(0,260,300,40);
}

function clear() 
{
	g.clearRect(0, 0, WIDTH, HEIGHT);
}


//left arrow	 37
//up arrow	 	 38
//right arrow	 39
//down arrow	 40

// Get Key Input
function onKeyDown(evt) 
{
	if (lander.fuel > 0) {
		snd.play();
	}
	if(evt.keyCode == 39) rightDown = true;
	if(evt.keyCode == 37) leftDown = true;
	if(evt.keyCode == 38) upDown = true;
	if(evt.keyCode == 40) downDown = true;

}

function onKeyUp(evt) 
{
	snd.pause();
	if(evt.keyCode == 39) rightDown = false;
	if(evt.keyCode == 37) leftDown = false;
	if(evt.keyCode == 38) upDown = false;
	if(evt.keyCode == 40) downDown = false;
}


function Lander(x,y,dx,dy,fuel)
{
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.fuel = fuel;

	this.draw = function()
	{
	
		g.drawImage(myImage, ((this.x + .5) | 0), ((this.y + .5) | 0));
		//g.beginPath();
		//g.fillStyle = "#000";
		//g.arc(this.x, this.y, 20, 0, Math.PI*2, true);
		//g.closePath();
		//g.fill();
		if (upDown && this.fuel > 0) {
			g.beginPath();
			g.fillStyle = "#ffa500";
			g.arc(this.x + (landerWidth/2),this.y + landerHeight,10,0,Math.PI+(Math.PI*0)/2, false); 
			g.closePath();
			g.fill();
		}
		
		if (leftDown && this.fuel > 0) {
			g.beginPath();
			g.fillStyle = "#ffa500";
			g.arc(this.x + landerWidth - 10,this.y + landerHeight-30,5,Math.PI+(Math.PI*3)/2,Math.PI+(Math.PI*1)/2, true); 
			g.closePath();
			g.fill();
		}
		
		if (rightDown && this.fuel > 0) {
		
			g.beginPath();
			g.fillStyle = "#ffa500";
			g.arc(this.x + 10,this.y + landerHeight-30,5,Math.PI+(Math.PI*3)/2,Math.PI+(Math.PI*1)/2, false); 
			g.closePath();
			g.fill();
		}
		//context.strokeStyle = "#000000";
		//context.fillStyle = "#FFFF00";
		//context.beginPath();
		//context.arc(100,100,50,0,Math.PI*2,true);
		//context.closePath();
		//context.stroke();
		//context.fill();

	}
	
	this.getX = function()
	{
		return this.x;
	}
	
	this.getY = function()
	{
		return this.y;
	}
	
	this.move = function()
	{	
		this.x += this.dx;
		this.y += this.dy;
	
		//if(this.x > (WIDTH-20) || this.x < 20)
		//{
		//	this.dx = 0.0; //this.dx*-1;
		//}
		
		//if(this.y > (HEIGHT-20) || this.y < 20)
		//{
		//	this.dy = 0.0; //this.dy*-1;
		//}
		
		if(this.y > (HEIGHT-landerHeight))
		{
			this.dy = 0.0; //this.dy*-1;
			this.y = (HEIGHT-landerHeight);
		}
		
		//gravity
		if (!upDown || this.fuel == 0) {
			this.dy += 0.07;
		} 
		
		if (upDown && this.fuel > 0) {
			this.dy -= 0.14;
			this.fuel -= 1;
		}
		
		if (leftDown && this.fuel > 0) {
			this.dx -= 0.105;
		}
		
		if (rightDown && this.fuel > 0) {
			this.dx += 0.105;
		}
	}
	
}

      function collideTest() {

        // Collision detection. Get a clip from the screen.
        var clipWidth = landerWidth;
        var clipDepth = 1;
        var clipLength = clipWidth * clipDepth;
		
        // alert(clipLength);
        var clipOffset = 5;
        var whatColor = g.getImageData(lander.getX() , lander.getY() + landerHeight + 1, clipWidth, clipDepth);

        // Loop through the clip and see if you find red or blue. 
        for (var i = 0; i < clipLength * 4; i += 4) {
          if (whatColor.data[i] == 119) {
            stopGame = true;
            break;
          }
          // Second element is green but we don't care. 
          //if (whatColor.data[i + 2] != 0) {
          //  alert("blue");
          //  break;
          //}
          // Fourth element is alpha and we don't care. 
        }
      }

