import Game from "./lib/Game.js";
import Mouse from "./lib/Mouse.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

canvas.width = 720;
canvas.height = 720; // 1280
canvas.ratio = canvas.width / canvas.height;

ctx.translate(canvas.width / 2, canvas.height / 2)
// let transform = ctx.getTransform();
// transform.e = canvas.width / 2;
// transform.f = canvas.height / 2;
// ctx.setTransform(transform);

onresize = resizeCanvas;
function resizeCanvas() {
    let width = window.innerWidth;
    let height = width / canvas.ratio;

    if (height > window.innerHeight) {
        height = window.innerHeight;
        width = height * canvas.ratio;
    }

    canvas.style.width = width + "px";
    setTimeout(function () {
        canvas.style.height = height + "px";
    }, 0);
}

const game = new Game();

onload = () => {
    resizeCanvas();
    game.start({ canvas, ctx });
    animate();
}

let dt = 0;
let _time = 0;
let frameCounter = 0;
let FPS = 60;

function animate(time = 0) {
    dt = (time - _time) / 1000;
    requestAnimationFrame(animate);
    if (frameCounter % FPS == FPS - 1)
        FPS = Math.round(1 / dt);

    game.update({ canvas, ctx, time, dt });

    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    game.draw({ canvas, ctx, time, dt });

    showFPS();

    _time = time;
    frameCounter++;
}

function showFPS() {
    ctx.textAlign = "right"
    ctx.textBaseline = "top";
    ctx.fillStyle = "white";
    ctx.font = "24px Varela"
    ctx.save();
    ctx.resetTransform();
    ctx.fillText(FPS, canvas.width - 5, 5);
    ctx.restore();
}