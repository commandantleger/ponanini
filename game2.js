// =======================================================
// DuckRPG Engine v1
// game2.js
// =======================================================

const Game = {

    tileSize: 32,

    cols: 40,
    rows: 30,

    canvas: document.getElementById("game"),
    ctx: null,

    camera: {
        x: 0,
        y: 0
    },

    keys: {},

    player: {
        x: 64,
        y: 64,
        w: 24,
        h: 24,
        speed: 180
    },

    map: [],

    init() {

        this.ctx = this.canvas.getContext("2d");

        this.resize();

        window.addEventListener("resize", () => this.resize());

        window.addEventListener("keydown", e => {
            this.keys[e.key] = true;
        });

        window.addEventListener("keyup", e => {
            this.keys[e.key] = false;
        });

        this.createMap();

        let last = performance.now();

        const loop = (time) => {

            const dt = (time - last) / 1000;

            last = time;

            this.update(dt);

            this.draw();

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    },

    resize() {

        this.canvas.width = window.innerWidth;

        this.canvas.height = window.innerHeight;

    },

    createMap() {

        for (let y = 0; y < this.rows; y++) {

            this.map[y] = [];

            for (let x = 0; x < this.cols; x++) {

                let wall = false;

                if (
                    x === 0 ||
                    y === 0 ||
                    x === this.cols - 1 ||
                    y === this.rows - 1
                ) {
                    wall = true;
                }

                if (x === 10 && y < 20)
                    wall = true;

                if (y === 15 && x > 15 && x < 35)
                    wall = true;

                this.map[y][x] = wall ? 1 : 0;
            }
        }
    },

    solid(px, py) {

        const tx = Math.floor(px / this.tileSize);

        const ty = Math.floor(py / this.tileSize);

        if (
            tx < 0 ||
            ty < 0 ||
            tx >= this.cols ||
            ty >= this.rows
        )
            return true;

        return this.map[ty][tx] === 1;
    },

    collide(x, y, w, h) {

        return (
            this.solid(x, y) ||
            this.solid(x + w, y) ||
            this.solid(x, y + h) ||
            this.solid(x + w, y + h)
        );
    },

    move(dx, dy) {

        let nx = this.player.x + dx;

        let ny = this.player.y + dy;

        if (!this.collide(
            nx,
            this.player.y,
            this.player.w,
            this.player.h
        )) {

            this.player.x = nx;
        }

        if (!this.collide(
            this.player.x,
            ny,
            this.player.w,
            this.player.h
        )) {

            this.player.y = ny;
        }
    },

    update(dt) {

        let dx = 0;
        let dy = 0;

        if (this.keys["ArrowLeft"] || this.keys["q"])
            dx--;

        if (this.keys["ArrowRight"] || this.keys["d"])
            dx++;

        if (this.keys["ArrowUp"] || this.keys["z"])
            dy--;

        if (this.keys["ArrowDown"] || this.keys["s"])
            dy++;

        if (dx !== 0 && dy !== 0) {

            dx *= Math.SQRT1_2;
            dy *= Math.SQRT1_2;
        }

        this.move(
            dx * this.player.speed * dt,
            dy * this.player.speed * dt
        );

        this.camera.x =
            this.player.x -
            this.canvas.width / 2;

        this.camera.y =
            this.player.y -
            this.canvas.height / 2;
    },

    draw() {

        this.ctx.fillStyle = "#1d1d1d";

        this.ctx.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        for (let y = 0; y < this.rows; y++) {

            for (let x = 0; x < this.cols; x++) {

                const screenX =
                    x * this.tileSize -
                    this.camera.x;

                const screenY =
                    y * this.tileSize -
                    this.camera.y;

                if (this.map[y][x] === 1) {

                    this.ctx.fillStyle = "#555";

                } else {

                    this.ctx.fillStyle = "#4CAF50";
                }

                this.ctx.fillRect(
                    screenX,
                    screenY,
                    this.tileSize,
                    this.tileSize
                );

                this.ctx.strokeStyle = "#2F2F2F";

                this.ctx.strokeRect(
                    screenX,
                    screenY,
                    this.tileSize,
                    this.tileSize
                );
            }
        }

        this.ctx.fillStyle = "#FFD700";

        this.ctx.fillRect(
            this.player.x - this.camera.x,
            this.player.y - this.camera.y,
            this.player.w,
            this.player.h
        );

        this.ctx.fillStyle = "white";

        this.ctx.font = "18px Arial";

        this.ctx.fillText(
            "DuckRPG Engine v1",
            20,
            30
        );

        this.ctx.fillText(
            "Position : " +
            Math.floor(this.player.x) +
            " / " +
            Math.floor(this.player.y),
            20,
            55
        );

        this.ctx.fillText(
            "Déplacement : ZQSD ou Flèches",
            20,
            80
        );
    }
};

window.addEventListener("load", () => {

    Game.init();

});
