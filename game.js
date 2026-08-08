const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

});


/* ==========================================
   OBJET GLOBAL DU JEU
========================================== */

const Game = {

    canvas: canvas,

    ctx: ctx,

    tileSize: 64,

    camera: {
        x: 0,
        y: 0
    },

    /*
     * false = menu / prologue
     * true  = gameplay
     */

    running: false,

    /*
     * Permet de savoir si le moteur
     * est prêt.
     */

    ready: false

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

        if (
            loaded === scripts.length
        ) {

            console.log(
                "Tous les scripts sont chargés."
            );

            Game.ready = true;

            startEngine();

        }

    };

    script.onerror = () => {

        console.error(
            "ERREUR : impossible de charger " +
            file
        );

    };

    document.body.appendChild(script);

});


/* ==========================================
   MOTEUR PRINCIPAL
========================================== */

function startEngine() {

    console.log(
        "Moteur prêt. En attente du lancement."
    );

    let lastTime = performance.now();

    function loop(currentTime) {

        requestAnimationFrame(loop);

        /*
         * Delta time en secondes
         */

        let dt =
            (currentTime - lastTime) / 1000;

        lastTime = currentTime;


        /*
         * Évite les gros sauts si
         * l'onglet a été mis en pause.
         */

        if (dt > 0.1)
            dt = 0.1;


        /*
         * Nettoyage de l'écran
         */

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

            Prologue.update(dt);

            Prologue.draw();

            return;

        }


        /* =================================
           MENU / ATTENTE
        ================================= */

        if (!Game.running) {

            return;

        }


        /* =================================
           GAMEPLAY
        ================================= */

        if (
            typeof updatePlayer === "function"
        ) {

            updatePlayer();

        }


        if (
            typeof updateQuest === "function"
        ) {

            updateQuest();

        }


        if (
            typeof updateNPC === "function"
        ) {

            updateNPC();

        }


        if (
            typeof updateItems === "function"
        ) {

            updateItems();

        }


        if (
            typeof updateEnemies === "function"
        ) {

            updateEnemies();

        }


        if (
            typeof updateBoss === "function"
        ) {

            updateBoss();

        }


        /* =================================
           AFFICHAGE
        ================================= */

        if (
            typeof drawMap === "function"
        ) {

            drawMap();

        }


        if (
            typeof drawItems === "function"
        ) {

            drawItems();

        }


        if (
            typeof drawNPC === "function"
        ) {

            drawNPC();

        }


        if (
            typeof drawEnemies === "function"
        ) {

            drawEnemies();

        }


        if (
            typeof drawBoss === "function"
        ) {

            drawBoss();

        }


        if (
            typeof drawPlayer === "function"
        ) {

            drawPlayer();

        }

    }


    requestAnimationFrame(loop);

}


/* ==========================================
   DÉMARRAGE DE LA PARTIE
========================================== */

function startGame() {

    console.log(
        "Demande de nouvelle partie."
    );


    /*
     * Sécurité :
     * les scripts doivent être chargés.
     */

    if (!Game.ready) {

        console.warn(
            "Le moteur n'est pas encore prêt."
        );

        return;

    }


    /*
     * Masquer le menu
     */

    const menu =
        document.getElementById("menu");

 if (menu) {

    menu.style.display = "none";

}

    /*
     * Le gameplay reste bloqué
     * pendant le prologue.
     */

    Game.running = false;


    /*
     * Lancement du prologue
     */

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

        /*
         * Sécurité :
         * si le prologue n'existe pas,
         * on lance quand même le jeu.
         */

        Game.running = true;

    }

}


/* ==========================================
   FIN DU PROLOGUE
========================================== */

function finishPrologue() {

    console.log(
        "Prologue terminée."
    );


    /*
     * Le jeu devient actif.
     */

    Game.running = true;


    /*
     * On s'assure que le menu est caché.
     */

    const menu =
        document.getElementById("menu");

    if (menu) {

        menu.style.display = "none";

    }


    /*
     * On s'assure que le canvas
     * est visible.
     */

    Game.canvas.style.display =
        "block";


    /*
     * Position de départ du joueur.
     */

    if (typeof player !== "undefined") {

        player.x = 128;
        player.y = 128;

    }


    console.log(
        "Gameplay lancé."
    );

}


/* ==========================================
   ACCÈS GLOBAL
========================================== */

window.startGame =
    startGame;

window.finishPrologue =
    finishPrologue;
