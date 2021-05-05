//canvas setup
const canvas = document.getElementById("canvas1");
const introscreen = document.querySelector(".intro");
const gamescreen = document.querySelector(".game");
const playBtn = document.querySelector(".button1");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;
let over = false;
let score = 0;
let gameFrame = 0;
ctx.font = "40px Georgia";
let gameSpeed = 1;
//mouse interactivity

let canvasPosition = canvas.getBoundingClientRect();

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false,
};

canvas.addEventListener("mousedown", function (event) {
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener("mouseup", function () {
  mouse.click = false;
});
const playerLeft = new Image();
playerLeft.src = "pic.png";
const playerRight = new Image();
playerRight.src = "pic2.png";
//player
class Player {
  constructor() {
    this.x = canvas.width;
    this.y = canvas.height / 2;
    this.radius = 10;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 450;
    this.spriteHeight = 220;
  }
  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;

    if (mouse.x != this.x) {
      this.x -= dx / 20;
    }
    if (mouse.y != this.y) {
      this.y -= dy / 20;
    }
  }
  draw() {
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.fillRect(this.x, this.y, this.radius, 10);

    if (this.x >= mouse.x) {
      ctx.drawImage(
        playerLeft,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 80,
        this.y - 55,
        this.spriteWidth / 2,
        this.spriteHeight / 2
      );
    } else {
      ctx.drawImage(
        playerRight,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 140,
        this.y - 55,
        this.spriteWidth / 2,
        this.spriteHeight / 2
      );
    }
  }
}
const player = new Player();

//lights
const lightsArray = [];
const ligthImage = new Image();
ligthImage.src = "fireball.png";
class Light {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 40;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
  }
  update() {
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }
  draw() {
    /*ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();*/
    ctx.drawImage(
      ligthImage,
      this.x - 35,
      this.y - 44,
      this.radius * 1.5,
      this.radius * 1.5
    );
  }
}

const lightpop = document.createElement("audio");
lightpop.src = "a.flac";

function handleLightes() {
  if (gameFrame % 50 == 0) {
    lightsArray.push(new Light());
  }
  for (let i = 0; i < lightsArray.length; i++) {
    lightsArray[i].update();
    lightsArray[i].draw();
    if (lightsArray[i].y < 0 - lightsArray[i].radius * 2) {
      lightsArray.splice(i, 1);
      i--;
    } else if (
      lightsArray[i].distance <
      lightsArray[i].radius + player.radius
    ) {
      if (!lightsArray[i].counted) {
        lightpop.play();
        score++;
        lightsArray[i].counted = true;
        lightsArray.splice(i, 1);
        i--;
      }
    }
  }
  for (let i = 0; i < lightsArray.length; i++) {}
}

//Repeating backgrounds
const background = new Image();
background.src = "b2.jpg";
function backgroundhandle() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

//bat
const batImage = new Image();
batImage.src = "bat.png";

class Bat {
  constructor() {
    this.x = canvas.width - 50;
    this.y = Math.random() * (canvas.height - 150) + 90;
    this.radius = 50;
    this.speed = Math.random() * 2 + 2;
  }
  draw() {
    // ctx.fillStyle = "blue";

    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    ctx.drawImage(
      batImage,
      this.x - 65,
      this.y - 65,
      this.radius * 2.2,
      this.radius * 2.2
    );
  }
  update() {
    this.x -= this.speed;
    if (this.x < 0 - this.radius * 2) {
      this.x = canvas.width - 50;
      this.y = Math.random() * (canvas.height - 150) + 90;
      this.speed = Math.random() * 2 + 2;
    }
    //collition with player
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.radius + player.radius) {
      gameOver();
    }
  }
}

const enemy1 = new Bat();
function handleEnemies() {
  enemy1.update();
  enemy1.draw();
}

function gameOver() {
  ctx.fillStyle = "#23152c";
  ctx.fillText(" GAME OVER !!! ", 250, 250);
  over = true;
}
//animation loops
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  backgroundhandle();
  handleLightes();
  player.update();
  player.draw();
  handleEnemies();
  ctx.fillStyle = "white";
  ctx.fillText("score: " + score, 10, 40);
  gameFrame++;

  if (!over) requestAnimationFrame(animate);
}

playBtn.addEventListener("click", () => {
  introscreen.classList.add("fadeOut");
  gamescreen.classList.add("fadeIn");
  animate();
});

window.addEventListener("resize", function () {
  canvasPosition = canvas.getBoundingClientRect();
});
