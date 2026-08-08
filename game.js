const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

});

const Game = {

    canvas,
    ctx,

    tileSize: 64,

    camera: {
        x: 0,
        y: 0
    },

    running: false

};

window.Game = Game;

const scripts = [

    "map.js",
    "player.js",
    "npc.js",
    "inventory.js",
    "ui.js",
    "quest.js",
    "enemy.js",
    "boss.js",
    "prologue.js"

];

let loaded = 0;

scripts.forEach(file => {

    const script =
        document.createElement("script");

    script.src = file;

    script.onload = () => {

        loaded++;

        if (loaded === scripts.length)
            startEngine();

    };

    script.onerror = () => {

        console.error(
            "Impossible de charger : " + file
        );

    };

    document.body.appendChild(script);

});

function startEngine() {

    function loop(time) {

        requestAnimationFrame(loop);

        Game.ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        /*
         * CINÉMATIQUE
         */

        if (Prologue.active) {

            Prologue.update(
                1 / 60
            );

            Prologue.draw();

            return;

        }

        /*
         * MENU
         */

        if (!Game.running)
            return;

        /*
         * GAMEPLAY
         */

        if (typeof updatePlayer === "function")
            updatePlayer();

        if (typeof updateQuest === "function")
            updateQuest();

        if (typeof updateNPC === "function")
            updateNPC();

        if (typeof updateItems === "function")
            updateItems();

        if (typeof updateEnemies === "function")
            updateEnemies();

        if (typeof updateBoss === "function")
            updateBoss();

        /*
         * DRAW
         */

        if (typeof drawMap === "function")
            drawMap();

        if (typeof drawItems === "function")
            drawItems();

        if (typeof drawNPC === "function")
            drawNPC();

        if (typeof drawEnemies === "function")
            drawEnemies();

        if (typeof drawBoss === "function")
            drawBoss();

        if (typeof drawPlayer === "function")
            drawPlayer();

    }

    requestAnimationFrame(loop);

}

window.startGame = function () {

    const menu =
        document.getElementById("menu");

    if (menu)
        menu.style.display = "none";

    Game.running = false;

    Prologue.start();

};
