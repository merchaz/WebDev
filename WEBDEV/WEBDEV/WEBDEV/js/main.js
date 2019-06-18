var rightPressed, leftPressed, upPressed, downPressed;
var hitBoxUp, hitBoxDown, hitBoxLeft, hitBoxRight;
var targets;
var targetAmount;
var targetsLeft;
var timer;
var totalSeconds;
var canMove;
var gameStarted;
var playerName;

function startButtonPressed() {
    let pregameDiv = document.getElementById("pregameDiv");
    let inputtedName = document.getElementById("playerNameTextbox").value;
    if (inputtedName == "") {
        playerName = "LazyBum";
    }
    else {
        playerName = inputtedName;
    }
    document.body.removeChild(pregameDiv);
    gameStarted = true;    
    startGame();
}

function startGame() {
    // Setup
    let background = document.getElementById("background-img");    
    background.style.top = "-600px";
    background.style.left = "-200px";
    targetAmount = 9;
    timer = 0;
    totalSeconds = 0;    
    setupHitboxes();
    const listDiv = document.getElementById('list');1
    let url = "http://127.0.0.1:8080/?score=" + 9999 + "&name=" + "default";
    fetch(url)
        .then(response => response.json())
        .then(data => listDiv.innerHTML = renderHighScoreList(data))
        .catch(error => listDiv.innerHTML = "Error: " + error);

    targets = new Array();    
    spawnTargets(targetAmount);
    targetsLeft = targetAmount +1;
    document.getElementById("targetsLeftLabel").innerHTML = targetsLeft + " targets left";    
    
    // Start
    myPlayer.start();
}

function setupHitboxes() {
    hitBoxUp = document.createElement("div");
    hitBoxUp.width = 70;
    hitBoxUp.x = (document.body.clientWidth / 2) - hitBoxUp.width / 2;
    hitBoxUp.y = 230;
    hitBoxUp.height = 50;

    hitBoxDown = document.createElement("div");
    hitBoxDown.width = 70;
    hitBoxDown.x = (document.body.clientWidth / 2) - hitBoxDown.width / 2;
    hitBoxDown.y = 380;
    hitBoxDown.height = 50;

    hitBoxLeft = document.createElement("div");
    hitBoxLeft.width = 50;
    hitBoxLeft.x = (document.body.clientWidth / 2) - hitBoxLeft.width / 2 - 40;
    hitBoxLeft.height = 70;
    hitBoxLeft.y = (document.body.getElementsByClassName("background")[0].clientHeight / 2) - hitBoxLeft.height / 2;

    hitBoxRight = document.createElement("div");
    hitBoxRight.width = 50;
    hitBoxRight.x = (document.body.clientWidth / 2) + hitBoxLeft.width / 2 + 40;
    hitBoxRight.height = 70;
    hitBoxRight.y = (document.body.getElementsByClassName("background")[0].clientHeight / 2) - hitBoxRight.height / 2;

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
        this.divPlayer[0].style.top = "30%";
        this.divPlayer[0].style.left = "49%";
        canMove = true;
        rightPressed = false;
        leftPressed = false;
        upPressed = false;
        downPressed = false;
        this.interval = setInterval(updateGameArea, 20);
        this.timerInterval = setInterval(setTime, 1000);       
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
        lockMovement();
        setPlayerClassName(myPlayer.currentRotation);
        var bHit = false;
        for (var i = 0; i <= targetAmount; i++) {
            var imgTarget = targets[i];
            
            if (myPlayer.currentRotation == "up") {
                if (collides(imgTarget, hitBoxUp)) {                              
                    bHit = true;
                }
            }
            else if (myPlayer.currentRotation == "down") {
                if (collides(imgTarget, hitBoxDown)) {                    
                    bHit = true;
                }
                
            }
            else if (myPlayer.currentRotation == "left") {
                if (collides(imgTarget, hitBoxLeft)) {
                    bHit = true;
                }
                
            }
            else if (myPlayer.currentRotation == "right") {
                if (collides(imgTarget, hitBoxRight)) {                    
                    bHit = true;
                }                
            }
            if (bHit && !imgTarget.classList.contains('hit')) {
                imgTarget.src = "images/gongHit.png";
                imgTarget.classList.add("hit");
                var audio = new Audio('audio/soundgong.mp3');
                audio.play();
                bHit = false;
                if (targetsLeft == 1) {
                    targetsLeft--;
                    gameEnded();

                } else {
                    targetsLeft--;
                    document.getElementById("targetsLeftLabel").innerHTML = targetsLeft + " targets left";
                }
            }
                 
        }     
        setTimeout(resetPlayerClassName, 2000);
    }    
}

function setPlayerClassName(name) {    
    var player = document.getElementById("player-img");
    player.classList.add(name);
   
}
function resetPlayerClassName() {    
    var player = document.getElementById("player-img");
    player.className = "";
    canMove = true;
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
        return true;
    }
    
}

function gameEnded() {
    document.getElementById("targetsLeftLabel").innerHTML = "Finish: " + timer + " seconds";
    const listDiv = document.getElementById('list');
    clearInterval(myPlayer.timerInterval);

    const name = playerName;
    const score = timer;   

    let url = "http://127.0.0.1:8080/?score=" + score + "&name=" + name;
    fetch(url)
        .then(response => response.json())
        .then(data => listDiv.innerHTML = renderHighScoreList(data))
        .catch(error => listDiv.innerHTML = "Error: " + error);
}

function renderHighScoreList(hs) {
    let out = "<ol>";
    hs.forEach((s) => out += "<li>" + s.score + " " + s.name + "</li>")
    out += "</ol>";
    return out;
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
        if (canMove) {
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
function lockMovement() {
    upPressed = false;
    leftPressed = false;
    rightPressed = false;
    downPressed = false;
    canMove = false;
}
function moveLeft() {    
    let background = document.getElementById("background-img");

    var leftValBg = parseInt(background.style.left, 10);
    if (leftValBg < 295) {
        background.style.left = (leftValBg + 10) + "px";
    }

    for (var i = 0; i <= targetAmount; i++) {
        var leftValTarget = parseInt(targets[i].style.left, 10);
        if (leftValBg < 295) {
            targets[i].style.left = (leftValTarget + 10) + "px";
        }   
    }    
    myPlayer.currentRotation = "left";
    let player = document.getElementsByClassName("player");
    player[0].style.transform = "rotate(90deg)";
    player[0].style.transformOrigin = "10% top";
    player[0].style.left = "52%";
    player[0].style.top = "30%";
 
}
function moveUp() {
    let background = document.getElementById("background-img");
    var topVal = parseInt(background.style.top, 10);
    if (topVal < 275) {
        background.style.top = (topVal + 10) + "px";
    }

    for (var i = 0; i <= targetAmount; i++) {
        var topValTarget = parseInt(targets[i].style.top, 10);
        if (topVal < 275) {
            targets[i].style.top = (topValTarget + 10) + "px";
        }
    }    
    myPlayer.currentRotation = "up";
    let player = document.getElementsByClassName("player");
    player[0].style.transform = "rotate(-180deg)";
    player[0].style.transformOrigin = "50% top";
    player[0].style.top = "35%";
    player[0].style.left = "49%";
}
function moveRight() {
    let background = document.getElementById("background-img");
    var leftVal = parseInt(background.style.left, 10);
    if (leftVal > -1470) {
        background.style.left = (leftVal - 10) + "px";
    }

    for (var i = 0; i <= targetAmount; i++) {
        var leftValTarget = parseInt(targets[i].style.left, 10);
        if (leftVal > -1470) {
            targets[i].style.left = (leftValTarget - 10) + "px";
        }
    }    
    myPlayer.currentRotation = "right";
    let player = document.getElementsByClassName("player");
    player[0].style.transform = "rotate(-90deg)";
    player[0].style.transformOrigin = "90% top";
    player[0].style.left = "47%";
    player[0].style.top = "30%";

}
function moveDown() {
    let background = document.getElementById("background-img");
    var topVal = parseInt(background.style.top, 10);
    if (topVal > -1475) {
        background.style.top = (topVal - 10) + "px";
    }

    for (var i = 0; i <= targetAmount; i++) {
        var topValTarget = parseInt(targets[i].style.top, 10);
        if (topVal > -1475) {
            targets[i].style.top = (topValTarget - 10) + "px";
        }
    }    
    myPlayer.currentRotation = "down";
    let player = document.getElementsByClassName("player");
    player[0].style.transform = "rotate(0deg)";
    player[0].style.transformOrigin = "40% top";
    player[0].style.top = "30%";
    player[0].style.left = "49%";
}