/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/


let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let bgReady, goReady, heroReady, asteroidReady;
let bgImage, goImage, heroImage, asteroidImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 15;
let elapsedTime = 0;

let score = 0;
let localStorageName = "playerScore";
let highScore;

let nameMessage = ''
let history = []

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/space-background.png";
  goImage = new Image();
  goImage.onload = function () {
    // show the game over image
    goReady = true;
  };
  goImage.src = "images/game-over.png";
  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/spaceship.png";

  asteroidImage = new Image();
  asteroidImage.onload = function () {
    // show the monster image
    asteroidReady = true;
  };
  asteroidImage.src = "images/asteroid.png";

  alienImage = new Image();
  alienImage.onload = function () {
    // show the monster image
    alienReady = true;
  };
  alienImage.src = "images/alien-ship.png";

  collisionSound = new Audio("audio/break-rock.mp4")
  captureSound = new Audio("audio/alien-death.mp4")
  goSound = new Audio("audio/game-over.mp4")
}

/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let asteroidX = 100;
let asteroidY = 100;

let alienX = 10;
let alienY = 430;
let alienDirectionX = 1;
let alienDirectionY = 1;

let collisionSound;
let captureSound;
let goSound;

/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}

function nameScreen() {
  let username = document.getElementById("name").value
  nameCap = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()
  nameMessage = "Welcome, " + nameCap + "!"
  document.getElementById("nameArea").innerHTML = `${nameMessage}`
  $('#name').val('');
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */

highScore = localStorage.getItem(localStorageName) == null ? 0 : localStorage.getItem(localStorageName)
highScore = Math.max(score, highScore);
localStorage.setItem(localStorageName, highScore)
document.getElementById("highScore").innerHTML = `${highScore}`

setTimeout("goSound.play()",15000);

let update = function () {
  // Update the time.
  if (elapsedTime >= SECONDS_PER_ROUND) {
    return;
  }
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  if (
    heroX <= (alienX + 51)
    && alienX <= (heroX + 51)
    && heroY <= (alienY + 42)
    && alienY <= (heroY + 42)
  ) {
    captureSound.play();
    elapsedTime = SECONDS_PER_ROUND
    return;
  }
  if (38 in keysDown) { // Player is holding up key
    heroY -= 5;
  }
  if (40 in keysDown) { // Player is holding down key
    heroY += 5;
  }
  if (37 in keysDown) { // Player is holding left key
    heroX -= 5;
  }
  if (39 in keysDown) { // Player is holding right key
    heroX += 5;
  }

  alienX -= alienDirectionX * 3;
  alienY -= alienDirectionY * 3;

  if (alienX > canvas.width - 51 || alienX < 0) {
    alienDirectionX = -alienDirectionX;
  }

  if (alienY > canvas.height - 42 || alienY < 0) {
    alienDirectionY = -alienDirectionY;
  }

  if (heroX < 0) {
    heroX = canvas.width - 51
  } else if (heroX > canvas.width) {
    heroX = 0
  }

  if (heroY < 0) {
    heroY = canvas.height - 42
  } else if (heroY > canvas.height) {
    heroY = 0
  }

  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (
    heroX <= (asteroidX + 51)
    && asteroidX <= (heroX + 51)
    && heroY <= (asteroidY + 42)
    && asteroidY <= (heroY + 42)
  ) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    collisionSound.play();
    asteroidX = Math.floor(Math.random() * (canvas.width - 51))
    asteroidY = Math.floor(Math.random() * (canvas.height - 42))
    score++
  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (asteroidReady) {
    ctx.drawImage(asteroidImage, asteroidX, asteroidY);
  }
  if (alienReady) {
    ctx.drawImage(alienImage, alienX, alienY)
  }
  if (elapsedTime >= SECONDS_PER_ROUND) {
    if (goReady) {
      ctx.drawImage(goImage, 0, 0);
    }
  }
  document.getElementById("timer").innerHTML = `${SECONDS_PER_ROUND - elapsedTime}`
  document.getElementById("score").innerHTML = `${score}`
};

function reset() {
  startTime = Date.now();
  elapsedTime = 0;
  heroX = canvas.width / 2;
  heroY = canvas.height / 2;
  score = 0;

  asteroidX = 100;
  asteroidY = 100;

  alienX = 10;
  alienY = 430;

  setTimeout("goSound.play()",15000);

  console.log("This is my reset button")

}

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  update();
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers. 
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

function startGame() {
  main()
}

// Let's play this game!
loadImages();
setupKeyboardListeners();