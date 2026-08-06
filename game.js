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
    }

};

window.Game = Game;

const scripts = [
    "map.js",
    "player.js",
    "npc.js",
    "inventory.js",
    "ui.js",
    "quest.js"
];

let loaded = 0;

scripts.forEach(file => {

    const script = document.createElement("script");

    script.src = file;

    script.onload = () => {

        loaded++;

        if (loaded === scripts.length)
            startGame();

    };

    document.body.appendChild(script);

});

function startGame() {

    function loop() {

        updatePlayer();
	updateQuest();
        updateNPC();
	updateItems();

        Game.ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        drawMap();
	drawItems();
        drawNPC();
        drawPlayer();


        requestAnimationFrame(loop);

    }

    loop();

}
