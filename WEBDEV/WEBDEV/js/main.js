function startGame() {
    let background = document.getElementById("background-img");
    let player = document.getElementsByClassName("player");
    background.style.top = "-600px";
    background.style.left = "-200px";
    player[0].style.top = "300px";
    player[0].style.left = "650px";
}

function keyPressed(event) {
    //init object globally
    var objImage = null;
    function init() {
        objImage = document.getElementById("background");
    }
    function getKeyAndMove(e) {
        var key_code = e.which || e.keyCode;
        switch (key_code) {
            case 65: //a
                moveLeft();
                break;
            case 87: //w
                moveUp();
                break;
            case 68: //d
                moveRight();
                break;
            case 83: //s
                moveDown();
                break;
        }
    }
    function moveLeft() {
        let background = document.getElementById("background-img");
        var leftVal = parseInt(background.style.left, 10);
        if (leftVal < 280) {
            background.style.left = (leftVal + 10) + "px";
        }
        let player = document.getElementsByClassName("player");
        player[0].style.transform = "rotate(90deg)";
    }
    function moveUp() {
        let background = document.getElementById("background-img");
        var topVal = parseInt(background.style.top, 10);
        if (topVal < 300) {
            background.style.top = (topVal + 10) + "px";            
        }
        let player = document.getElementsByClassName("player");
        player[0].style.transform = "rotate(-180deg)";
    }
    function moveRight() {
        let background = document.getElementById("background-img");
        var leftVal = parseInt(background.style.left, 10);
        if (leftVal > -1470) {
            background.style.left = (leftVal - 10) + "px";           
        }
        let player = document.getElementsByClassName("player");
        player[0].style.transform = "rotate(-90deg)";
        
    }
    function moveDown() {
        let background = document.getElementById("background-img");
        var topVal = parseInt(background.style.top, 10);
        if (topVal > -1460) {
            background.style.top = (topVal - 10) + "px";            
        }
        let player = document.getElementsByClassName("player");
        player[0].style.transform = "rotate(0deg)";
    }
    window.onload = init;
    getKeyAndMove(event);
}