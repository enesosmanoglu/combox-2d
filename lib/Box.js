import Img from "./Img.js";

export default class Box {
    x = 0;
    y = 0;
    width = 64;
    height = 64;
    get left() { return this.x - this.width / 2 };
    get right() { return this.x + this.width / 2 };
    get top() { return this.y - this.height / 2 };
    get bottom() { return this.y + this.height / 2 };

    text = "";
    imgName = "box";
    type = 0;
    moveSpeed = 2;

    constructor(data = {}) {
        Object.assign(this, data);

        this.targetX = this.targetX ?? this.x;
        this.targetY = this.targetY ?? this.y;

        this.img = new Img(this.imgName);

    }

    /**@param {{canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D}} */
    start({ canvas, ctx }) {

    }

    /**@param {{canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D,time:number,dt:number}} */
    update({ canvas, ctx, time, dt }) {
        if (this.targetX != this.x) {
            // this.x += (this.targetX - this.x) < 0 ? -this.moveSpeed : this.moveSpeed;
            this.x += (this.targetX - this.x) / 10;
            if (Math.abs(this.targetX - this.x) <= 0.1)
                this.x = this.targetX;
        } else if (this.targetY != this.y) {
            // this.y += (this.targetY - this.y) < 0 ? -this.moveSpeed : this.moveSpeed;
            this.y += (this.targetY - this.y) / 10;
            if (Math.abs(this.targetY - this.y) <= 0.1)
                this.y = this.targetY;
        } else {
            this.onTargetReached?.();
            this.onTargetReached = null;
        }

    }

    /**@param {{canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D,time:number,dt:number}} */
    draw({ canvas, ctx, time, dt }) {
        if (this.img.isLoaded) {
            ctx.drawImage(this.img.docElement,
                this.type * this.width, 0,
                this.width, this.height,
                this.left, this.top,
                this.width, this.height
            );
        } else {
            ctx.fillRect(this.left, this.top, this.width, this.height);
        }

        let fontOffset = 0;
        let length = this.text.toString().length;
        if (length == 1) {
            fontOffset = 0;
        } else if (length == 2) {
            fontOffset = 2
        } else if (length == 3) {
            fontOffset = 8
        } else {
            fontOffset = 6 + this.text.toString().length * 2;
        }

        ctx.font = "bold " + ((this.width / 2) - fontOffset) + "px Varela";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(this.text, this.x, this.y);

    }

}