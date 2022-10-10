import Game from "./Game.js";

export default class Mouse {
    static x;
    static y;
    static downx;
    static downy;
    static upx;
    static upy;
    static isdown;
    static events = {
        down: [],
        move: [],
        up: [],
    };
    static addDownListener(fn) {
        this.events.down.push(fn);
    }
    static addMoveListener(fn) {
        this.events.move.push(fn);
    }
    static addUpListener(fn) {
        this.events.up.push(fn);
    }
}

function mousedown(e) {
    // requestFullscreen.call(docEl);
    // console.log("mousedown", x, y);
    let { x, y } = e;
    Mouse.isdown = true;
    Mouse.x = x;
    Mouse.y = y;
    Mouse.downx = x;
    Mouse.downy = y;
    for (const event of Mouse.events.down) {
        event(e);
    }
}
function mousemove(e) {
    let { x, y } = e;
    Mouse.x = x;
    Mouse.y = y;
    for (const event of Mouse.events.move) {
        event(e);
    }
}
function mouseup(e) {
    // console.log("mouseup", x, y);
    let { x, y } = e;
    Mouse.isdown = false;
    Mouse.upx = x;
    Mouse.upy = y;
    for (const event of Mouse.events.up) {
        event(e);
    }
}

document.addEventListener("mousedown", e => {
    e.preventDefault();
    let { x, y } = e;
    mousedown(e);
});
document.addEventListener("mousemove", e => {
    e.preventDefault();
    let { x, y } = e;
    mousemove(e);
});
document.addEventListener("mouseup", e => {
    e.preventDefault();
    let { x, y } = e;
    mouseup(e);
});

document.addEventListener("touchstart", e => {
    let touch = e.changedTouches[0];
    mousedown({
        x: touch.clientX,
        y: touch.clientY,
    });
});
document.addEventListener("touchend", e => {
    let touch = e.changedTouches[0];
    mouseup({
        x: touch.clientX,
        y: touch.clientY,
    });
});


var doc = window.document;
var docEl = doc.documentElement;
var requestFullscreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
var cancelFullscreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

function toggleFullscreen() {
    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement)
        requestFullscreen.call(docEl);
    else
        cancelFullscreen.call(doc);
}