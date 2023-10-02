// canvas properties
let canvasWidth = 600;
let canvasHeight = 400;

// properties of the ball shape
let ballXCoord = canvasWidth / 2;
let ballYCoord = canvasHeight / 2;
let ballDiameter = 20;
let ballRadius = ballDiameter / 2;

// ball speed
let ballXSpeed = 6;
let ballYSpeed = 6;

// properties of the racket
let racketWidth = 10;
let racketHeight = 150;

// player racket
let playerRacketXCoord = ballRadius / 2;
let playerRacketYCoord = (canvasHeight - racketHeight) / 2;

// opponent racket
let opponentRacketXCoord = canvasWidth - (racketWidth + ballRadius / 2);
let opponentRacketYCoord = (canvasHeight - racketHeight) / 2;
let opponentRacketYSpeed;
let opponentError = 0;

// game score
let playerScore = 0;
let opponentScore = 0;

// game sounds
let racketHit;
let scorePoint;
let soundtrack;

function preload() {
  soundFormats("ogg", "mp3");
  soundtrack = loadSound("trilha.mp3");
  scorePoint = loadSound("ponto.mp3");
  racketHit = loadSound("raquetada.mp3");
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  soundtrack.loop();
  soundtrack.setVolume(0.5);
}

function draw() {
  background(0);
  
  createBall();
  createRacket(playerRacketXCoord, playerRacketYCoord);
  createRacket(opponentRacketXCoord, opponentRacketYCoord);
  
  moveBall();
  checkCollisionWithBorder();
  
  movePlayerRacket();
  checkRacketHit(playerRacketXCoord, playerRacketYCoord);
  if (collided) {
    setOpponentError();
  }
  
  moveOpponentRacket();
  checkRacketHit(opponentRacketXCoord, opponentRacketYCoord);
  
  updateScore();
  showScore();
}
 
function createBall() {
  circle(ballXCoord, ballYCoord, ballDiameter);
}

function moveBall() {
  ballXCoord += ballXSpeed;
  ballYCoord += ballYSpeed;
}
  
function checkCollisionWithBorder() {
  if (ballXCoord + ballRadius > width || 
      ballXCoord - ballRadius < 0){
    ballXSpeed *= -1;
  }
  if (ballYCoord + ballRadius > height || 
      ballYCoord - ballRadius < 0){
    ballYSpeed *= -1;
  }
}

function createRacket(x, y) {
  rect(x, y, racketWidth, racketHeight)
}

function movePlayerRacket() {
  if (keyIsDown(UP_ARROW) && 
      playerRacketYCoord + racketHeight/2 > 0) {
    playerRacketYCoord -= 6
  }
  if (keyIsDown(DOWN_ARROW) &&
      playerRacketYCoord + racketHeight/2 < height) {
    playerRacketYCoord += 6
  }
}

function moveOpponentRacket() {
  const yMin = 0 - racketHeight / 2;
  const yMax = height + racketHeight / 2;
  opponentRacketYSpeed = ballYCoord - opponentRacketYCoord - racketHeight / 2;
  opponentRacketYCoord += opponentRacketYSpeed + opponentError;
  if (opponentRacketYCoord > yMax) {
    opponentRacketYCoord = yMax;
  }
  if (opponentRacketYCoord < yMin) {
    opponentRacketYCoord = yMin;
  }
}

// function checkRacketHit() {
//   if (ballXCoord - ballRadius < racketXCoord + racketWidth &&
//       ballYCoord - ballRadius < racketYCoord + racketHeight &&
//       ballYCoord + ballRadius > racketYCoord) {
//     ballXSpeed *= -1;
//   }
// }

function checkRacketHit(x, y) {
  collided = collideRectCircle(x, y, racketWidth, racketHeight, ballXCoord, ballYCoord, ballDiameter);
  if (collided) {
    racketHit.play();
    ballXSpeed *= -1;
  }
}

function showScore() {

  // show score background
  stroke(255);
  fill(color(255, 140, 0));
  rect(width / 2 - 0.05 * width - 20, 0.05*height - 18, 40, 22);
  rect(width / 2 + 0.05 * width - 20, 0.05*height - 18, 40, 22);
  
  // show score values 
  fill(255);
  textAlign(CENTER);
  textSize(20);
  text(playerScore, width / 2 - 0.05 * width, 0.05*height);
  text(opponentScore, width / 2 + 0.05 * width, 0.05*height);
}

function updateScore() {
  if (ballXCoord < ballRadius) {
    scorePoint.play();
    opponentScore += 1;
  }
  if (ballXCoord > width - ballRadius) {
    scorePoint.play();
    playerScore += 1;
  }
}

function setOpponentError() {
  opponentError = Math.floor(Math.random() * 100)
}
