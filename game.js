const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const hpText = document.getElementById("hp");
const coinText = document.getElementById("coin");

let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 25,
  speed: 5,
  hp: 100,
  gunLevel: 1,
  coins: 0
};

let bullets = [];
let enemies = [];
let keys = {};

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

canvas.addEventListener("click", shoot);

function shoot(e) {
  const angle = Math.atan2(
    e.clientY - player.y,
    e.clientX - player.x
  );

  bullets.push({
    x: player.x,
    y: player.y,
    dx: Math.cos(angle) * 10,
    dy: Math.sin(angle) * 10,
    size: 6
  });
}

function spawnEnemy() {
  enemies.push({
    x: Math.random() * canvas.width,
    y: -50,
    size: 20,
    hp: 2
  });
}

setInterval(spawnEnemy, 1000);

function update() {

  if(keys["w"]) player.y -= player.speed;
  if(keys["s"]) player.y += player.speed;
  if(keys["a"]) player.x -= player.speed;
  if(keys["d"]) player.x += player.speed;

  bullets.forEach((b, bi) => {
    b.x += b.dx;
    b.y += b.dy;

    enemies.forEach((e, ei) => {
      const dist = Math.hypot(b.x - e.x, b.y - e.y);

      if(dist < e.size) {
        e.hp--;
        bullets.splice(bi, 1);

        if(e.hp <= 0) {
          enemies.splice(ei, 1);
          player.coins += 10;
        }
      }
    });
  });

  enemies.forEach(e => {
    const angle = Math.atan2(player.y - e.y, player.x - e.x);

    e.x += Math.cos(angle) * 2;
    e.y += Math.sin(angle) * 2;

    const dist = Math.hypot(player.x - e.x, player.y - e.y);

    if(dist < 30) {
      player.hp -= 0.2;
    }
  });

  hpText.innerText = Math.floor(player.hp);
  coinText.innerText = player.coins;
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = "cyan";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = "yellow";
  bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.size, 0, Math.PI*2);
    ctx.fill();
  });

  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.size, 0, Math.PI*2);
    ctx.fill();
  });
}

function gameLoop() {
  update();
  draw();

  requestAnimationFrame(gameLoop);
}

gameLoop();

function buyGun() {
  if(player.coins >= 50) {
    player.coins -= 50;
    player.gunLevel++;
    alert("Nâng cấp súng thành công!");
  }
}