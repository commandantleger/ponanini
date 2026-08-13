#!/usr/bin/env python3
"""
PONAN'S LEGACY — ULTIMATE GAMEPLAY OVERHAUL
============================================

Installe une couche de gameplay RPG complète au-dessus du moteur actuel.

IMPORTANT:
- Ne supprime aucun fichier existant.
- Crée des backups avant modification.
- N'affiche le HUD gameplay que lorsque le jeu est réellement lancé.
- Coupe proprement les musiques menu/prologue au passage au gameplay.
- Le gameplay reste compatible avec les maps / player / NPC / enemies existants.
- Si une API du moteur n'existe pas, le système utilise ses propres données
  sans casser le moteur existant.

Usage:
    cd /home/paulo/ponanini
    python3 overhaul_ponan.py

Puis:
    node --check ponan_overhaul.js
    git diff --check
"""

from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(sys.argv[1]).expanduser().resolve() if len(sys.argv) > 1 else Path("/home/paulo/ponanini")
INDEX = ROOT / "index.html"
STYLE = ROOT / "style.css"
JS = ROOT / "ponan_overhaul.js"

BACKUP_SUFFIX = ".before_ultimate_overhaul"


def log(msg):
    print(msg)


def backup(path):
    if not path.exists():
        log(f"[SKIP] {path.name} introuvable")
        return

    backup_path = path.with_name(path.name + BACKUP_SUFFIX)

    if not backup_path.exists():
        shutil.copy2(path, backup_path)
        log(f"[BACKUP] {backup_path.name}")
    else:
        log(f"[BACKUP] {backup_path.name} déjà présent")


GAMEPLAY_JS = r"""
/*
====================================================================
 PONAN'S LEGACY — ULTIMATE GAMEPLAY OVERHAUL
====================================================================

 Direction:
   Zelda-like exploration
   Final-Fantasy-inspired progression
   RPG action léger
   narration environnementale
   quêtes scénarisées
   fragments de Ponan
   progression village -> lac -> forêt -> Nether

 Cette couche ne remplace pas le moteur existant.
 Elle devient le système de gameplay supérieur quand Game.running = true.
====================================================================
*/

(() => {
    "use strict";

    if (window.PonanOverhaul && window.PonanOverhaul.version)
        return;

    const O = {
        version: "3.0.0",
        active: false,
        initialized: false,

        hp: 6,
        maxHp: 6,
        stamina: 100,
        maxStamina: 100,

        level: 1,
        xp: 0,
        gold: 0,

        fragments: 0,
        fragmentTarget: 3,

        attackCooldown: 0,
        attackUntil: 0,
        dodgeUntil: 0,
        invulnerableUntil: 0,

        combo: 0,
        comboUntil: 0,

        quest: "intro",
        questStep: 0,

        inventory: [],
        enemies: [],
        shrines: [],
        pickups: [],

        particles: [],
        floatingTexts: [],
        slashEffects: [],

        keys: new Set(),
        lastFrame: performance.now(),
        lastSave: 0,
        lastZone: "",

        menuAudioIds: [
            "menuMusic",
            "introVideoPlayer"
        ]
    };

    window.PonanOverhaul = O;

    const now = () => performance.now();

    const clamp = (v, a, b) =>
        Math.max(a, Math.min(b, v));

    function gameplayRunning() {
        return !!(
            window.Game &&
            Game.running === true
        );
    }

    function getPlayer() {
        try {
            if (typeof player !== "undefined")
                return player;
        } catch (_) {}

        return window.player || null;
    }

    function getEnemies() {
        try {
            if (typeof enemies !== "undefined" && Array.isArray(enemies))
                return enemies;
        } catch (_) {}

        return Array.isArray(window.enemies)
            ? window.enemies
            : [];
    }

    function getNPCs() {
        try {
            if (typeof npcs !== "undefined" && Array.isArray(npcs))
                return npcs;
        } catch (_) {}

        return Array.isArray(window.npcs)
            ? window.npcs
            : [];
    }

    function getMapName() {
        try {
            if (typeof currentMap !== "undefined")
                return String(currentMap);
        } catch (_) {}

        return String(window.currentMap || "village");
    }

    function distance(a, b) {
        return Math.hypot(
            (a.x || 0) - (b.x || 0),
            (a.y || 0) - (b.y || 0)
        );
    }

    function say(text) {
        let toast = document.getElementById("ponan-toast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "ponan-toast";
            document.body.appendChild(toast);
        }

        toast.textContent = text;
        toast.classList.remove("show");
        void toast.offsetWidth;
        toast.classList.add("show");

        clearTimeout(toast._timer);
        toast._timer = setTimeout(
            () => toast.classList.remove("show"),
            2300
        );
    }

    /* ==============================================================
       AUDIO
    ============================================================== */

    function stopAudio(id) {
        const audio = document.getElementById(id);
        if (!audio)
            return;

        try {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 0;
        } catch (_) {}
    }

    function stopMenuAndIntroAudio() {
        stopAudio("menuMusic");
        stopAudio("introVideoPlayer");
    }

    function startGameplayMusic() {
        stopMenuAndIntroAudio();

        let audio = document.getElementById("ponanGameplayMusic");

        if (!audio) {
            audio = document.createElement("audio");
            audio.id = "ponanGameplayMusic";
            audio.loop = true;
            audio.preload = "auto";

            /*
             * Si ce fichier n'existe pas encore, aucun crash:
             * le navigateur ignore simplement la lecture.
             */
            audio.src = "assets/audio/gameplay.mp3";
            audio.volume = 0.28;

            document.body.appendChild(audio);
        }

        audio.play().catch(() => {});
    }

    function stopGameplayMusic() {
        stopAudio("ponanGameplayMusic");
    }

    function installAudioGuard() {
        document.addEventListener(
            "click",
            () => {
                if (gameplayRunning())
                    stopMenuAndIntroAudio();
            },
            true
        );

        document.addEventListener(
            "keydown",
            () => {
                if (gameplayRunning())
                    stopMenuAndIntroAudio();
            },
            true
        );

        setInterval(() => {
            if (gameplayRunning()) {
                stopAudio("menuMusic");
                stopAudio("introVideoPlayer");
            }
        }, 300);
    }

    /* ==============================================================
       HUD
    ============================================================== */

    function createHUD() {
        if (document.getElementById("ponan-hud"))
            return;

        const hud = document.createElement("div");
        hud.id = "ponan-hud";

        hud.innerHTML = `
            <div class="po-hud-top">
                <div>
                    <b id="po-zone">PONAN</b>
                    <small id="po-objective">Explorer</small>
                </div>
                <div id="po-level">LV 1</div>
            </div>

            <div class="po-stat-label">
                <span>VIE</span>
                <span id="po-hp-text">6 / 6</span>
            </div>
            <div class="po-bar hp">
                <i id="po-hp"></i>
            </div>

            <div class="po-stat-label">
                <span>ENDURANCE</span>
                <span id="po-stamina-text">100</span>
            </div>
            <div class="po-bar stamina">
                <i id="po-stamina"></i>
            </div>

            <div class="po-stat-label">
                <span>XP</span>
                <span id="po-xp-text">0 / 100</span>
            </div>
            <div class="po-bar xp">
                <i id="po-xp"></i>
            </div>

            <div class="po-fragments">
                ◈ <span id="po-fragments">0 / 3</span>
            </div>

            <div class="po-controls">
                J / clic : attaque<br>
                SHIFT : courir · SPACE : esquive<br>
                E : interagir
            </div>
        `;

        document.body.appendChild(hud);
    }

    function updateHUD() {
        const hud = document.getElementById("ponan-hud");

        if (!hud) return;

        /*
         * Le HUD est INVISIBLE dans le menu.
         * C'est volontaire.
         */
        hud.style.display =
            gameplayRunning() ? "block" : "none";

        if (!gameplayRunning())
            return;

        const hp = document.getElementById("po-hp");
        const stamina = document.getElementById("po-stamina");
        const xp = document.getElementById("po-xp");

        if (hp)
            hp.style.width =
                `${O.hp / O.maxHp * 100}%`;

        if (stamina)
            stamina.style.width =
                `${O.stamina}%`;

        if (xp)
            xp.style.width =
                `${O.xp}%`;

        const hpText =
            document.getElementById("po-hp-text");

        const staminaText =
            document.getElementById("po-stamina-text");

        const xpText =
            document.getElementById("po-xp-text");

        const fragments =
            document.getElementById("po-fragments");

        const level =
            document.getElementById("po-level");

        const zone =
            document.getElementById("po-zone");

        const objective =
            document.getElementById("po-objective");

        if (hpText)
            hpText.textContent =
                `${O.hp} / ${O.maxHp}`;

        if (staminaText)
            staminaText.textContent =
                Math.floor(O.stamina);

        if (xpText)
            xpText.textContent =
                `${Math.floor(O.xp)} / 100`;

        if (fragments)
            fragments.textContent =
                `${O.fragments} / ${O.fragmentTarget}`;

        if (level)
            level.textContent =
                `LV ${O.level}`;

        const zones = {
            village: "VILLAGE DE PONAN",
            forest: "FORÊT DES MURMURES",
            lake: "GRAND LAC",
            nether: "NETHER",
            town: "VILLAGE DE PONAN"
        };

        if (zone)
            zone.textContent =
                zones[getMapName()] ||
                getMapName().toUpperCase();

        if (objective)
            objective.textContent =
                objectiveText();
    }

    function objectiveText() {
        const objectives = {
            intro: "Explorer Ponan",
            marek: "Parler à Marek",
            mila: "Retrouver Mila",
            guard: "Interroger le garde",
            forest: "Entrer dans la forêt",
            fragment: "Trouver les fragments",
            portal: "Réveiller le portail",
            nether: "Atteindre le Nether"
        };

        return objectives[O.quest] || "Explorer";
    }

    /* ==============================================================
       QUEST SYSTEM
    ============================================================== */

    const QUESTS = [
        {
            id: "intro",
            next: "marek",
            condition: () => true,
            message:
                "Ponan semble paisible... mais quelque chose ne va pas."
        },
        {
            id: "marek",
            next: "mila",
            condition: () => npcNearby("marek"),
            message:
                "Marek connaît quelque chose sur les événements du palais."
        },
        {
            id: "mila",
            next: "guard",
            condition: () => npcNearby("mila"),
            message:
                "Mila vous a parlé d'un ancien passage."
        },
        {
            id: "guard",
            next: "forest",
            condition: () => npcNearby("guard"),
            message:
                "Le garde vous indique le chemin de la forêt."
        },
        {
            id: "forest",
            next: "fragment",
            condition: () => getMapName() === "forest",
            message:
                "La forêt cache les traces d'une ancienne magie."
        },
        {
            id: "fragment",
            next: "portal",
            condition: () => O.fragments >= 3,
            message:
                "Les trois fragments réagissent entre eux."
        },
        {
            id: "portal",
            next: "nether",
            condition: () => getMapName() === "nether",
            message:
                "Le portail vous entraîne vers une terre inconnue."
        }
    ];

    function npcNearby(id) {
        const p = getPlayer();
        const list = getNPCs();

        if (!p)
            return false;

        const npc = list.find(
            n =>
                String(n.id || n.name || "")
                    .toLowerCase()
                    .includes(id)
        );

        if (!npc)
            return false;

        return distance(p, npc) <
            ((Game.tileSize || 32) * 2.2);
    }

    function advanceQuest() {
        const q =
            QUESTS.find(
                x => x.id === O.quest
            );

        if (!q)
            return;

        if (!q.condition())
            return;

        if (q.next === O.quest)
            return;

        O.quest = q.next;
        O.questStep++;

        say(q.message);

        spawnQuestReward();
    }

    function spawnQuestReward() {
        gainXP(10);
        O.gold += 5;
    }

    /* ==============================================================
       PLAYER MOVEMENT
    ============================================================== */

    let sprint = false;

    function installMovement() {
        document.addEventListener(
            "keydown",
            e => {
                if (!gameplayRunning())
                    return;

                if (
                    e.code === "ShiftLeft" ||
                    e.code === "ShiftRight"
                ) {
                    sprint = true;
                }

                if (
                    e.code === "Space" &&
                    !e.repeat
                ) {
                    e.preventDefault();
                    dodge();
                }

                if (
                    !e.repeat &&
                    (
                        e.key.toLowerCase() === "j" ||
                        e.key.toLowerCase() === "f"
                    )
                ) {
                    attack();
                }

                if (
                    e.key.toLowerCase() === "e" &&
                    !e.repeat
                ) {
                    interact();
                }

                if (
                    e.key.toLowerCase() === "i" &&
                    !e.repeat
                ) {
                    toggleInventory();
                }
            }
        );

        document.addEventListener(
            "keyup",
            e => {
                if (
                    e.code === "ShiftLeft" ||
                    e.code === "ShiftRight"
                ) {
                    sprint = false;
                }
            }
        );

        document.addEventListener(
            "mousedown",
            e => {
                if (
                    e.button === 0 &&
                    gameplayRunning()
                ) {
                    attack();
                }
            }
        );
    }

    function applyMovementModifier() {
        const p = getPlayer();

        if (!p)
            return;

        if (p.__ponanBaseSpeed === undefined)
            p.__ponanBaseSpeed =
                Number(p.speed) || 2;

        const base =
            p.__ponanBaseSpeed;

        if (now() < O.dodgeUntil) {
            p.speed = base * 3;
            return;
        }

        if (
            sprint &&
            O.stamina > 0
        ) {
            p.speed = base * 1.65;
            O.stamina =
                clamp(
                    O.stamina - 0.7,
                    0,
                    100
                );
        } else {
            p.speed = base;

            if (!p.moving)
                O.stamina =
                    clamp(
                        O.stamina + 0.55,
                        0,
                        100
                    );
        }
    }

    function dodge() {
        if (
            !gameplayRunning() ||
            O.stamina < 25
        )
            return;

        O.stamina -= 25;
        O.dodgeUntil = now() + 180;
        O.invulnerableUntil = now() + 360;

        burst(
            getPlayer(),
            "dodge"
        );
    }

    /* ==============================================================
       COMBAT
    ============================================================== */

    function attack() {
        if (
            !gameplayRunning() ||
            now() < O.attackCooldown
        )
            return;

        const p = getPlayer();

        if (!p)
            return;

        O.attackCooldown =
            now() + 360;

        O.attackUntil =
            now() + 170;

        const range = 78;

        const list = getEnemies();

        let hits = 0;

        for (const enemy of list) {
            if (!enemy || enemy.dead)
                continue;

            if (
                distance(p, enemy) >
                range
            )
                continue;

            /*
             * Respecte la direction du joueur quand elle existe.
             */
            if (
                p.direction &&
                !inFront(p, enemy)
            )
                continue;

            damageEnemy(
                enemy,
                1
            );

            hits++;
        }

        if (hits > 0) {
            O.combo =
                now() < O.comboUntil
                    ? O.combo + 1
                    : 1;

            O.comboUntil =
                now() + 1200;

            gainXP(
                hits * 5 +
                Math.min(O.combo, 5)
            );
        }

        O.slashEffects.push({
            x: p.x,
            y: p.y,
            life: 1,
            direction:
                p.direction || "down"
        });
    }

    function inFront(p, enemy) {
        const dx =
            enemy.x - p.x;

        const dy =
            enemy.y - p.y;

        switch (p.direction) {
            case "up":
                return dy < 35;
            case "down":
                return dy > -35;
            case "left":
                return dx < 35;
            case "right":
                return dx > -35;
            default:
                return true;
        }
    }

    function damageEnemy(enemy, amount) {
        enemy.__ponanHp =
            enemy.__ponanHp === undefined
                ? Number(
                    enemy.hp ??
                    enemy.health ??
                    enemy.life ??
                    2
                )
                : enemy.__ponanHp;

        enemy.__ponanHp -= amount;
        enemy.hit = true;
        enemy.__ponanHitUntil =
            now() + 150;

        burst(
            enemy,
            "hit"
        );

        if (
            enemy.__ponanHp <= 0
        ) {
            enemy.dead = true;
            gainXP(20);

            O.gold +=
                1 +
                Math.floor(
                    Math.random() * 4
                );

            maybeDropFragment(
                enemy
            );
        }
    }

    function updateEnemies() {
        const p = getPlayer();

        if (!p)
            return;

        const list = getEnemies();

        for (const enemy of list) {
            if (
                !enemy ||
                enemy.dead
            )
                continue;

            const d =
                distance(
                    p,
                    enemy
                );

            /*
             * Première IA :
             * ennemi passif loin du joueur,
             * poursuite proche,
             * attaque au contact.
             */
            if (
                d < 260 &&
                d > 50
            ) {
                const dx =
                    p.x - enemy.x;

                const dy =
                    p.y - enemy.y;

                const length =
                    Math.hypot(
                        dx,
                        dy
                    ) || 1;

                const speed =
                    Number(
                        enemy.speed
                    ) || 0.65;

                /*
                 * Ne force le déplacement que si
                 * l'ennemi expose les coordonnées.
                 */
                enemy.x +=
                    dx / length *
                    speed;

                enemy.y +=
                    dy / length *
                    speed;
            }

            if (
                d <= 52 &&
                now() >
                    (enemy.__ponanAttackUntil || 0)
            ) {
                enemy.__ponanAttackUntil =
                    now() + 900;

                hurtPlayer(1);
            }
        }
    }

    function hurtPlayer(amount) {
        if (
            now() <
            O.invulnerableUntil
        )
            return;

        O.hp =
            clamp(
                O.hp - amount,
                0,
                O.maxHp
            );

        O.invulnerableUntil =
            now() + 900;

        const p = getPlayer();

        burst(
            p,
            "damage"
        );

        if (O.hp <= 0)
            playerDefeated();
    }

    function playerDefeated() {
        O.hp = O.maxHp;
        O.stamina = O.maxStamina;

        const p = getPlayer();

        if (p) {
            p.x = 128;
            p.y = 128;
        }

        O.gold =
            Math.max(
                0,
                O.gold - 5
            );

        say(
            "Vous vous réveillez au village..."
        );
    }

    /* ==============================================================
       FRAGMENTS / EXPLORATION
    ============================================================== */

    function maybeDropFragment(enemy) {
        if (
            O.fragments >=
            O.fragmentTarget
        )
            return;

        if (
            Math.random() >
            0.12
        )
            return;

        O.pickups.push({
            type: "fragment",
            x: enemy.x,
            y: enemy.y,
            radius: 16,
            bob: Math.random() * 10
        });
    }

    function updatePickups() {
        const p = getPlayer();

        if (!p)
            return;

        for (
            let i = O.pickups.length - 1;
            i >= 0;
            i--
        ) {
            const item =
                O.pickups[i];

            item.bob += 0.04;

            if (
                distance(
                    p,
                    item
                ) <
                ((Game.tileSize || 32) * 1.2)
            ) {
                collect(item);
                O.pickups.splice(i, 1);
            }
        }
    }

    function collect(item) {
        if (
            item.type ===
            "fragment"
        ) {
            O.fragments =
                clamp(
                    O.fragments + 1,
                    0,
                    O.fragmentTarget
                );

            gainXP(30);

            say(
                `Fragment ancien trouvé — ${O.fragments}/${O.fragmentTarget}`
            );

            if (
                O.fragments >=
                O.fragmentTarget
            ) {
                O.quest = "portal";
                say(
                    "Les trois fragments vibrent. Le portail vous appelle."
                );
            }
        }
    }

    /* ==============================================================
       INTERACTIONS
    ============================================================== */

    function interact() {
        if (!gameplayRunning())
            return;

        const p = getPlayer();

        if (!p)
            return;

        const npcsList =
            getNPCs();

        let closest = null;
        let best = Infinity;

        for (const npc of npcsList) {
            if (!npc)
                continue;

            const d =
                distance(
                    p,
                    npc
                );

            if (
                d < best &&
                d < ((Game.tileSize || 32) * 2.2)
            ) {
                best = d;
                closest = npc;
            }
        }

        if (closest) {
            interactNPC(
                closest
            );
            return;
        }

        if (
            getMapName() ===
            "forest"
        ) {
            say(
                "Les arbres semblent cacher quelque chose..."
            );
        }
    }

    function interactNPC(npc) {
        const id =
            String(
                npc.id ||
                npc.name ||
                ""
            ).toLowerCase();

        if (id.includes("marek")) {
            O.quest = "mila";
            say(
                "Marek : Les anciennes portes ne sont pas des légendes..."
            );
            gainXP(15);
            return;
        }

        if (id.includes("mila")) {
            O.quest = "guard";
            say(
                "Mila : Le garde royal sait ce qui est arrivé au roi."
            );
            gainXP(15);
            return;
        }

        if (
            id.includes("guard") ||
            id.includes("garde")
        ) {
            O.quest = "forest";
            say(
                "Le garde : Si vous cherchez des réponses, commencez par la forêt."
            );
            gainXP(20);
            return;
        }

        say(
            npc.dialogue ||
            npc.text ||
            "..."
        );
    }

    /* ==============================================================
       XP / LEVEL
    ============================================================== */

    function gainXP(amount) {
        O.xp += amount;

        while (
            O.xp >= 100
        ) {
            O.xp -= 100;
            O.level++;

            O.maxHp++;
            O.hp = O.maxHp;

            O.maxStamina += 5;
            O.stamina =
                O.maxStamina;

            say(
                `NIVEAU ${O.level} — Le pouvoir de Ponan grandit.`
            );
        }
    }

    /* ==============================================================
       INVENTORY
    ============================================================== */

    function addItem(id, name) {
        const existing =
            O.inventory.find(
                item =>
                    item.id === id
            );

        if (existing)
            existing.qty++;
        else
            O.inventory.push({
                id,
                name,
                qty: 1
            });
    }

    function toggleInventory() {
        if (!gameplayRunning())
            return;

        let panel =
            document.getElementById(
                "ponan-inventory"
            );

        if (!panel) {
            panel =
                document.createElement(
                    "div"
                );

            panel.id =
                "ponan-inventory";

            document.body.appendChild(
                panel
            );
        }

        panel.classList.toggle(
            "show"
        );

        panel.innerHTML = `
            <h2>INVENTAIRE</h2>
            <p>Fragments : ${O.fragments}/${O.fragmentTarget}</p>
            <p>Or : ${O.gold}</p>
            <p>Niveau : ${O.level}</p>
            <hr>
            ${
                O.inventory.length
                    ? O.inventory.map(
                        x =>
                            `<p>${x.name} × ${x.qty}</p>`
                    ).join("")
                    : "<p>Aucun objet.</p>"
            }
            <small>I pour fermer</small>
        `;
    }

    /* ==============================================================
       PARTICLES
    ============================================================== */

    function burst(entity, type) {
        if (!entity)
            return;

        for (
            let i = 0;
            i < 8;
            i++
        ) {
            O.particles.push({
                x: entity.x,
                y: entity.y,
                vx:
                    (Math.random() - 0.5) *
                    2.5,
                vy:
                    (Math.random() - 0.5) *
                    2.5,
                life: 1,
                type
            });
        }
    }

    function updateParticles() {
        for (const p of O.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.035;
        }

        O.particles =
            O.particles.filter(
                p => p.life > 0
            );
    }

    /* ==============================================================
       DRAW OVERLAY
    ============================================================== */

    function drawOverlay() {
        if (
            !gameplayRunning() ||
            !window.Game ||
            !Game.ctx
        )
            return;

        const ctx = Game.ctx;
        const p = getPlayer();

        if (!p)
            return;

        /*
         * Particules monde.
         */
        for (const particle of O.particles) {
            ctx.save();

            ctx.globalAlpha =
                clamp(
                    particle.life,
                    0,
                    1
                );

            ctx.fillStyle =
                particle.type === "damage"
                    ? "#d45d50"
                    : particle.type === "hit"
                        ? "#e8ca63"
                        : "#d8e3b4";

            ctx.beginPath();

            ctx.arc(
                particle.x -
                    Game.camera.x +
                    20,
                particle.y -
                    Game.camera.y +
                    20,
                2.2,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.restore();
        }

        /*
         * Fragments.
         */
        for (const item of O.pickups) {
            const x =
                item.x -
                Game.camera.x +
                20;

            const y =
                item.y -
                Game.camera.y +
                20 +
                Math.sin(item.bob) * 4;

            ctx.save();

            ctx.globalAlpha =
                0.7 +
                Math.sin(
                    now() / 180
                ) * 0.25;

            ctx.strokeStyle =
                "#d9c45f";

            ctx.lineWidth = 2;

            ctx.beginPath();

            ctx.moveTo(x, y - 9);
            ctx.lineTo(x + 7, y);
            ctx.lineTo(x, y + 9);
            ctx.lineTo(x - 7, y);
            ctx.closePath();

            ctx.stroke();

            ctx.restore();
        }

        /*
         * Cercle d'attaque.
         */
        if (
            now() <
            O.attackUntil
        ) {
            ctx.save();

            ctx.globalAlpha = 0.8;
            ctx.strokeStyle =
                "#e5c65e";
            ctx.lineWidth = 4;

            ctx.beginPath();

            ctx.arc(
                p.x -
                    Game.camera.x +
                    20,
                p.y -
                    Game.camera.y +
                    20,
                38,
                0,
                Math.PI * 1.35
            );

            ctx.stroke();

            ctx.restore();
        }

        /*
         * Esquive.
         */
        if (
            now() <
            O.dodgeUntil
        ) {
            ctx.save();

            ctx.globalAlpha = 0.32;
            ctx.strokeStyle =
                "#d9e4c4";
            ctx.lineWidth = 3;

            ctx.beginPath();

            ctx.arc(
                p.x -
                    Game.camera.x +
                    20,
                p.y -
                    Game.camera.y +
                    20,
                30,
                0,
                Math.PI * 2
            );

            ctx.stroke();

            ctx.restore();
        }

        /*
         * Vignette combat.
         */
        if (
            now() <
            O.invulnerableUntil
        ) {
            ctx.save();

            ctx.fillStyle =
                "rgba(180,40,35,0.08)";

            ctx.fillRect(
                0,
                0,
                Game.canvas.width,
                Game.canvas.height
            );

            ctx.restore();
        }
    }

    /* ==============================================================
       ENVIRONMENTAL FEEDBACK
    ============================================================== */

    function zoneEvents() {
        if (!gameplayRunning())
            return;

        const zone =
            getMapName();

        if (
            zone !==
            O.lastZone
        ) {
            O.lastZone = zone;

            if (
                zone ===
                "forest"
            ) {
                say(
                    "FORÊT DES MURMURES — quelque chose vous observe."
                );
            }

            if (
                zone ===
                "nether"
            ) {
                say(
                    "NETHER — les règles de ce monde ne sont plus les mêmes."
                );
            }

            if (
                zone ===
                "village"
            ) {
                say(
                    "VILLAGE DE PONAN"
                );
            }
        }
    }

    /* ==============================================================
       SAVE
    ============================================================== */

    function save() {
        const p = getPlayer();

        if (!p)
            return;

        const data = {
            version: 3,
            time: Date.now(),
            player: {
                x: p.x,
                y: p.y,
                direction: p.direction
            },
            hp: O.hp,
            maxHp: O.maxHp,
            stamina: O.stamina,
            level: O.level,
            xp: O.xp,
            gold: O.gold,
            fragments: O.fragments,
            quest: O.quest,
            questStep: O.questStep,
            inventory: O.inventory
        };

        localStorage.setItem(
            "ponan_save_v3",
            JSON.stringify(data)
        );
    }

    function load() {
        try {
            const raw =
                localStorage.getItem(
                    "ponan_save_v3"
                );

            if (!raw)
                return;

            const data =
                JSON.parse(raw);

            if (
                !data ||
                data.version !== 3
            )
                return;

            Object.assign(
                O,
                {
                    hp: data.hp ?? O.hp,
                    maxHp: data.maxHp ?? O.maxHp,
                    stamina: data.stamina ?? O.stamina,
                    level: data.level ?? O.level,
                    xp: data.xp ?? O.xp,
                    gold: data.gold ?? O.gold,
                    fragments: data.fragments ?? O.fragments,
                    quest: data.quest ?? O.quest,
                    questStep: data.questStep ?? O.questStep,
                    inventory: data.inventory ?? O.inventory
                }
            );
        } catch (_) {}
    }

    /* ==============================================================
       ENGINE WRAPPERS
    ============================================================== */

    function wrapUpdatePlayer() {
        if (
            typeof window.updatePlayer !==
                "function" ||
            window.updatePlayer.__ponanUltimate
        )
            return;

        const original =
            window.updatePlayer;

        function wrapped() {
            applyMovementModifier();
            original();
        }

        wrapped.__ponanUltimate =
            true;

        window.updatePlayer =
            wrapped;
    }

    function wrapUpdateEnemies() {
        if (
            typeof window.updateEnemies !==
                "function" ||
            window.updateEnemies.__ponanUltimate
        )
            return;

        const original =
            window.updateEnemies;

        function wrapped() {
            original();
            updateEnemies();
        }

        wrapped.__ponanUltimate =
            true;

        window.updateEnemies =
            wrapped;
    }

    function wrapDrawPlayer() {
        if (
            typeof window.drawPlayer !==
                "function" ||
            window.drawPlayer.__ponanUltimate
        )
            return;

        const original =
            window.drawPlayer;

        function wrapped() {
            original();
            drawOverlay();
        }

        wrapped.__ponanUltimate =
            true;

        window.drawPlayer =
            wrapped;
    }

    /* ==============================================================
       GAME LOOP
    ============================================================== */

    function tick() {
        const t = now();
        const dt =
            Math.min(
                50,
                t - O.lastFrame
            );

        O.lastFrame = t;

        if (
            gameplayRunning()
        ) {
            O.active = true;

            stopAudio("menuMusic");
            stopAudio("introVideoPlayer");

            /*
             * Ne lance la musique gameplay que si
             * le fichier existe réellement.
             */
            if (
                t -
                (O.lastGameplayAudio || 0)
                > 2500
            ) {
                startGameplayMusic();
                O.lastGameplayAudio = t;
            }

            updatePickups();
            updateParticles();
            zoneEvents();
            advanceQuest();

            if (
                t -
                O.lastSave
                > 10000
            ) {
                save();
                O.lastSave = t;
            }

        } else {
            O.active = false;
            stopGameplayMusic();
        }

        updateHUD();

        requestAnimationFrame(
            tick
        );
    }

    /* ==============================================================
       BOOT
    ============================================================== */

    function boot() {
        if (O.initialized)
            return;

        O.initialized = true;

        createHUD();
        installMovement();
        installAudioGuard();
        load();

        /*
         * Le moteur peut charger certaines fonctions
         * après game.js. On les attrape progressivement.
         */
        setInterval(() => {
            wrapUpdatePlayer();
            wrapUpdateEnemies();
            wrapDrawPlayer();
        }, 250);

        tick();

        console.log(
            "⚔️ PONAN OVERHAUL 3.0 — GAMEPLAY RPG ACTIVÉ"
        );
    }

    const wait =
        setInterval(() => {
            if (window.Game) {
                clearInterval(wait);
                boot();
            }
        }, 100);
})();
"""


STYLE_CSS = r"""
/* ==========================================================
   PONAN'S LEGACY — ULTIMATE GAMEPLAY
========================================================== */

/*
 * Le HUD n'existe visuellement que lorsque
 * le JS détecte Game.running.
 */

#ponan-hud {
    display: none;
    position: fixed;
    top: 18px;
    right: 18px;
    width: 220px;
    padding: 14px;
    z-index: 9000;
    pointer-events: none;
    box-sizing: border-box;

    color: #eee6c8;
    background:
        linear-gradient(
            135deg,
            rgba(8, 13, 10, .94),
            rgba(20, 20, 14, .86)
        );

    border: 1px solid rgba(218, 189, 99, .58);

    box-shadow:
        0 14px 40px rgba(0,0,0,.42),
        inset 0 0 25px rgba(218,189,99,.035);

    font-family:
        Georgia,
        "Times New Roman",
        serif;

    backdrop-filter: blur(5px);
}

.po-hud-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 12px;
}

.po-hud-top b {
    display: block;
    font-size: 11px;
    letter-spacing: .14em;
}

.po-hud-top small {
    display: block;
    margin-top: 3px;
    font-size: 8px;
    opacity: .56;
    letter-spacing: .05em;
}

#po-level {
    color: #dfc56b;
    font-size: 11px;
}

.po-stat-label {
    display: flex;
    justify-content: space-between;
    margin-top: 7px;
    margin-bottom: 3px;
    font-size: 8px;
    letter-spacing: .08em;
    opacity: .72;
}

.po-bar {
    width: 100%;
    height: 5px;
    overflow: hidden;
    background: rgba(255,255,255,.08);
}

.po-bar i {
    display: block;
    width: 100%;
    height: 100%;
    transition: width .12s linear;
}

.po-bar.hp i {
    background: #b95248;
}

.po-bar.stamina i {
    background: #759d75;
}

.po-bar.xp i {
    background: #d1b653;
}

.po-fragments {
    margin-top: 11px;
    padding-top: 8px;
    border-top: 1px solid rgba(255,255,255,.08);
    color: #e1c66b;
    font-size: 10px;
    letter-spacing: .12em;
}

.po-controls {
    margin-top: 10px;
    font-size: 7px;
    line-height: 1.65;
    opacity: .42;
}

#ponan-toast {
    position: fixed;
    left: 50%;
    bottom: 92px;

    z-index: 9100;
    pointer-events: none;

    padding: 10px 20px;

    color: #f1e5bc;

    background:
        rgba(7,10,8,.92);

    border:
        1px solid
        rgba(218,189,99,.62);

    font-family:
        Georgia,
        "Times New Roman",
        serif;

    font-size: 12px;

    opacity: 0;

    transform:
        translate(-50%, 12px);

    transition:
        opacity .18s ease,
        transform .18s ease;
}

#ponan-toast.show {
    opacity: 1;
    transform:
        translate(-50%, 0);
}

#ponan-inventory {
    display: none;

    position: fixed;
    left: 50%;
    top: 50%;

    transform:
        translate(-50%, -50%);

    width: min(430px, 82vw);

    padding: 24px;

    z-index: 9500;

    color: #eee6c8;

    background:
        linear-gradient(
            135deg,
            rgba(10,14,11,.97),
            rgba(25,24,16,.96)
        );

    border:
        1px solid
        rgba(218,189,99,.64);

    box-shadow:
        0 30px 80px rgba(0,0,0,.58);

    font-family:
        Georgia,
        "Times New Roman",
        serif;
}

#ponan-inventory.show {
    display: block;
}

#ponan-inventory h2 {
    margin-top: 0;
    color: #dfc56b;
    letter-spacing: .12em;
}

#ponan-inventory hr {
    border: 0;
    border-top:
        1px solid
        rgba(255,255,255,.08);
}

#ponan-inventory small {
    opacity: .45;
}
"""


def patch_index():
    if not INDEX.exists():
        raise RuntimeError("index.html introuvable")

    text = INDEX.read_text(encoding="utf-8")

    script_tag = '<script src="ponan_overhaul.js"></script>'
    game_tag = '<script src="game.js"></script>'

    if script_tag not in text:
        if game_tag not in text:
            raise RuntimeError("Impossible de trouver game.js dans index.html")

        text = text.replace(
            game_tag,
            game_tag + "\n    " + script_tag,
            1
        )
        log("[OK] ponan_overhaul.js ajouté après game.js")
    else:
        log("[OK] ponan_overhaul.js déjà présent")

    INDEX.write_text(text, encoding="utf-8")


def patch_style():
    if not STYLE.exists():
        log("[SKIP] style.css introuvable")
        return

    text = STYLE.read_text(encoding="utf-8")

    marker = "PONAN'S LEGACY — ULTIMATE GAMEPLAY"

    if marker not in text:
        STYLE.write_text(
            text.rstrip() + "\n\n" + STYLE_CSS + "\n",
            encoding="utf-8"
        )
        log("[OK] style.css : HUD RPG ajouté")
    else:
        log("[OK] style.css : HUD RPG déjà présent")


def check_js(path):
    result = subprocess.run(
        ["node", "--check", str(path)],
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        print(result.stderr.rstrip())
        return False

    return True


def main():
    if not ROOT.exists():
        raise SystemExit(
            f"[ERREUR] Projet introuvable : {ROOT}"
        )

    print()
    print("============================================================")
    print(" PONAN'S LEGACY — ULTIMATE GAMEPLAY OVERHAUL")
    print("============================================================")
    print()

    backup(INDEX)
    backup(STYLE)
    backup(ROOT / "game.js")
    backup(ROOT / "player.js")
    backup(ROOT / "enemy.js")
    backup(ROOT / "map.js")

    JS.write_text(
        GAMEPLAY_JS.strip() + "\n",
        encoding="utf-8"
    )

    log("[OK] ponan_overhaul.js créé")

    patch_index()
    patch_style()

    log("")
    log("Vérification JavaScript...")

    ok = check_js(JS)

    if ok:
        log("[OK] ponan_overhaul.js")

    for filename in [
        "game.js",
        "player.js",
        "enemy.js",
        "map.js"
    ]:
        path = ROOT / filename

        if not path.exists():
            continue

        if check_js(path):
            log(f"[OK] {filename}")
        else:
            log(f"[ERREUR] {filename}")
            ok = False

    if not ok:
        raise SystemExit(
            "\n[STOP] Une erreur de syntaxe existe. Aucun commit."
        )

    print()
    print("============================================================")
    print(" OVERHAUL INSTALLÉ")
    print("============================================================")
    print()
    print("Gameplay ajouté :")
    print("  [1] Combat directionnel")
    print("  [2] Combo / XP / niveaux")
    print("  [3] PV / dégâts / invulnérabilité")
    print("  [4] Sprint + endurance")
    print("  [5] Esquive")
    print("  [6] IA de poursuite ennemie")
    print("  [7] Fragments anciens")
    print("  [8] Système de quête scénarisé")
    print("  [9] Interactions Marek / Mila / garde")
    print(" [10] Exploration forêt / Nether")
    print(" [11] Inventaire")
    print(" [12] Autosave")
    print(" [13] Particules / feedback combat")
    print(" [14] Transitions de zones")
    print(" [15] Audio menu/prologue coupé au gameplay")
    print(" [16] HUD caché dans le menu")
    print()
    print("Contrôles :")
    print("  J ou clic gauche : attaque")
    print("  SHIFT             : courir")
    print("  SPACE             : esquive")
    print("  E                 : interaction")
    print("  I                 : inventaire")
    print()
    print("Backups créés avec :", BACKUP_SUFFIX)
    print()
    print("Teste AVANT tout commit.")
    print()


if __name__ == "__main__":
    main()
