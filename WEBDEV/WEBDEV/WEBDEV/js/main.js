var rightPressed, leftPressed, upPressed, downPressed;
var hitBoxUp, hitBoxDown, hitBoxLeft, hitBoxRight;
var targets;
var targetAmount;
var targetsLeft;
var timer;
var totalSeconds;
function startGame() {
    // Setup
    let background = document.getElementById("background-img");    
    background.style.top = "-600px";
    background.style.left = "-200px";
    targetAmount = 9;
    timer = 0;
    totalSeconds = 0;
    targets = new Array();    
    spawnTargets(targetAmount);
    targetsLeft = targetAmount +1;
    document.getElementById("demo").innerHTML = targetsLeft;
    
    hitBoxUp = document.createElement("div");
    hitBoxUp.x = 670;
    hitBoxUp.width = 250;
    hitBoxUp.y = 230;
    hitBoxUp.height = 50;

    hitBoxDown = document.createElement("div");
    hitBoxDown.x = 620;
    hitBoxDown.width = 250;
    hitBoxDown.y = 380;
    hitBoxDown.height = 50;

    hitBoxLeft = document.createElement("div");
    hitBoxLeft.x = 670;
    hitBoxLeft.width = 50;
    hitBoxLeft.y = 230;
    hitBoxLeft.height = 250;

    hitBoxRight = document.createElement("div");
    hitBoxRight.x = 770;
    hitBoxRight.width = 50;
    hitBoxRight.y = 230;
    hitBoxRight.height = 250;

    // Start
    myPlayer.start();
}


function setTime() {
    ++timer;
    timer = pad(timer % 60);
    document.getElementById("timer").innerHTML =  timer + " seconds";
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

var myPlayer = {
    divPlayer: document.getElementsByClassName("player"),
    currentRotation: "Down",
    start: function () {
        this.divPlayer[0].style.top = "280px";
        this.divPlayer[0].style.left = "725px";
        rightPressed = false;
        leftPressed = false;
        upPressed = false;
        downPressed = false;
        this.interval = setInterval(updateGameArea, 20);
        setInterval(setTime, 1000);

    },
    stop: function () {
        clearInterval(this.interval);
    },    
    update: function () {
        if (upPressed) {
            moveUp();
        }
        if (leftPressed) {
            moveLeft();
        }
        if (rightPressed) {
            moveRight();
        }
        if (downPressed) {
            moveDown();            
        }
    },
    attack: function () {       

        setStabClassName(myPlayer.currentRotation);
        for (var i = 0; i <= targetAmount; i++) {
            var imgTarget = targets[i];
            
            if (myPlayer.currentRotation == "up") {
                if (collides(imgTarget, hitBoxUp)) {
                    imgTarget.style.visibility = "hidden";

                }
            }
            else if (myPlayer.currentRotation == "down") {
                if (collides(imgTarget, hitBoxDown)) {                    
                    imgTarget.style.visibility = "hidden";
                }
                
            }
            else if (myPlayer.currentRotation == "left") {
                if (collides(imgTarget, hitBoxLeft)) {
                    imgTarget.style.visibility = "hidden";
                }
                
            }
            else if (myPlayer.currentRotation == "right") {
                if (collides(imgTarget, hitBoxRight)) {
                    imgTarget.style.visibility = "hidden";
                }
                
            }
            
        }
        setTimeout(resetStabClassName, 2000);
        
    }
    
}

function setStabClassName(name) {
    var gongstab = document.getElementById("gongstab-img");
    var player = document.getElementById("player-img");
    player.classList.add(name);
    gongstab.className = name;
    
}
function resetStabClassName() {
    var gongstab = document.getElementById("gongstab-img");
    gongstab.className = "";
    var player = document.getElementById("player-img");
    player.classList.remove(myPlayer.currentRotation);
}

function sleep(millisecondsToWait) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + millisecondsToWait) { }
}

function collides(a, b) {    
    var rect = a.getBoundingClientRect();
    if (rect.left < b.x + b.width &&
        rect.left + a.width > b.x &&
        rect.top < b.y + b.height &&
        rect.top + a.height > b.y)
    {
        if (targetsLeft == 1) {
            document.getElementById("demo").innerHTML = "finish: " + timer + " seconds";
        } else {
            targetsLeft--;
            document.getElementById("demo").innerHTML = targetsLeft;
        }        
        return true;
    }
    
}

function spawnTargets(amount) {
    var bg = document.getElementsByClassName("background");
    for (var i = 0; i <= amount; i++) {
        var img = new Image();      
        img.src = 'images/target.png'
        img.className = 'targets';
        img.style.left = Math.floor(Math.random() * 1500) + "px";
        img.style.top = Math.floor(Math.random() * 1200) + "px";
        bg[0].appendChild(img);
        targets[i] = img;
    }
}

function updateGameArea() {
    myPlayer.update();
}

function keyPressed(event) {
    //init object globally
    var objImage = null;
    function init() {
        objImage = document.getElementById("background");
    }
    function getKeyAndMove(e) {
        var key_code = e.which || e.keyCode;
        if (key_code == 65) {
            leftPressed = true;
        }
        if (key_code == 87) {
            upPressed = true;
        }
        if (key_code == 68) {
            rightPressed = true;
        }
        if (key_code == 83) {
            downPressed = true;
        }        
        if (key_code == 32) {
            myPlayer.attack();
        }
    }    
    window.onload = init;
    getKeyAndMove(event);
}
function keyReleased(event) {
    //init object globally
    var objImage = null;
    function init() {
        objImage = document.getElementById("background");
    }
    function getKeyAndRelease(e) {
        var key_code = e.which || e.keyCode;
        if (key_code == 65) {
            leftPressed = false;
        }
        if (key_code == 87) {
            upPressed = false;
        }
        if (key_code == 68) {
            rightPressed = false;
        }
        if (key_code == 83) {
            downPressed = false;
        }
    }    
    window.onload = init;
    getKeyAndRelease(event);
}

function moveLeft() {    
    let background = document.getElementById("background-img");

    var leftValBg = parseInt(background.style.left, 10);
    if (leftValBg < 260) {
        background.style.left = (leftValBg + 10) + "px";
    }

    for (var i = 0; i <= targetAmount; i++) {
        var leftValTarget = parseInt(targets[i].style.left, 10);
        if (leftValBg < 260) {
            targets[i].style.left = (leftValTarget + 10) + "px";
        }   
    }    
    myPlayer.currentRotation = "left";
    let player = document.getElementsByClassName("player");
    player[0].style.transform = "rotate(90deg)";
    let gongstab = document.getElementById("gongstab-img");
    gongstab.style.transform = "rotate(90deg)";
    gongstab.style.transformOrigin = "10% top";
    gongstab.style.top = "318px";
}
function moveUp() {
    let background = document.getElementById("background-img");
    var topVal = parseInt(background.style.top, 10);
    if (topVal < 300) {
        background.style.top = (topVal + 10) + "px";
    }

    for (var i = 0; i <= targetAmount; i++) {
        var topValTarget = parseInt(targets[i].style.top, 10);
        if (topVal < 300) {
            targets[i].style.top = (topValTarget + 10) + "px";
        }
    }    
    myPlayer.currentRotation = "up";
    let player = document.getElementsByClassName("player");
    player[0].style.transform = "rotate(-180deg)";
    let gongstab = document.getElementById("gongstab-img");
    gongstab.style.transform = "rotate(-180deg)";
    gongstab.style.transformOrigin = "40% top";
}
function moveRight() {
    let background = document.getElementById("background-img");
    var leftVal = parseInt(background.style.left, 10);
    if (leftVal > -1490) {
        background.style.left = (leftVal - 10) + "px";
    }

    for (var i = 0; i <= targetAmount; i++) {
        var leftValTarget = parseInt(targets[i].style.left, 10);
        if (leftVal > -1490) {
            targets[i].style.left = (leftValTarget - 10) + "px";
        }
    }    
    myPlayer.currentRotation = "right";
    let player = document.getElementsByClassName("player");
    player[0].style.transform = "rotate(-90deg)";
    let gongstab = document.getElementById("gongstab-img");
    gongstab.style.transform = "rotate(-90deg)";
    gongstab.style.top = "315px";
    gongstab.style.transformOrigin = "90% top";

}
function moveDown() {
    let background = document.getElementById("background-img");
    var topVal = parseInt(background.style.top, 10);
    if (topVal > -1460) {
        background.style.top = (topVal - 10) + "px";
    }

    for (var i = 0; i <= targetAmount; i++) {
        var topValTarget = parseInt(targets[i].style.top, 10);
        if (topVal > -1460) {
            targets[i].style.top = (topValTarget - 10) + "px";
        }
    }    
    myPlayer.currentRotation = "down";
    let player = document.getElementsByClassName("player");
    player[0].style.transform = "rotate(0deg)";
    let gongstab = document.getElementById("gongstab-img");
    gongstab.style.transform = "rotate(0deg)";
    gongstab.style.transformOrigin = "40% top";
}