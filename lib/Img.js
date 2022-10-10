export default class Img {
    static loaded = {};
    docElement = new Image();

    name = ""
    isLoaded = false;

    get src() {
        return "./img/" + this.name + ".png";
    }

    changeImage(newName, onchange = () => { }) {
        this.name = newName;
        this.isLoaded = false;
        if (!Img.loaded[this.name]) {
            Img.loaded[this.name] = new Image();
            Img.loaded[this.name].src = this.src;
            Img.loaded[this.name].onload = e => {
                console.log(`Img(${this.name}) loaded.`)
                this.isLoaded = true;
                onchange?.(e);
            };
        } else
            this.isLoaded = true;

        this.docElement = Img.loaded[this.name];
    }

    constructor(name, onload = () => { }) {
        this.changeImage(name, onload);
    }

}