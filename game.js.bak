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

    running: false,
    scriptsLoaded: false
};

window.Game = Game;


/* =========================================================
   ÉCRAN DE CHARGEMENT
========================================================= */

function createLoadingScreen() {

    let screen = document.getElementById("loading-screen");

    if (screen)
        return screen;

    screen = document.createElement("div");

    screen.id = "loading-screen";

    screen.innerHTML = `
        <div class="loading-content">

            <div class="loading-title">
                PONAN'S LEGACY
            </div>

            <div class="loading-subtitle">
                L'Héritage des Plumes
            </div>

            <div class="loading-bar">
                <div id="loading-progress"></div>
            </div>

            <div id="loading-text">
                Chargement du royaume...
            </div>

        </div>
    `;

    document.body.appendChild(screen);

    return screen;
}


function updateLoading(percent, text) {

    const progress =
        document.getElementById("loading-progress");

    const label =
        document.getElementById("loading-text");

    if (progress)
        progress.style.width =
            Math.max(0, Math.min(100, percent)) + "%";

    if (label && text)
        label.textContent = text;
}


function hideLoading() {

    const screen =
        document.getElementById("loading-screen");

    if (!screen)
        return;

    screen.classList.add("loading-hidden");

    setTimeout(() => {

        if (screen.parentNode)
            screen.parentNode.removeChild(screen);

    }, 700);
}


/* =========================================================
   CHARGEMENT DU JEU
========================================================= */

createLoadingScreen();

updateLoading(
    5,
    "Ouverture des archives..."
);


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


let loadedScripts = 0;


scripts.forEach(file => {

    const script =
        document.createElement("script");

    script.src = file;

    script.onload = () => {

        loadedScripts++;

        const percent =
            10 +
            (loadedScripts / scripts.length) * 70;

        updateLoading(
            percent,
            "Chargement : " +
            file.replace(".js", "").toUpperCase()
        );

        if (
            loadedScripts === scripts.length
        ) {

            Game.scriptsLoaded = true;

            updateLoading(
                100,
                "Le royaume est prêt."
            );

            startEngine();
        }
    };


    script.onerror = () => {

        console.error(
            "Impossible de charger : " + file
        );

        updateLoading(
            100,
            "Erreur de chargement : " + file
        );
    };


    document.body.appendChild(script);

});


/* =========================================================
   MOTEUR
========================================================= */

function startEngine() {

    console.log("Moteur démarré.");

    let lastTime =
        performance.now();


    function loop(time) {

        const dt =
            Math.min(
                (time - lastTime) / 1000,
                0.05
            );

        lastTime = time;


        Game.ctx.clearRect(
            0,
            0,
            Game.canvas.width,
            Game.canvas.height
        );


        /*
         * PROLOGUE
         */

        if (
            typeof Prologue !== "undefined" &&
            Prologue.active
        ) {

            Prologue.update(dt);
            Prologue.draw();

            requestAnimationFrame(loop);

            return;
        }


        /*
         * MENU
         */

        if (!Game.running) {

            requestAnimationFrame(loop);

            return;
        }


        /*
         * GAMEPLAY
         */

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


        /*
         * DESSIN
         */

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


        requestAnimationFrame(loop);
    }


    requestAnimationFrame(loop);


    /*
     * Le moteur est maintenant prêt.
     * On retire seulement le premier écran
     * de chargement.
     */

    setTimeout(() => {

        hideLoading();

    }, 400);
}


/* =========================================================
   NOUVELLE PARTIE
========================================================= */
function startGame() {

    console.log("Nouvelle partie...");

    const menu = document.getElementById("menu");

    if (menu)
        menu.style.display = "none";

    Game.running = false;

    const hud = document.getElementById("hud");

    if (hud)
        hud.style.display = "none";

    const quest = document.getElementById("quest");

    if (quest)
        quest.style.display = "none";

    const inventory = document.getElementById("inventory");

    if (inventory)
        inventory.style.display = "none";


    createLoadingScreen();

    updateLoading(
        5,
        "Les chroniques de Ponan..."
    );


    setTimeout(() => {

        updateLoading(
            22,
            "Le royaume s'éveille..."
        );

    }, 450);


    setTimeout(() => {

        updateLoading(
            43,
            "Les archives royales sont ouvertes..."
        );

    }, 950);


    setTimeout(() => {

        updateLoading(
            67,
            "Une ancienne trahison refait surface..."
        );

    }, 1450);


    setTimeout(() => {

        updateLoading(
            84,
            "Le destin de Ponanini III..."
        );

    }, 2050);


    setTimeout(() => {

        updateLoading(
            100,
            "L'histoire commence."
        );

    }, 2550);


    setTimeout(() => {

        hideLoading();

        if (
            typeof Prologue !== "undefined"
        ) {

            Prologue.start();

        } else {

            console.error(
                "Prologue introuvable."
            );

            Game.running = true;
        }

    }, 3200);
}

window.startGame = startGame;


/* =========================================================
   FIN DE PROLOGUE
========================================================= */

function finishPrologue() {

    console.log(
        "Prologue terminée."
    );


    if (
        typeof Prologue !== "undefined"
    ) {

        Prologue.active = false;
    }
    

    if (typeof player !== "undefined") {
        player.x = 29 * Game.tileSize;
        player.y = 19 * Game.tileSize;
    }
    
    Game.running = true;


    /*
     * On affiche enfin le HUD.
     */

    const hud =
        document.getElementById("hud");

    if (hud)
        hud.style.display = "flex";


    const quest =
        document.getElementById("quest");

    if (quest)
        quest.style.display = "block";


    /*
     * Le joueur commence réellement
     * après la cinématique.
     */

    const inventory =
        document.getElementById("inventory");

    if (inventory)
        inventory.classList.add("hidden");
}


window.finishPrologue =
    finishPrologue;


/* =========================================================
   BOUTONS DU MENU
========================================================= */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const playButton =
            document.getElementById(
                "playButton"
            );


        if (playButton) {

            /*
             * On supprime les anciens listeners
             * impossibles à supprimer directement
             * en utilisant un clone.
             */

            const newButton =
                playButton.cloneNode(true);

            playButton.parentNode.replaceChild(
                newButton,
                playButton
            );


            newButton.addEventListener(
                "click",
                startGame
            );
        }


        /*
         * CONTINUER
         */

        const continueButton =
            document.getElementById(
                "continueButton"
            );


        if (continueButton) {

            continueButton.addEventListener(
                "click",
                () => {

                    alert(
                        "Aucune sauvegarde disponible."
                    );

                }
            );
        }


        /*
         * OPTIONS
         */

        const optionsButton =
            document.getElementById(
                "optionsButton"
            );


        if (optionsButton) {

            optionsButton.addEventListener(
                "click",
                () => {

                    alert(
                        "Les options arrivent bientôt."
                    );

                }
            );
        }


        /*
         * CRÉDITS
         */

        const creditsButton =
            document.getElementById(
                "creditsButton"
            );


        if (creditsButton) {

            creditsButton.addEventListener(
                "click",
                () => {

                    alert(
                        "PONAN'S LEGACY\n\n" +
                        "Une aventure née du royaume de Ponan."
                    );

                }
            );
        }


        /*
         * QUITTER
         */

        const quitButton =
            document.getElementById(
                "quitButton"
            );


        if (quitButton) {

            quitButton.addEventListener(
                "click",
                () => {

                    window.close();

                }
            );
        }

    }
);
