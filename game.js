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
    camera: { x: 0, y: 0 },
    running: false,
    assetsReady: false
};

window.Game = Game;

/* ==========================================================
   LOADING
========================================================== */

function createLoadingScreen() {
    if (document.getElementById("loading-screen"))
        return;

    const screen = document.createElement("div");
    screen.id = "loading-screen";
    screen.innerHTML = `
        <div id="loading-title">PONAN'S LEGACY</div>
        <div id="loading-bar"><div id="loading-progress"></div></div>
        <div id="loading-text">CHARGEMENT DU ROYAUME...</div>
    `;
    document.body.appendChild(screen);
}

function setLoadingProgress(value, text) {
    const bar = document.getElementById("loading-progress");
    const label = document.getElementById("loading-text");
    if (bar) bar.style.width = `${Math.max(0, Math.min(100, value))}%`;
    if (label && text) label.textContent = text;
}

function hideLoading() {
    const screen = document.getElementById("loading-screen");
    if (!screen) return;
    screen.classList.add("hidden");
    setTimeout(() => screen.remove(), 700);
}

createLoadingScreen();
setLoadingProgress(5, "OUVERTURE DES ARCHIVES...");

/* ==========================================================
   CHARGEMENT DES SCRIPTS
========================================================== */

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
    const script = document.createElement("script");
    script.src = file;

    script.onload = () => {
        loaded++;
        setLoadingProgress(
            10 + (loaded / scripts.length) * 70,
            "CHARGEMENT : " + file.toUpperCase()
        );

        if (loaded === scripts.length) {
            Game.assetsReady = true;
            setLoadingProgress(100, "LE ROYAUME EST PRÊT");
            startEngine();
        }
    };

    script.onerror = () => {
        console.error("Impossible de charger " + file);
    };

    document.body.appendChild(script);
});

/* ==========================================================
   MOTEUR
========================================================== */

function startEngine() {
    let last = performance.now();

    function loop(time) {
        const dt = Math.min((time - last) / 1000, 0.05);
        last = time;

        Game.ctx.clearRect(
            0,
            0,
            Game.canvas.width,
            Game.canvas.height
        );

        if (typeof Prologue !== "undefined" && Prologue.active) {
            Prologue.update(dt);
            Prologue.draw();
            requestAnimationFrame(loop);
            return;
        }

        if (!Game.running) {
            requestAnimationFrame(loop);
            return;
        }

        if (typeof updatePlayer === "function") updatePlayer();
        if (typeof updateQuest === "function") updateQuest();
        if (typeof updateNPC === "function") updateNPC();
        if (typeof updateItems === "function") updateItems();
        if (typeof updateEnemies === "function") updateEnemies();
        if (typeof updateBoss === "function") updateBoss();

        if (typeof drawMap === "function") drawMap();
        if (typeof drawItems === "function") drawItems();
        if (typeof drawNPC === "function") drawNPC();
        if (typeof drawEnemies === "function") drawEnemies();
        if (typeof drawBoss === "function") drawBoss();
        if (typeof drawPlayer === "function") drawPlayer();

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
    hideLoading();
}

/* ==========================================================
   NOUVELLE PARTIE
========================================================== */

function startGame() {
    console.log("Nouvelle partie.");

    if (typeof resetQuests === "function")
        resetQuests();

    if (typeof loadVillage === "function")
        loadVillage();

    const menu = document.getElementById("menu");
    if (menu)
        menu.style.display = "none";

    Game.running = false;

    /* Petit écran de chargement avant la cinématique. */
    createLoadingScreen();
    setLoadingProgress(20, "PRÉPARATION DE L'HISTOIRE...");

    setTimeout(() => {
        setLoadingProgress(65, "OUVERTURE DU PASSAGE...");
    }, 250);

    setTimeout(() => {
        setLoadingProgress(100, "PONAN SE SOUVIENT...");

        setTimeout(() => {
            hideLoading();

            if (typeof Prologue !== "undefined") {
                Prologue.start();
            } else {
                Game.running = true;
            }
        }, 250);
    }, 700);
}

window.startGame = startGame;

/* ==========================================================
   FIN DE PROLOGUE
========================================================== */

function finishPrologue() {

    if (typeof loadVillage === "function")
        loadVillage();

    if (typeof resetQuests === "function")
        resetQuests();

    if (typeof playerArrival !== "undefined") {
        playerArrival.started = false;
        playerArrival.active = false;
    }

    Game.running = true;

    const hud = document.getElementById("hud");
    if (hud)
        hud.style.display = "flex";

    const menu = document.getElementById("menu");
    if (menu)
        menu.style.display = "none";
}

window.finishPrologue = finishPrologue;

/* ==========================================================
   MENU
========================================================== */

window.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("playButton");

    if (playButton) {
        playButton.addEventListener("click", startGame);
    }

    const continueButton = document.getElementById("continueButton");
    if (continueButton) {
        continueButton.addEventListener("click", () => {
            console.log("Système de sauvegarde à connecter.");
        });
    }

    const optionsButton = document.getElementById("optionsButton");
    if (optionsButton) {
        optionsButton.addEventListener("click", () => {
            console.log("Options à connecter.");
        });
    }

    const creditsButton = document.getElementById("creditsButton");
    if (creditsButton) {
        creditsButton.addEventListener("click", () => {
            console.log("Crédits à connecter.");
        });
    }
});

