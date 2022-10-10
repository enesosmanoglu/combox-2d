import Box from "./Box.js";
import Img from "./Img.js";
import Mouse from "./Mouse.js";

export default class Game {
    static dt = 0;

    static scene = [

    ];

    static gridBG = [];
    static grid = [];

    cursor = {
        imgH: new Img("arrow_horizontal"),
        imgV: new Img("arrow_vertical"),
        direction: "",
        imgIndex: 0,
        x: 0,
        y: 0,
        throwNumber: 1,
        start({ canvas, ctx }) {
            Mouse.addDownListener(e => {
                if (e.target != canvas) return;

                if (this.throwNumber > 0 && this.direction) {
                    console.log(this.i, this.j)
                    let horizontal = ["left", "right"].includes(this.direction);
                    let multiplier = horizontal && this.i != 0 || !horizontal && this.j != 0 ? -1 : 1;

                    let lastEmpty = [];
                    let explode = false;
                    for (let k = 0; k < Game.gridBG.length; k++) {
                        let i = this.i;
                        let j = this.j;
                        if (horizontal) {
                            i += k * multiplier;
                        } else {
                            j += k * multiplier;
                        }
                        let box = Game.grid[j][i]
                        if (!box)
                            lastEmpty = [j, i]
                        else if (box == this.throwNumber) {
                            lastEmpty = [j, i]
                            explode = true;
                            break;
                        } else
                            break;
                    }
                    console.log(lastEmpty)
                    let [leY, leX] = lastEmpty;
                    let lastEmptyTarget = Game.gridBG[leY][leX];
                    Game.grid[leY][leX] = this.throwNumber;
                    this.throwNumber = 0;

                    let sceneIndex = Game.scene.length;
                    Game.scene.push(new Box({
                        sceneIndex,
                        text: Game.grid[leY][leX],
                        x: this.x,
                        y: this.y,
                        targetX: lastEmptyTarget.x,
                        targetY: lastEmptyTarget.y,
                        onTargetReached: () => {
                            if (explode) {
                                this.throwNumber = Game.grid[leY][leX] * 2;
                                Game.grid[leY][leX] = null;
                                Game.scene.filter(b => b.type == 0 && b.x == lastEmptyTarget.x && b.y == lastEmptyTarget.y).forEach(b => {
                                    Game.scene.splice(Game.scene.indexOf(b), 1);
                                })
                            }
                            else
                                this.throwNumber = 1;

                            console.table(Game.grid)
                        }
                    }));

                }
            })
            Mouse.addMoveListener(e => {
                if (e.target != canvas) return;
                let ratio = canvas.width / e.target.clientWidth;
                let { x, y } = e;
                console.log(e)
                x -= e.target.offsetLeft + e.target.clientWidth / 2;
                y -= e.target.offsetTop + e.target.clientHeight / 2;
                x *= ratio;
                y *= ratio;
                let firstBox = Game.gridBG[0][0];
                let lastBox = Game.gridBG.slice(-1)[0].slice(-1)[0];

                if (firstBox.left <= x && x <= lastBox.right &&
                    firstBox.top <= y && y <= lastBox.bottom)
                    return;

                if (firstBox.left <= x && x <= lastBox.right) {
                    let diff = Game.gridBG[0][1].x - firstBox.x;
                    let i = ~~((x - firstBox.left) / diff);
                    this.i = i;
                    this.x = firstBox.x + i * diff;

                    if (firstBox.top >= y) {
                        this.direction = "down";
                        this.imgIndex = 1;
                        this.y = firstBox.y - firstBox.height;
                        this.j = 0;
                    } else {
                        this.direction = "up";
                        this.imgIndex = 0;
                        this.y = lastBox.y + firstBox.height;
                        this.j = Game.gridBG.length - 1;
                    }

                } else if (firstBox.top <= y && y <= lastBox.bottom) {
                    let diff = Game.gridBG[1][0].y - firstBox.y;
                    let j = ~~((y - firstBox.top) / diff);
                    this.j = j;
                    this.y = firstBox.y + j * diff;

                    if (firstBox.left >= x) {
                        this.direction = "right";
                        this.imgIndex = 1;
                        this.x = firstBox.x - firstBox.width;
                        this.i = 0;
                    } else {
                        this.direction = "left";
                        this.imgIndex = 0;
                        this.x = lastBox.x + firstBox.width;
                        this.i = Game.gridBG[j].length - 1;
                    }
                } else {
                    this.direction = "";

                }
            })
        },
        draw({ canvas, ctx, time, dt }) {
            if (this.throwNumber > 0) {
                let box = new Box({ x: -canvas.width / 2 + 70, y: -canvas.height / 2 + 70, text: this.throwNumber })
                box.draw({ canvas, ctx, time, dt })
            }

            if (!this.direction) return;
            let curImg = ["right", "left"].includes(this.direction) ? this.imgH : this.imgV;
            this.width = curImg.docElement.width / 2;
            this.height = curImg.docElement.height;
            ctx.drawImage(
                curImg.docElement,
                this.imgIndex * this.width, 0,
                this.width, this.height,
                this.x - this.width / 2, this.y - this.height / 2,
                this.width, this.height
            )
        }
    }

    constructor() {
        for (let j = -2; j <= 2; j++) {
            Game.grid.push([]);
            Game.gridBG.push([]);
            for (let i = -2; i <= 2; i++) {
                let box = new Box({ x: 70 * i, y: 70 * j, type: 1 });
                Game.scene.push(box);
                Game.gridBG[j + 2][i + 2] = box;
            }
        }

        Game.scene.push(this.cursor);
    }

    /**@param {{canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D}} */
    start({ canvas, ctx }) {
        Game.scene.forEach(o => o?.start?.({ canvas, ctx }));
    }

    /**@param {{canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D,time:number,dt:number}} */
    update({ canvas, ctx, time, dt }) {
        Game.dt = dt;
        Game.scene.forEach(o => o?.update?.({ canvas, ctx, time, dt }));

    }

    /**@param {{canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D,time:number,dt:number}} */
    draw({ canvas, ctx, time, dt }) {
        Game.scene.forEach(o => o?.draw?.({ canvas, ctx, time, dt }));
    }
}