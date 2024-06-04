const ctx = document.getElementById("game").getContext("2d");
const start = document.getElementById("start");
const restart = document.getElementById("restart");
const pause = document.getElementById("pause");
const life3 = document.getElementById("life3");
const life2 = document.getElementById("life2");
const life1 = document.getElementById("life1");

const heart = new Image();
heart.src = "img/heart.png";

const damageHeart = new Image();
damageHeart.src = "img/damageHeart.png";

const rabbit = new Image();
rabbit.src = "img/rabbit.png";

//Размер игрока
const box = 70;

const pinkArrow = new Image();
pinkArrow.src = "img/pinkArrow.png";

const blueArrow = new Image();
blueArrow.src = "img/blueArrow.png";

//Размер стрел
const arrowW = 26;
const arrowH = 90;

let gameover = false;

//Размер игрового поля
let ctxW = 770;
let ctxH = 600;

//Исходное положение игрока
let player = [];
function setPlayer() {
  player = [
    {
      x: (ctxW - box) / 2,
      y: ctxH - box,
    },
  ];
}

//Направление игрока
document.addEventListener("keydown", dirDown);
document.addEventListener("keyup", dirUp);

let dir;

function dirDown(event) {
  if (event.key === "ArrowLeft" && dir !== "right") {
    dir = "left";
    player.unshift({ x: player[0].x - box, y: player[0].y });
  }
  if (event.key === "ArrowRight" && dir !== "left") {
    dir = "right";
    player.unshift({ x: player[0].x + box, y: player[0].y });
  }
}

function dirUp(event) {
  if (event.key === "ArrowLeft" || "ArrowRight") {
    dir = "";
    player.unshift({ x: player[0].x, y: player[0].y });
  }
}

//Отрисовка игры
function drawGame() {
  if (!isPaused) {
    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, ctxW, ctxH);

    if (player[0].x < 0) {
      //gameover = true;
      player[0].x = 0;
    } else if (player[0].x >= ctxW) {
      player[0].x = ctxW - box;
    }

    //player.pop();
    ctx.drawImage(rabbit, player[0].x, player[0].y, box, box);

    drawArrows();

    if (lifes <= 0) {
      gameover = true;
      alert("Game Over");
      clearInterval(game);
      clearInterval(timing);
    }
  }
}

let arrows = [];

function createArrow() {
  if (!isPaused) {
    const x = Math.random() * (ctxW - arrowW); //можно разделить этот промежуток на 11 часте и чтоб стрелка падала по их центрам
    const y = -arrowH;
    const speed = Math.random() * 2 + 4;

    let img;
    if (Math.random() < 0.8) {
      img = blueArrow;
    } else {
      img = pinkArrow;
    }

    arrows.push({ x, y, speed, img });
  }
}

function drawArrows() {
  arrows.forEach((arrow) => {
    arrow.y += arrow.speed;
    ctx.drawImage(arrow.img, arrow.x, arrow.y, arrowW, arrowH);

    if (
      arrow.y + arrowH >= player[0].y &&
      arrow.x < player[0].x + box &&
      arrow.x + arrowW > player[0].x
    ) {
      if (arrow.img == blueArrow) {
        life1.src = damageHeart.src;
        if (lifes == 2) {
          life2.src = damageHeart.src;
        } else if (lifes == 1) {
          life3.src = damageHeart.src;
        }
        lifes--;
        // gameover = true;
      } else if (arrow.img == pinkArrow) {
        if (lifes == 2) {
          life1.src = heart.src;
        } else if (lifes == 1) {
          life2.src = heart.src;
        }
        lifes++;
      }
      arrows = arrows.filter((a) => a !== arrow); //оставляем стрелы, которые не столкнулись с игроком
    }
  });

  arrows = arrows.filter((arrow) => arrow.y < ctxH); //оставляем стрелы, которые еще не вышли за пределы поля
}

//Время
let time = document.getElementById("time");
let seconds = 0;
let minutes = 0;
let hours = 0;

function updateTime() {
  if (isTime) {
    seconds++;
    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }
    if (minutes === 60) {
      hours++;
      minutes = 0;
    }
    time.textContent = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
}

let game;
let timing;
let arrowAttack;
let isPaused = false;
let isTime = true;
let lifes;

//Кнопки управления игрой
start.addEventListener("click", () => {
  lifes = 3;
  setPlayer();
  start.disabled = true;
  pause.disabled = false;
  restart.disabled = false;
  arrowAttack = setInterval(createArrow, 2000);
  game = setInterval(drawGame, 90);
  timing = setInterval(updateTime, 1000);
});

restart.addEventListener("click", () => {
  lifes = 3;
  life1.src = heart.src;
  life2.src = heart.src;
  life3.src = heart.src;
  clearInterval(game);
  //Игрока в исходное положение
  setPlayer();
  //Очищаем поток стрел
  arrows = [];
  // Обнуляем время
  isTime = true;
  seconds = 0;
  minutes = 0;
  hours = 0;
  time.textContent = "00:00:00";
  //Возвращаем паузу
  isPaused = false;
  pause.textContent = "Пауза";
  clearInterval(timing);
  timing = setInterval(updateTime, 1000);

  arrowAttack = setInterval(createArrow, 3000);
  game = setInterval(drawGame, 90);
});

pause.addEventListener("click", function () {
  if (!isPaused) {
    isPaused = true;
    isTime = false;
    pause.textContent = "Продолжить";
  } else {
    isTime = true;
    isPaused = false;
    pause.textContent = "Пауза";
  }
});
