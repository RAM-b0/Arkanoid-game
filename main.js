  const winSound = document.querySelector("#p");
  const dropSound = document.querySelector("#ds");
  const bounceSound = document.querySelector("#dr");
  const brickSound = document.querySelector("#b");

  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  var ballX = canvas.width/2;
  var ballY = canvas.height-30;
  var dx = 1; // ball direction x
  var dy = -1; // ball direction y
  var ballSpeed = 3;

  var score = 0;
  var lives = 3;

  var ballRadius = 10;
  var paddleHeight = 10;
  var paddleWidth = 75;
  var paddleX = (canvas.width-paddleWidth)/2;
  var paddleY = (canvas.height-paddleHeight)-10;

  var brickRowCount = 5;
  var brickColumnCount = 18;
  var brickWidth = 35;
  var brickHeight = 20;
  var brickPadding = 5;
  var brickOffsetTop = 30;
  var brickOffsetLeft = 10;

  var bricks = [];
  for(let c=0; c<brickColumnCount; c++){
	  bricks[c]=[];
	  for(let r=0;r<brickRowCount; r++){
      bricks[c][r]={
        x:0, y:0, status: true
      };
    }
  }
  
  var rightPressed = false;
  var leftPressed = false;

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);

  function mouseMoveHandler(e){
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width){
      paddleX = relativeX - paddleWidth/2;
    }
  }

  function keyUpHandler(e) {
    if(e.keyCode == 39) {
      rightPressed = false;
		}
    else if(e.keyCode == 37) {
      leftPressed = false;
		}
	}

  function keyDownHandler(e) {
    if(e.keyCode == 39) {
      rightPressed = true;
	  }
    else if(e.keyCode == 37) {
      leftPressed = true;
		}
	}

  function collisionDetection() {
   for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      b = bricks[c][r];
      if(b.status == true) {
        if(ballX > b.x && ballX < b.x+brickWidth && ballY > b.y && ballY < b.y+brickHeight) {
          brickCollision();
        }
      }
    }
   }
  }

  function brickCollision() {
    brickSound.play();

    dy = -dy;
    if (dy > 0) {
      //ball going down
      dy = Math.random() * (1 - 0.6) + 0.6;
    }
    if (dy < 0) {
      //ball going up
      dy = Math.random() * (-0.6 - -1) + -1;
    }
    
    b.status = false;
    score++;
    if(score==brickRowCount*brickColumnCount){
      win();
    }
  }

  function drawScore(){
    ctx.font="16px Arial";
    ctx.fillStyle="#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
  }

  function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
  }

  function drawBall(){
	  ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }
  
  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }
  
  function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
      for(var r=0; r<brickRowCount; r++) {
        if(bricks[c][r].status==true){
          var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
          var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function ballColision() {
    if(ballX + dx > canvas.width-ballRadius || ballX + dx < ballRadius){
      wallBounce();
    }
    if(ballY + dy < ballRadius){
      bounce();
    }
    if(ballY + dy > canvas.height-ballRadius){
      dropSound.play();
      lives--;
      if(!lives){
        gameOver();
      }else{
        ballDrop();
      }
		}
    if(ballX > paddleX && ballX < paddleX + paddleWidth && ballY + dy >= paddleY){
      bounce();
    }
  }

  function paddleMove() {
    if(rightPressed && paddleX < canvas.width-paddleWidth){
      paddleX += 8;
    }
    else if(leftPressed && paddleX > 0){
      paddleX -= 8;
    }
  }

  function ballMove() {
    ballX += dx * ballSpeed;
    ballY += dy * ballSpeed;
  }

  function bounce() {
    dy = -dy;
    bounceSound.play();
  }

  function wallBounce() {
    dx = -dx;
    bounceSound.play();
  }

  function win() {
    winSound.play();
    alert("CONGRATULATIONS, YOU WIN!");
    document.location.reload();
  }

  function gameOver() {
    alert("GAMEOVER");
    document.location.reload();    
  }

  function ballDrop() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    dx = 1;
    dy = -1;
    paddleX = (canvas.width-paddleWidth)/2;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  	drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    ballColision();
    paddleMove();
    ballMove();

    requestAnimationFrame(draw);
  }
  
  draw();