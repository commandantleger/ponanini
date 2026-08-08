const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

});

const Game = {

    canvas: canvas,

    ctx: ctx,

    tileSize: 64,

    camera: {
        x: 0,
        y: 0
    },

    running: false

};

window.Game = Game;


/* ==========================================
   CHARGEMENT DES SCRIPTS DU JEU
========================================== */

const scripts = [

    "map.js",
    "player.js",
    "npc.js",
    "inventory.js",
    "ui.js",
    "quest.js",
    "enemy.js",
    "boss.js"

];

let loaded = 0;

scripts.forEach(file => {

    const script =
        document.createElement("script");

    script.src = file;

    script.onload = () => {

        loaded++;

        console.log(
            "Chargé : " + file
        );

        if (loaded === scripts.length) {

            console.log(
                "Tous les scripts sont chargés."
            );

            startEngine();

        }

    };

    script.onerror = () => {

        console.error(
            "ERREUR : impossible de charger " + file
        );

    };

    document.body.appendChild(script);

});


/* ==========================================
   MOTEUR
========================================== */

function startEngine() {

    console.log("Moteur démarré.");

    function loop(time) {

        requestAnimationFrame(loop);

        Game.ctx.clearRect(
            0,
            0,
            Game.canvas.width,
            Game.canvas.height
        );


        /* =================================
           PROLOGUE
        ================================= */

        if (
            typeof Prologue !== "undefined" &&
            Prologue.active
        ) {

            Prologue.update(1 / 60);

            Prologue.draw();

            return;

        }


        /* =================================
           MENU
        ================================= */

        if (!Game.running) {

            return;

        }


        /* =================================
           GAMEPLAY
        ================================= */

        if (
            typeof updatePlayer === "function"
        )
            updatePlayer();


        if (
            typeof updateQuest === "function"
        )
            updateQuest();


        if (
            typeof updateNPC === "function"
        )
            updateNPC();


        if (
            typeof updateItems === "function"
        )
            updateItems();


        if (
            typeof updateEnemies === "function"
        )
            updateEnemies();


        if (
            typeof updateBoss === "function"
        )
            updateBoss();


        /* =================================
           AFFICHAGE
        ================================= */

        if (
            typeof drawMap === "function"
        )
            drawMap();


        if (
            typeof drawItems === "function"
        )
            drawItems();


        if (
            typeof drawNPC === "function"
        )
            drawNPC();


        if (
            typeof drawEnemies === "function"
        )
            drawEnemies();


        if (
            typeof drawBoss === "function"
        )
            drawBoss();


        if (
            typeof drawPlayer === "function"
        )
            drawPlayer();

    }

    requestAnimationFrame(loop);

}


/* ==========================================
   NOUVELLE PARTIE
========================================== */

function startGame() {

    console.log("Nouvelle partie.");

    const menu =
        document.getElementById("menu");

    if (menu) {

        menu.style.display = "none";

    }

    Game.running = false;


    /* Lancement de la prologue */

    if (
        typeof Prologue !== "undefined"
    ) {

        Prologue.start();

        console.log(
            "Prologue lancée."
        );

    } else {

        console.error(
            "ERREUR : Prologue introuvable."
        );

        Game.running = true;

    }

}

window.startGame = startGame;
