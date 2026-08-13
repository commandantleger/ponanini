
/* ==========================================================
   PONAN'S LEGACY — GAMEPLAY / VISUAL UPGRADE
   Couche additive : le moteur existant reste intact.
========================================================== */

(() => {
    "use strict";

    const U = {
        installed: false,
        sprint: false,
        stamina: 100,
        maxStamina: 100,
        dashUntil: 0,
        lastSave: 0,
        saveCooldown: 10000,
        particles: [],
        time: 0,
        pattern: null,
        hud: null,
        toast: null,
    };

    const clamp = (v, a, b) =>
        Math.max(a, Math.min(b, v));

    function gameplayActive() {
        return !!(
            window.Game &&
            Game.running &&
            !(
                typeof window.dialogueOpen !== "undefined" &&
                window.dialogueOpen
            ) &&
            !(
                typeof window.gameFinished !== "undefined" &&
                window.gameFinished
            )
        );
    }

    /* ========================================================
       TEXTURE PROCÉDURALE
    ======================================================== */

    function makePattern() {
        const canvas =
            document.createElement("canvas");

        canvas.width = 64;
        canvas.height = 64;

        const ctx =
            canvas.getContext("2d");

        ctx.clearRect(
            0,
            0,
            64,
            64
        );

        ctx.globalAlpha = 0.08;

        for (let i = 0; i < 45; i++) {

            const x =
                Math.random() * 64;

            const y =
                Math.random() * 64;

            const length =
                2 + Math.random() * 6;

            ctx.strokeStyle =
                i % 2
                    ? "#173d20"
                    : "#d6d49b";

            ctx.lineWidth = 1;

            ctx.beginPath();

            ctx.moveTo(x, y);

            ctx.lineTo(
                x + length,
                y - 1
            );

            ctx.stroke();
        }

        return Game.ctx.createPattern(
            canvas,
            "repeat"
        );
    }


    /* ========================================================
       HUD
    ======================================================== */

    function createHUD() {

        if (
            document.getElementById(
                "upgrade-hud"
            )
        )
            return;

        const box =
            document.createElement("div");

        box.id = "upgrade-hud";

        box.innerHTML = `
            <div class="upgrade-row">
                <span id="upgrade-area">
                    PONAN
                </span>

                <span id="upgrade-speed">
                    MARCHE
                </span>
            </div>

            <div class="upgrade-stamina">
                <div id="upgrade-stamina-fill"></div>
            </div>

            <div class="upgrade-tip">
                SHIFT · courir
                &nbsp;&nbsp;
                SPACE · esquive
            </div>
        `;

        document.body.appendChild(box);

        U.hud = box;


        const toast =
            document.createElement("div");

        toast.id =
            "upgrade-toast";

        document.body.appendChild(toast);

        U.toast = toast;
    }


    function showToast(message) {

        if (!U.toast)
            return;

        U.toast.textContent =
            message;

        U.toast.classList.add(
            "show"
        );

        clearTimeout(
            U.toast._timer
        );

        U.toast._timer =
            setTimeout(
                () => {
                    U.toast.classList.remove(
                        "show"
                    );
                },
                2200
            );
    }


    function updateHUD() {

        if (
            !U.hud ||
            !window.Game
        )
            return;

        const area =
            document.getElementById(
                "upgrade-area"
            );

        const speed =
            document.getElementById(
                "upgrade-speed"
            );

        const fill =
            document.getElementById(
                "upgrade-stamina-fill"
            );


        if (
            area &&
            typeof window.currentMap !==
                "undefined"
        ) {

            const labels = {
                village:
                    "VILLAGE DE PONAN",

                forest:
                    "FORÊT",

                nether:
                    "NETHER",

                lake:
                    "GRAND LAC",
            };

            area.textContent =
                labels[
                    window.currentMap
                ] ||
                String(
                    window.currentMap ||
                    "PONAN"
                ).toUpperCase();
        }


        if (speed) {

            speed.textContent =
                U.sprint
                    ? "COURSE"
                    : "MARCHE";
        }


        if (fill) {

            fill.style.width =
                `${clamp(
                    U.stamina,
                    0,
                    100
                )}%`;
        }
    }


    /* ========================================================
       SPRINT + ESQUIVE
    ======================================================== */

    function dash() {

        if (!gameplayActive())
            return;

        if (U.stamina < 25) {

            showToast(
                "Pas assez d'endurance."
            );

            return;
        }

        U.stamina -= 25;

        U.dashUntil =
            performance.now() + 180;

        if (window.player)
            player.walkTime += 0.4;
    }


    function installInput() {

        window.addEventListener(
            "keydown",
            event => {

                const key =
                    event.key.toLowerCase();


                if (
                    key === "shift" &&
                    gameplayActive()
                ) {

                    U.sprint = true;
                }


                if (
                    event.code ===
                    "Space" &&
                    !event.repeat
                ) {

                    dash();
                }
            }
        );


        window.addEventListener(
            "keyup",
            event => {

                if (
                    event.key.toLowerCase() ===
                    "shift"
                ) {

                    U.sprint = false;
                }
            }
        );
    }


    function wrapPlayer() {

        if (
            typeof window.updatePlayer !==
                "function" ||
            window.updatePlayer.__ponanUpgrade
        )
            return;


        const original =
            window.updatePlayer;


        function upgradedPlayer() {

            if (typeof player === "undefined") {

                original();

                return;
            }


            const oldSpeed =
                player.speed;


            const sprinting =
                U.sprint &&
                U.stamina > 0 &&
                gameplayActive();


            const dashing =
                performance.now() <
                U.dashUntil;


            if (sprinting) {

                player.speed =
                    oldSpeed * 1.65;

                U.stamina =
                    clamp(
                        U.stamina - 0.75,
                        0,
                        100
                    );

            } else {

                player.speed =
                    oldSpeed;

                if (
                    !dashing &&
                    !player.moving
                ) {

                    U.stamina =
                        clamp(
                            U.stamina + 0.35,
                            0,
                            100
                        );
                }
            }


            if (dashing) {

                player.speed =
                    oldSpeed * 2.6;
            }


            original();


            player.speed =
                oldSpeed;
        }


        upgradedPlayer.__ponanUpgrade =
            true;

        window.updatePlayer =
            upgradedPlayer;
    }


    /* ========================================================
       ATMOSPHÈRE
    ======================================================== */

    function wrapMap() {

        if (
            typeof window.drawMap !==
                "function" ||
            window.drawMap.__ponanUpgrade
        )
            return;


        const original =
            window.drawMap;


        function upgradedMap() {

            original();

            drawWorldAtmosphere();
        }


        upgradedMap.__ponanUpgrade =
            true;

        window.drawMap =
            upgradedMap;
    }


    function drawWorldAtmosphere() {

        if (
            !window.Game ||
            !Game.ctx
        )
            return;


        const ctx =
            Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        U.time += 0.016;


        if (!U.pattern)
            U.pattern =
                makePattern();


        /*
         * Texture très légère.
         * drawMap() étant appelé avant les
         * PNJ et le joueur, cette couche
         * reste derrière eux.
         */

        if (U.pattern) {

            ctx.save();

            ctx.globalAlpha =
                0.16;

            ctx.fillStyle =
                U.pattern;

            ctx.fillRect(
                0,
                0,
                width,
                height
            );

            ctx.restore();
        }


        /*
         * Vignette.
         */

        const vignette =
            ctx.createRadialGradient(
                width / 2,
                height / 2,
                Math.min(
                    width,
                    height
                ) * 0.25,
                width / 2,
                height / 2,
                Math.max(
                    width,
                    height
                ) * 0.75
            );


        vignette.addColorStop(
            0,
            "rgba(0,0,0,0)"
        );

        vignette.addColorStop(
            1,
            "rgba(0,0,0,0.32)"
        );


        ctx.save();

        ctx.fillStyle =
            vignette;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );

        ctx.restore();


        /*
         * Brume adaptée à la zone.
         */

        const map =
            typeof window.currentMap !==
                "undefined"
                ? window.currentMap
                : "village";


        let alpha =
            0.025;


        if (map === "forest")
            alpha = 0.055;

        if (map === "nether")
            alpha = 0.07;


        ctx.save();

        ctx.fillStyle =
            `rgba(
                220,
                235,
                210,
                ${alpha}
            )`;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );

        ctx.restore();


        /*
         * Particules d'ambiance.
         */

        if (
            U.particles.length < 22 &&
            Math.random() < 0.08
        ) {

            U.particles.push({
                x:
                    Math.random() *
                    width,

                y:
                    Math.random() *
                    height,

                life: 1,

                size:
                    1 +
                    Math.random() * 2,

                speed:
                    8 +
                    Math.random() * 12,
            });
        }


        ctx.save();


        for (
            const particle
            of U.particles
        ) {

            particle.y -=
                particle.speed *
                0.016;

            particle.life -=
                0.004;


            ctx.globalAlpha =
                Math.max(
                    0,
                    particle.life * 0.35
                );


            ctx.fillStyle =
                map === "nether"
                    ? "#e2a45c"
                    : "#e7e2c6";


            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }


        ctx.restore();


        U.particles =
            U.particles.filter(
                particle =>
                    particle.life > 0 &&
                    particle.y > -10
            );
    }


    /* ========================================================
       PNJ : GUIDAGE VISUEL
    ======================================================== */

    function wrapNPC() {

        if (
            typeof window.drawNPC !==
                "function" ||
            window.drawNPC.__ponanUpgrade
        )
            return;


        const original =
            window.drawNPC;


        function upgradedNPC() {

            original();

            drawNPCGuidance();
        }


        upgradedNPC.__ponanUpgrade =
            true;

        window.drawNPC =
            upgradedNPC;
    }


    function drawNPCGuidance() {

        if (
            !window.Game ||
            typeof player === "undefined" ||
            typeof npcs === "undefined" ||
            !Array.isArray(npcs)
        )
            return;


        const ctx =
            Game.ctx;


        for (
            const npc of npcs
        ) {

            if (
                typeof npc.x !==
                    "number" ||
                typeof npc.y !==
                    "number"
            )
                continue;


            const dx =
                npc.x -
                player.x;

            const dy =
                npc.y -
                player.y;


            const distance =
                Math.hypot(
                    dx,
                    dy
                );


            if (
                distance >
                Game.tileSize * 4
            )
                continue;


            const x =
                npc.x -
                Game.camera.x +
                20;


            const y =
                npc.y -
                Game.camera.y;


            const pulse =
                1 +
                Math.sin(
                    performance.now() /
                    250
                ) * 0.08;


            ctx.save();


            ctx.globalAlpha =
                clamp(
                    1 -
                    distance /
                    (Game.tileSize * 4),
                    0,
                    1
                );


            ctx.strokeStyle =
                "rgba(232,199,91,0.55)";

            ctx.lineWidth = 2;


            ctx.beginPath();

            ctx.arc(
                x,
                y + 12,
                25 * pulse,
                0,
                Math.PI * 2
            );

            ctx.stroke();


            ctx.restore();
        }
    }


    /* ========================================================
       BOUSSOLE DE QUÊTE
    ======================================================== */

    function drawQuestCompass() {

        if (
            !gameplayActive() ||
            typeof player === "undefined" ||
            !window.Game
        )
            return;


        const stage =
            typeof window.questStage !==
                "undefined"
                ? window.questStage
                : 0;


        if (
            typeof npcs === "undefined" ||
            !Array.isArray(npcs)
        )
            return;


        const targets = [
            "marek",
            "mila",
            "guard",
        ];


        const target =
            npcs.find(
                npc =>
                    npc.id ===
                    targets[stage]
            );


        if (!target)
            return;


        const dx =
            target.x -
            player.x;

        const dy =
            target.y -
            player.y;


        const distance =
            Math.hypot(
                dx,
                dy
            );


        if (
            distance <
            Game.tileSize * 2
        )
            return;


        const ctx =
            Game.ctx;


        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        const angle =
            Math.atan2(
                dy,
                dx
            );


        const radius =
            Math.min(
                width,
                height
            ) * 0.38;


        const x =
            width / 2 +
            Math.cos(angle) *
            radius;


        const y =
            height / 2 +
            Math.sin(angle) *
            radius;


        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.rotate(
            angle
        );


        ctx.fillStyle =
            "rgba(232,199,91,0.92)";


        ctx.beginPath();

        ctx.moveTo(
            14,
            0
        );

        ctx.lineTo(
            -8,
            -7
        );

        ctx.lineTo(
            -8,
            7
        );

        ctx.closePath();

        ctx.fill();


        ctx.restore();
    }


    function wrapPlayerDraw() {

        if (
            typeof window.drawPlayer !==
                "function" ||
            window.drawPlayer.__ponanUpgrade
        )
            return;


        const original =
            window.drawPlayer;


        function upgradedDrawPlayer() {

            original();

            drawQuestCompass();
        }


        upgradedDrawPlayer.__ponanUpgrade =
            true;

        window.drawPlayer =
            upgradedDrawPlayer;
    }


    /* ========================================================
       AUTOSAVE
    ======================================================== */

    function autoSave() {

        if (!gameplayActive())
            return;


        const now =
            Date.now();


        if (
            now - U.lastSave <
            U.saveCooldown
        )
            return;


        U.lastSave =
            now;


        try {

            const data = {
                version: 2,

                savedAt: now,

                player:
                    typeof player !== "undefined"
                        ? {
                            x:
                                player.x,

                            y:
                                player.y,

                            direction:
                                player.direction,
                        }
                        : null,

                map:
                    typeof window.currentMap !==
                        "undefined"
                        ? window.currentMap
                        : null,

                questStage:
                    typeof window.questStage !==
                        "undefined"
                        ? window.questStage
                        : 0,
            };


            localStorage.setItem(
                "ponan_save",
                JSON.stringify(data)
            );

        } catch (error) {

            console.warn(
                "Autosave impossible",
                error
            );
        }
    }


    /* ========================================================
       INSTALLATION
    ======================================================== */

    function install() {

        if (U.installed)
            return;


        if (
            !window.Game ||
            !window.player
        )
            return;


        U.installed =
            true;


        createHUD();
        installInput();


        setInterval(
            autoSave,
            5000
        );


        /*
         * game.js charge map/player/npc
         * dynamiquement. On attend donc
         * qu'ils existent.
         */

        const retry =
            setInterval(
                () => {

                    wrapPlayer();
                    wrapMap();
                    wrapNPC();
                    wrapPlayerDraw();


                    if (
                        typeof window.updatePlayer ===
                            "function" &&
                        typeof window.drawMap ===
                            "function" &&
                        typeof window.drawNPC ===
                            "function"
                    ) {

                        clearInterval(
                            retry
                        );
                    }
                },
                100
            );


        setInterval(
            updateHUD,
            100
        );


        console.log(
            "✨ PONAN'S LEGACY — GAMEPLAY UPGRADE ACTIVÉ"
        );
    }


    const boot =
        setInterval(
            () => {

                if (
                    window.Game &&
                    typeof player !== "undefined"
                ) {

                    clearInterval(
                        boot
                    );

                    install();
                }

            },
            100
        );

})();
