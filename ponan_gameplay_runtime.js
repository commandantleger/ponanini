/* =========================================================
   PONAN'S LEGACY — GAMEPLAY RUNTIME
   Couche d'amélioration branchée dans le vrai moteur.
========================================================= */

(() => {
    "use strict";

    if (window.PonanGameplayRuntime) return;

    const C = window.PonanGameplayConfig || {};
    const P = C.player || {};
    const COMBAT = C.combat || {};
    const PROG = C.progression || {};
    const CAMERA = C.camera || {};
    const AUDIO = C.audio || {};

    const state = {
        active: false,
        zone: C.world?.startingZone || "village_ponan",
        hp: P.maxHP || 100,
        stamina: P.maxStamina || 100,
        xp: PROG.xp || 0,
        level: PROG.level || 1,
        gold: PROG.gold || 0,
        fragments: PROG.fragments || 0,
        attackCooldown: 0,
        comboTimer: 0,
        combo: 0,
        attacking: false,
        heavyAttacking: false,
        dodging: false,
        keys: new Set(),
        lastX: null,
        lastY: null
    };

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    function getPlayer() {
        const candidates = [
            window.player,
            window.Player,
            window.Game?.player,
            window.game?.player,
            window.character,
            window.hero
        ];

        for (const p of candidates) {
            if (
                p &&
                Number.isFinite(Number(p.x)) &&
                Number.isFinite(Number(p.y))
            ) return p;
        }
        return null;
    }

    function callPlayer(names, ...args) {
        const p = getPlayer();
        if (!p) return false;

        for (const name of names) {
            if (typeof p[name] === "function") {
                try {
                    p[name](...args);
                    return true;
                } catch (e) {
                    console.warn("[PONAN] action joueur échouée:", name, e);
                }
            }
        }
        return false;
    }

    function save() {
        try {
            localStorage.setItem("ponan_gameplay_save", JSON.stringify({
                version: 3,
                level: state.level,
                xp: state.xp,
                hp: state.hp,
                stamina: state.stamina,
                gold: state.gold,
                fragments: state.fragments,
                zone: state.zone,
                timestamp: Date.now()
            }));
        } catch (_) {}
    }

    function load() {
        try {
            const raw = localStorage.getItem("ponan_gameplay_save");
            if (!raw) return;
            const s = JSON.parse(raw);

            state.level = Number(s.level) || 1;
            state.xp = Number(s.xp) || 0;
            state.hp = Number(s.hp) || P.maxHP || 100;
            state.stamina = Number(s.stamina) || P.maxStamina || 100;
            state.gold = Number(s.gold) || 0;
            state.fragments = Number(s.fragments) || 0;
            state.zone = s.zone || state.zone;
        } catch (_) {}
    }

    function xpRequired() {
        return Math.floor(
            (PROG.xpBase || 100) *
            Math.pow(PROG.xpGrowth || 1.35, Math.max(0, state.level - 1))
        );
    }

    function message(text) {
        let el = document.getElementById("ponanGameplayMessage");

        if (!el) {
            el = document.createElement("div");
            el.id = "ponanGameplayMessage";
            el.style.cssText =
                "position:fixed;left:50%;bottom:90px;transform:translateX(-50%);" +
                "padding:12px 22px;background:rgba(5,7,10,.92);" +
                "border:1px solid rgba(185,151,62,.7);color:#eee6d2;" +
                "font:14px Georgia,serif;letter-spacing:1px;z-index:5000;" +
                "opacity:0;pointer-events:none;transition:opacity .25s";
            document.body.appendChild(el);
        }

        el.textContent = text;
        el.style.opacity = "1";
        clearTimeout(el._timer);
        el._timer = setTimeout(() => el.style.opacity = "0", 2200);
    }

    function ensureHUD() {
        let hud = document.getElementById("ponanRpgHUD");

        if (hud) return hud;

        hud = document.createElement("div");
        hud.id = "ponanRpgHUD";
        hud.innerHTML = `
            <div class="ponan-top">
                <div>
                    <div class="ponan-name">PONAN</div>
                    <div class="ponan-level">NIVEAU <span id="ponanLevel">1</span></div>
                </div>
                <div class="ponan-bars">
                    <i class="ponan-bar hp"><b></b></i>
                    <i class="ponan-bar stamina"><b></b></i>
                    <i class="ponan-bar xp"><b></b></i>
                </div>
            </div>
            <div class="ponan-bottom">
                <span id="ponanZone">Village de Ponan</span>
                <span id="ponanFragments">◆ 0 / 3</span>
                <span id="ponanGold">◈ 0</span>
            </div>
        `;

        document.body.appendChild(hud);

        const css = document.createElement("style");
        css.id = "ponanRpgHUDStyle";
        css.textContent = `
            #ponanRpgHUD {
                position:fixed;top:18px;right:18px;width:270px;
                padding:13px 15px;z-index:3000;display:none;
                color:#e9e3d4;background:rgba(5,8,8,.86);
                border:1px solid rgba(185,151,62,.58);
                box-shadow:0 10px 35px rgba(0,0,0,.35);
                font-family:Georgia,serif;pointer-events:none;
            }
            .ponan-top { display:flex;justify-content:space-between;gap:12px; }
            .ponan-name { font-size:15px;letter-spacing:2px; }
            .ponan-level { margin-top:5px;color:#b9973e;font-size:10px;letter-spacing:1px; }
            .ponan-bars { width:150px;padding-top:3px; }
            .ponan-bar { display:block;height:6px;margin-bottom:5px;background:rgba(255,255,255,.08); }
            .ponan-bar b { display:block;height:100%;width:100%;transition:width .18s; }
            .ponan-bar.hp b { background:#a7443f; }
            .ponan-bar.stamina b { background:#76a77a; }
            .ponan-bar.xp b { background:#b9973e; }
            .ponan-bottom {
                margin-top:8px;display:flex;justify-content:space-between;gap:7px;
                color:rgba(238,230,210,.65);font-size:9px;letter-spacing:.7px;
            }
        `;
        document.head.appendChild(css);

        return hud;
    }

    function setHUD(visible) {
        ensureHUD().style.display = visible ? "block" : "none";
    }

    function updateHUD() {
        if (!state.active) return;

        const hud = ensureHUD();
        const p = getPlayer();

        const maxHP = Number(p?.maxHP ?? p?.maxHealth ?? P.maxHP ?? 100);
        const hp = clamp(Number(p?.hp ?? p?.health ?? state.hp), 0, maxHP);

        state.hp = hp;

        const hpBar = hud.querySelector(".hp b");
        const stBar = hud.querySelector(".stamina b");
        const xpBar = hud.querySelector(".xp b");

        if (hpBar) hpBar.style.width = `${(hp / maxHP) * 100}%`;
        if (stBar) stBar.style.width =
            `${(state.stamina / (P.maxStamina || 100)) * 100}%`;
        if (xpBar) xpBar.style.width =
            `${(state.xp / Math.max(1, xpRequired())) * 100}%`;

        const level = document.getElementById("ponanLevel");
        const zone = document.getElementById("ponanZone");
        const fragments = document.getElementById("ponanFragments");
        const gold = document.getElementById("ponanGold");

        if (level) level.textContent = state.level;

        if (zone) {
            const z = (C.world?.zones || []).find(x => x.id === state.zone);
            zone.textContent = z?.name || state.zone;
        }

        if (fragments)
            fragments.textContent = `◆ ${state.fragments} / ${PROG.maxFragments || 3}`;

        if (gold)
            gold.textContent = `◈ ${state.gold}`;
    }

    function updateCamera() {
        if (!CAMERA.follow) return;

        const G = window.Game;
        const p = getPlayer();

        if (!G?.canvas || !G.camera || !p) return;

        const targetX = Number(p.x) - G.canvas.width / 2;
        const targetY = Number(p.y) - G.canvas.height / 2;
        const smooth = clamp(Number(CAMERA.smooth) || .14, .02, 1);

        G.camera.x += (targetX - G.camera.x) * smooth;
        G.camera.y += (targetY - G.camera.y) * smooth;

        if (CAMERA.clampToWorld && G.worldWidth && G.worldHeight) {
            G.camera.x = clamp(
                G.camera.x, 0, Math.max(0, G.worldWidth - G.canvas.width)
            );
            G.camera.y = clamp(
                G.camera.y, 0, Math.max(0, G.worldHeight - G.canvas.height)
            );
        }
    }

    function attack(heavy = false) {
        if (!state.active || state.attackCooldown > 0 || state.dodging) return;

        const cost = heavy ? 25 : 12;
        if (state.stamina < cost) return;

        state.stamina -= cost;
        state.attackCooldown = heavy ? .58 : (COMBAT.attackCooldown || .32);
        state.combo += 1;
        state.comboTimer = COMBAT.comboWindow || .55;
        state.attacking = !heavy;
        state.heavyAttacking = heavy;

        const called = callPlayer(
            heavy
                ? ["heavyAttack", "strongAttack", "attackHeavy"]
                : ["attack", "attackPlayer", "strike"],
            heavy
        );

        if (!called)
            message(heavy ? "ATTAQUE LOURDE" : `ATTAQUE ×${state.combo}`);

        setTimeout(() => {
            state.attacking = false;
            state.heavyAttacking = false;
        }, heavy ? 260 : 150);
    }

    function dodge() {
        if (!state.active || state.dodging) return;

        const cost = P.dodgeCost || 30;
        if (state.stamina < cost) return;

        state.stamina -= cost;
        state.dodging = true;
        callPlayer(["dodge", "roll", "evade"]);

        setTimeout(() => state.dodging = false,
            (P.dodgeDuration || .18) * 1000);
    }

    function updateCombat(dt) {
        state.attackCooldown = Math.max(0, state.attackCooldown - dt);
        state.comboTimer = Math.max(0, state.comboTimer - dt);

        if (state.comboTimer <= 0)
            state.combo = 0;

        const moving =
            ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
             "KeyW","KeyA","KeyS","KeyD","z","q"]
            .some(k => state.keys.has(k));

        const sprint =
            state.keys.has("ShiftLeft") ||
            state.keys.has("ShiftRight");

        if (sprint && moving && state.stamina > 0) {
            state.stamina -= (P.sprintCost || 24) * dt;

            const p = getPlayer();

            if (p) {
                if ("speed" in p)
                    p.speed = (P.baseSpeed || 3.2) * (P.sprintMultiplier || 1.55);

                if ("moveSpeed" in p)
                    p.moveSpeed =
                        (P.baseSpeed || 3.2) * (P.sprintMultiplier || 1.55);
            }
        } else {
            state.stamina = Math.min(
                P.maxStamina || 100,
                state.stamina + (P.staminaRegen || 22) * dt
            );
        }

        state.stamina = clamp(
            state.stamina, 0, P.maxStamina || 100
        );
    }

    function update(dt) {
        if (!state.active) return;

        updateCamera();
        updateCombat(dt);
        updateHUD();

        const p = getPlayer();

        if (p) {
            if (state.lastX !== null && state.lastY !== null) {
                state.moving =
                    Math.abs(Number(p.x) - state.lastX) +
                    Math.abs(Number(p.y) - state.lastY) > .1;
            }

            state.lastX = Number(p.x);
            state.lastY = Number(p.y);
        }
    }

    function draw() {
        if (!state.active || (!state.attacking && !state.heavyAttacking))
            return;

        const G = window.Game;
        const p = getPlayer();

        if (!G?.ctx || !p) return;

        G.ctx.save();

        G.ctx.strokeStyle = state.heavyAttacking
            ? "rgba(216,180,90,.85)"
            : "rgba(238,230,210,.70)";

        G.ctx.lineWidth = state.heavyAttacking ? 7 : 4;

        const angle =
            Number(p.directionAngle ?? p.angle ?? 0);

        const radius = state.heavyAttacking ? 72 : 58;

        G.ctx.beginPath();
        G.ctx.arc(
            Number(p.x) || 0,
            Number(p.y) || 0,
            radius,
            angle - .75,
            angle + .75
        );
        G.ctx.stroke();
        G.ctx.restore();
    }

    function setGameplayActive(active) {
        state.active = Boolean(active);
        setHUD(state.active);

        if (state.active) {
            load();
            updateHUD();
            stopMenuAudio();
            startGameplayAudio();
            document.body.classList.remove("panon-menu", "panon-prologue");
            document.body.classList.add("panon-gameplay");
        } else {
            document.body.classList.remove("panon-gameplay");
        }
    }

    function stopMenuAudio() {
        document.querySelectorAll("audio,video").forEach(media => {
            try {
                if (
                    media.id === "menuMusic" ||
                    media.src.includes("menu.wav") ||
                    media.src.includes("menu.mp3") ||
                    media.id === "introVideoPlayer"
                ) {
                    media.pause();
                    media.currentTime = 0;
                }
            } catch (_) {}
        });
    }

    function startGameplayAudio() {
        if (!AUDIO.gameplay) return;

        let audio = document.getElementById("ponanGameplayMusic");

        if (!audio) {
            audio = document.createElement("audio");
            audio.id = "ponanGameplayMusic";
            audio.loop = true;
            audio.preload = "auto";
            audio.src = AUDIO.gameplay;
            audio.volume = Number(AUDIO.gameplayVolume) || .34;
            document.body.appendChild(audio);
        }

        audio.play().catch(() => {});
    }

    function addXP(amount) {
        state.xp += Math.max(0, Number(amount) || 0);

        while (state.xp >= xpRequired()) {
            state.xp -= xpRequired();
            state.level += 1;
            message(`NIVEAU ${state.level} — Le destin de Ponan progresse.`);
        }

        save();
    }

    function addFragment() {
        if (state.fragments >= (PROG.maxFragments || 3)) return;
        state.fragments += 1;
        addXP(80);
        message(`Fragment obtenu — ${state.fragments}/3`);
        save();
    }

    function installInput() {
        window.addEventListener("keydown", event => {
            state.keys.add(event.code);
            state.keys.add(event.key);

            if (!state.active || event.repeat) return;

            if (event.code === COMBAT.attackKey)
                attack(false);

            if (event.code === COMBAT.heavyAttackKey)
                attack(true);

            if (event.code === COMBAT.dodgeKey)
                dodge();

            if (event.code === COMBAT.interactKey)
                callPlayer(["interact", "interactNearest"]);
        });

        window.addEventListener("keyup", event => {
            state.keys.delete(event.code);
            state.keys.delete(event.key);
        });
    }

    function disableNarrator() {
        if (!window.Prologue) return;

        if ("narratorEnabled" in window.Prologue)
            window.Prologue.narratorEnabled = false;

        if (
            typeof window.speechSynthesis !== "undefined" &&
            window.Prologue.narratorSpeaking
        ) {
            window.speechSynthesis.cancel();
            window.Prologue.narratorSpeaking = false;
        }
    }

    function installIntroAudioProtection() {
        const stop = () => stopMenuAudio();

        const skip = document.getElementById("skipIntro");
        const video = document.getElementById("introVideoPlayer");

        if (skip) skip.addEventListener("click", stop);
        if (video) video.addEventListener("ended", stop);
    }

    function syncGameplayMode() {
        const gameplay =
            Boolean(window.Game?.running) &&
            !(window.Prologue && window.Prologue.active);

        if (gameplay !== state.active)
            setGameplayActive(gameplay);
    }

    function boot() {
        ensureHUD();
        installInput();
        installIntroAudioProtection();

        setInterval(disableNarrator, 1000);
        setInterval(syncGameplayMode, 250);

        console.log("[PONAN] Gameplay global chargé.");
    }

    window.PonanGameplayRuntime = {
        state,
        update,
        draw,
        attack,
        dodge,
        addXP,
        addFragment,
        save,
        load,
        setGameplayActive,
        getPlayer
    };

    boot();
})();
