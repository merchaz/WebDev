﻿var myGamePiece;

function startGame() {
    myGamePiece = new component(30, 30, "red", 300, 300);
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    bgImg: document.createElement("image"),
    start: function () {
        this.canvas.width = "600";
        this.canvas.height = "600";
        this.canvas.id = "myCanvas";
        this.bgImg.src = "url(images/background.png)";
        this.canvas.style.backgroundPositionX = "600";
        this.canvas.style.backgroundPositionY = "600";
        this.canvas.style.margin = "auto";
        this.canvas.style.display = "block";
        this.canvas.x = 600;
        this.canvas.y = 600;
        this.canvas.speed = 0;
        this.canvas.angle = 0;
        this.canvas.moveAngle = 0;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 10);
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    stop: function () {
        clearInterval(this.interval);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {

    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }
    this.newPos = function () {
        this.angle += this.moveAngle * Math.PI / 180;
        if (this.speed != 0) {
            
            var test = myGameArea.canvas.style.backgroundPositionX;// += this.speed * Math.sin(this.angle);
            test = myGameArea.canvas.style.backgroundPositionY;// -= this.speed * Math.sin(this.angle);
            
            //myGameArea.canvas.x += this.speed * Math.sin(this.angle);
            myGameArea.canvas.y -= this.speed * Math.cos(this.angle);
        }           
    }
}

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.moveAngle = 0;
    myGamePiece.speed = 0;
    if (myGameArea.keys && myGameArea.keys[65]) { myGamePiece.moveAngle = -1; } //a - left
    if (myGameArea.keys && myGameArea.keys[68]) { myGamePiece.moveAngle = 1; } //d - right
    if (myGameArea.keys && myGameArea.keys[87]) { myGamePiece.speed = 20; } //w - up
    if (myGameArea.keys && myGameArea.keys[83]) { myGamePiece.speed = -20; } //s - down
    myGamePiece.newPos();
    myGamePiece.update();
}