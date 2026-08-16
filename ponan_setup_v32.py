#!/usr/bin/env python3
"""
PONAN'S LEGACY — GLOBAL GAMEPLAY SETUP V3
Usage:
    cd /home/paulo/ponanini
    python3 ponan_setup.py
"""

from pathlib import Path
from datetime import datetime
import re
import shutil
import subprocess
import sys

ROOT = Path(sys.argv[1]).expanduser().resolve() if len(sys.argv) > 1 else Path.cwd()

CONFIG_NAME = "ponan_gameplay_config.js"
RUNTIME_NAME = "ponan_gameplay_runtime.js"

CONFIG = '/* =========================================================\n   PONAN\'S LEGACY — GAMEPLAY CONFIGURATION\n   Source unique des paramètres RPG.\n========================================================= */\n\nwindow.PonanGameplayConfig = Object.freeze({\n    version: "3.0",\n\n    player: {\n        baseSpeed: 3.2,\n        sprintMultiplier: 1.55,\n        maxHP: 100,\n        maxStamina: 100,\n        staminaRegen: 22,\n        sprintCost: 24,\n        dodgeCost: 30,\n        dodgeDuration: 0.18,\n        attackCooldown: 0.32\n    },\n\n    combat: {\n        enabled: true,\n        attackKey: "KeyJ",\n        heavyAttackKey: "KeyK",\n        dodgeKey: "Space",\n        interactKey: "KeyE",\n        attackRange: 82,\n        attackDamage: 18,\n        heavyDamage: 34,\n        comboWindow: 0.55\n    },\n\n    progression: {\n        level: 1,\n        xp: 0,\n        xpBase: 100,\n        xpGrowth: 1.35,\n        gold: 0,\n        fragments: 0,\n        maxFragments: 3\n    },\n\n    camera: {\n        follow: true,\n        smooth: 0.14,\n        clampToWorld: true\n    },\n\n    world: {\n        startingZone: "village_ponan",\n        zones: [\n            { id: "village_ponan", name: "Village de Ponan", objective: "Parler à Marek, l\'ancien du lac" },\n            { id: "grand_lac", name: "Grand Lac", objective: "Découvrir les traces de Ponanini III" },\n            { id: "foret_murmures", name: "Forêt des Murmures", objective: "Trouver le premier fragment" },\n            { id: "ruines_royales", name: "Ruines de l\'ancien roi", objective: "Révéler la vérité sur le bannissement" },\n            { id: "sanctuaire_fragment", name: "Sanctuaire des Fragments", objective: "Réunir les trois fragments" }\n        ]\n    },\n\n    story: {\n        protagonist: "Ponan",\n        fallenKing: "Ponanini III",\n        usurper: "Ponanini IV",\n        mainQuest: "Découvrir la vérité sur l\'héritage de Ponan"\n    },\n\n    audio: {\n        menu: "assets/audio/menu.wav",\n        gameplay: "assets/audio/gameplay.mp3",\n        intro: "assets/audio/intro.mp3",\n        menuVolume: 0.42,\n        gameplayVolume: 0.34,\n        introVolume: 0.45\n    }\n});\n'
RUNTIME = '/* =========================================================\n   PONAN\'S LEGACY — GAMEPLAY RUNTIME\n   Couche d\'amélioration branchée dans le vrai moteur.\n========================================================= */\n\n(() => {\n    "use strict";\n\n    if (window.PonanGameplayRuntime) return;\n\n    const C = window.PonanGameplayConfig || {};\n    const P = C.player || {};\n    const COMBAT = C.combat || {};\n    const PROG = C.progression || {};\n    const CAMERA = C.camera || {};\n    const AUDIO = C.audio || {};\n\n    const state = {\n        active: false,\n        zone: C.world?.startingZone || "village_ponan",\n        hp: P.maxHP || 100,\n        stamina: P.maxStamina || 100,\n        xp: PROG.xp || 0,\n        level: PROG.level || 1,\n        gold: PROG.gold || 0,\n        fragments: PROG.fragments || 0,\n        attackCooldown: 0,\n        comboTimer: 0,\n        combo: 0,\n        attacking: false,\n        heavyAttacking: false,\n        dodging: false,\n        keys: new Set(),\n        lastX: null,\n        lastY: null\n    };\n\n    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));\n\n    function getPlayer() {\n        const candidates = [\n            window.player,\n            window.Player,\n            window.Game?.player,\n            window.game?.player,\n            window.character,\n            window.hero\n        ];\n\n        for (const p of candidates) {\n            if (\n                p &&\n                Number.isFinite(Number(p.x)) &&\n                Number.isFinite(Number(p.y))\n            ) return p;\n        }\n        return null;\n    }\n\n    function callPlayer(names, ...args) {\n        const p = getPlayer();\n        if (!p) return false;\n\n        for (const name of names) {\n            if (typeof p[name] === "function") {\n                try {\n                    p[name](...args);\n                    return true;\n                } catch (e) {\n                    console.warn("[PONAN] action joueur échouée:", name, e);\n                }\n            }\n        }\n        return false;\n    }\n\n    function save() {\n        try {\n            localStorage.setItem("ponan_gameplay_save", JSON.stringify({\n                version: 3,\n                level: state.level,\n                xp: state.xp,\n                hp: state.hp,\n                stamina: state.stamina,\n                gold: state.gold,\n                fragments: state.fragments,\n                zone: state.zone,\n                timestamp: Date.now()\n            }));\n        } catch (_) {}\n    }\n\n    function load() {\n        try {\n            const raw = localStorage.getItem("ponan_gameplay_save");\n            if (!raw) return;\n            const s = JSON.parse(raw);\n\n            state.level = Number(s.level) || 1;\n            state.xp = Number(s.xp) || 0;\n            state.hp = Number(s.hp) || P.maxHP || 100;\n            state.stamina = Number(s.stamina) || P.maxStamina || 100;\n            state.gold = Number(s.gold) || 0;\n            state.fragments = Number(s.fragments) || 0;\n            state.zone = s.zone || state.zone;\n        } catch (_) {}\n    }\n\n    function xpRequired() {\n        return Math.floor(\n            (PROG.xpBase || 100) *\n            Math.pow(PROG.xpGrowth || 1.35, Math.max(0, state.level - 1))\n        );\n    }\n\n    function message(text) {\n        let el = document.getElementById("ponanGameplayMessage");\n\n        if (!el) {\n            el = document.createElement("div");\n            el.id = "ponanGameplayMessage";\n            el.style.cssText =\n                "position:fixed;left:50%;bottom:90px;transform:translateX(-50%);" +\n                "padding:12px 22px;background:rgba(5,7,10,.92);" +\n                "border:1px solid rgba(185,151,62,.7);color:#eee6d2;" +\n                "font:14px Georgia,serif;letter-spacing:1px;z-index:5000;" +\n                "opacity:0;pointer-events:none;transition:opacity .25s";\n            document.body.appendChild(el);\n        }\n\n        el.textContent = text;\n        el.style.opacity = "1";\n        clearTimeout(el._timer);\n        el._timer = setTimeout(() => el.style.opacity = "0", 2200);\n    }\n\n    function ensureHUD() {\n        let hud = document.getElementById("ponanRpgHUD");\n\n        if (hud) return hud;\n\n        hud = document.createElement("div");\n        hud.id = "ponanRpgHUD";\n        hud.innerHTML = `\n            <div class="ponan-top">\n                <div>\n                    <div class="ponan-name">PONAN</div>\n                    <div class="ponan-level">NIVEAU <span id="ponanLevel">1</span></div>\n                </div>\n                <div class="ponan-bars">\n                    <i class="ponan-bar hp"><b></b></i>\n                    <i class="ponan-bar stamina"><b></b></i>\n                    <i class="ponan-bar xp"><b></b></i>\n                </div>\n            </div>\n            <div class="ponan-bottom">\n                <span id="ponanZone">Village de Ponan</span>\n                <span id="ponanFragments">◆ 0 / 3</span>\n                <span id="ponanGold">◈ 0</span>\n            </div>\n        `;\n\n        document.body.appendChild(hud);\n\n        const css = document.createElement("style");\n        css.id = "ponanRpgHUDStyle";\n        css.textContent = `\n            #ponanRpgHUD {\n                position:fixed;top:18px;right:18px;width:270px;\n                padding:13px 15px;z-index:3000;display:none;\n                color:#e9e3d4;background:rgba(5,8,8,.86);\n                border:1px solid rgba(185,151,62,.58);\n                box-shadow:0 10px 35px rgba(0,0,0,.35);\n                font-family:Georgia,serif;pointer-events:none;\n            }\n            .ponan-top { display:flex;justify-content:space-between;gap:12px; }\n            .ponan-name { font-size:15px;letter-spacing:2px; }\n            .ponan-level { margin-top:5px;color:#b9973e;font-size:10px;letter-spacing:1px; }\n            .ponan-bars { width:150px;padding-top:3px; }\n            .ponan-bar { display:block;height:6px;margin-bottom:5px;background:rgba(255,255,255,.08); }\n            .ponan-bar b { display:block;height:100%;width:100%;transition:width .18s; }\n            .ponan-bar.hp b { background:#a7443f; }\n            .ponan-bar.stamina b { background:#76a77a; }\n            .ponan-bar.xp b { background:#b9973e; }\n            .ponan-bottom {\n                margin-top:8px;display:flex;justify-content:space-between;gap:7px;\n                color:rgba(238,230,210,.65);font-size:9px;letter-spacing:.7px;\n            }\n        `;\n        document.head.appendChild(css);\n\n        return hud;\n    }\n\n    function setHUD(visible) {\n        ensureHUD().style.display = visible ? "block" : "none";\n    }\n\n    function updateHUD() {\n        if (!state.active) return;\n\n        const hud = ensureHUD();\n        const p = getPlayer();\n\n        const maxHP = Number(p?.maxHP ?? p?.maxHealth ?? P.maxHP ?? 100);\n        const hp = clamp(Number(p?.hp ?? p?.health ?? state.hp), 0, maxHP);\n\n        state.hp = hp;\n\n        const hpBar = hud.querySelector(".hp b");\n        const stBar = hud.querySelector(".stamina b");\n        const xpBar = hud.querySelector(".xp b");\n\n        if (hpBar) hpBar.style.width = `${(hp / maxHP) * 100}%`;\n        if (stBar) stBar.style.width =\n            `${(state.stamina / (P.maxStamina || 100)) * 100}%`;\n        if (xpBar) xpBar.style.width =\n            `${(state.xp / Math.max(1, xpRequired())) * 100}%`;\n\n        const level = document.getElementById("ponanLevel");\n        const zone = document.getElementById("ponanZone");\n        const fragments = document.getElementById("ponanFragments");\n        const gold = document.getElementById("ponanGold");\n\n        if (level) level.textContent = state.level;\n\n        if (zone) {\n            const z = (C.world?.zones || []).find(x => x.id === state.zone);\n            zone.textContent = z?.name || state.zone;\n        }\n\n        if (fragments)\n            fragments.textContent = `◆ ${state.fragments} / ${PROG.maxFragments || 3}`;\n\n        if (gold)\n            gold.textContent = `◈ ${state.gold}`;\n    }\n\n    function updateCamera() {\n        if (!CAMERA.follow) return;\n\n        const G = window.Game;\n        const p = getPlayer();\n\n        if (!G?.canvas || !G.camera || !p) return;\n\n        const targetX = Number(p.x) - G.canvas.width / 2;\n        const targetY = Number(p.y) - G.canvas.height / 2;\n        const smooth = clamp(Number(CAMERA.smooth) || .14, .02, 1);\n\n        G.camera.x += (targetX - G.camera.x) * smooth;\n        G.camera.y += (targetY - G.camera.y) * smooth;\n\n        if (CAMERA.clampToWorld && G.worldWidth && G.worldHeight) {\n            G.camera.x = clamp(\n                G.camera.x, 0, Math.max(0, G.worldWidth - G.canvas.width)\n            );\n            G.camera.y = clamp(\n                G.camera.y, 0, Math.max(0, G.worldHeight - G.canvas.height)\n            );\n        }\n    }\n\n    function attack(heavy = false) {\n        if (!state.active || state.attackCooldown > 0 || state.dodging) return;\n\n        const cost = heavy ? 25 : 12;\n        if (state.stamina < cost) return;\n\n        state.stamina -= cost;\n        state.attackCooldown = heavy ? .58 : (COMBAT.attackCooldown || .32);\n        state.combo += 1;\n        state.comboTimer = COMBAT.comboWindow || .55;\n        state.attacking = !heavy;\n        state.heavyAttacking = heavy;\n\n        const called = callPlayer(\n            heavy\n                ? ["heavyAttack", "strongAttack", "attackHeavy"]\n                : ["attack", "attackPlayer", "strike"],\n            heavy\n        );\n\n        if (!called)\n            message(heavy ? "ATTAQUE LOURDE" : `ATTAQUE ×${state.combo}`);\n\n        setTimeout(() => {\n            state.attacking = false;\n            state.heavyAttacking = false;\n        }, heavy ? 260 : 150);\n    }\n\n    function dodge() {\n        if (!state.active || state.dodging) return;\n\n        const cost = P.dodgeCost || 30;\n        if (state.stamina < cost) return;\n\n        state.stamina -= cost;\n        state.dodging = true;\n        callPlayer(["dodge", "roll", "evade"]);\n\n        setTimeout(() => state.dodging = false,\n            (P.dodgeDuration || .18) * 1000);\n    }\n\n    function updateCombat(dt) {\n        state.attackCooldown = Math.max(0, state.attackCooldown - dt);\n        state.comboTimer = Math.max(0, state.comboTimer - dt);\n\n        if (state.comboTimer <= 0)\n            state.combo = 0;\n\n        const moving =\n            ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight",\n             "KeyW","KeyA","KeyS","KeyD","z","q"]\n            .some(k => state.keys.has(k));\n\n        const sprint =\n            state.keys.has("ShiftLeft") ||\n            state.keys.has("ShiftRight");\n\n        if (sprint && moving && state.stamina > 0) {\n            state.stamina -= (P.sprintCost || 24) * dt;\n\n            const p = getPlayer();\n\n            if (p) {\n                if ("speed" in p)\n                    p.speed = (P.baseSpeed || 3.2) * (P.sprintMultiplier || 1.55);\n\n                if ("moveSpeed" in p)\n                    p.moveSpeed =\n                        (P.baseSpeed || 3.2) * (P.sprintMultiplier || 1.55);\n            }\n        } else {\n            state.stamina = Math.min(\n                P.maxStamina || 100,\n                state.stamina + (P.staminaRegen || 22) * dt\n            );\n        }\n\n        state.stamina = clamp(\n            state.stamina, 0, P.maxStamina || 100\n        );\n    }\n\n    function update(dt) {\n        if (!state.active) return;\n\n        updateCamera();\n        updateCombat(dt);\n        updateHUD();\n\n        const p = getPlayer();\n\n        if (p) {\n            if (state.lastX !== null && state.lastY !== null) {\n                state.moving =\n                    Math.abs(Number(p.x) - state.lastX) +\n                    Math.abs(Number(p.y) - state.lastY) > .1;\n            }\n\n            state.lastX = Number(p.x);\n            state.lastY = Number(p.y);\n        }\n    }\n\n    function draw() {\n        if (!state.active || (!state.attacking && !state.heavyAttacking))\n            return;\n\n        const G = window.Game;\n        const p = getPlayer();\n\n        if (!G?.ctx || !p) return;\n\n        G.ctx.save();\n\n        G.ctx.strokeStyle = state.heavyAttacking\n            ? "rgba(216,180,90,.85)"\n            : "rgba(238,230,210,.70)";\n\n        G.ctx.lineWidth = state.heavyAttacking ? 7 : 4;\n\n        const angle =\n            Number(p.directionAngle ?? p.angle ?? 0);\n\n        const radius = state.heavyAttacking ? 72 : 58;\n\n        G.ctx.beginPath();\n        G.ctx.arc(\n            Number(p.x) || 0,\n            Number(p.y) || 0,\n            radius,\n            angle - .75,\n            angle + .75\n        );\n        G.ctx.stroke();\n        G.ctx.restore();\n    }\n\n    function setGameplayActive(active) {\n        state.active = Boolean(active);\n        setHUD(state.active);\n\n        if (state.active) {\n            load();\n            updateHUD();\n            stopMenuAudio();\n            startGameplayAudio();\n            document.body.classList.remove("panon-menu", "panon-prologue");\n            document.body.classList.add("panon-gameplay");\n        } else {\n            document.body.classList.remove("panon-gameplay");\n        }\n    }\n\n    function stopMenuAudio() {\n        document.querySelectorAll("audio,video").forEach(media => {\n            try {\n                if (\n                    media.id === "menuMusic" ||\n                    media.src.includes("menu.wav") ||\n                    media.src.includes("menu.mp3") ||\n                    media.id === "introVideoPlayer"\n                ) {\n                    media.pause();\n                    media.currentTime = 0;\n                }\n            } catch (_) {}\n        });\n    }\n\n    function startGameplayAudio() {\n        if (!AUDIO.gameplay) return;\n\n        let audio = document.getElementById("ponanGameplayMusic");\n\n        if (!audio) {\n            audio = document.createElement("audio");\n            audio.id = "ponanGameplayMusic";\n            audio.loop = true;\n            audio.preload = "auto";\n            audio.src = AUDIO.gameplay;\n            audio.volume = Number(AUDIO.gameplayVolume) || .34;\n            document.body.appendChild(audio);\n        }\n\n        audio.play().catch(() => {});\n    }\n\n    function addXP(amount) {\n        state.xp += Math.max(0, Number(amount) || 0);\n\n        while (state.xp >= xpRequired()) {\n            state.xp -= xpRequired();\n            state.level += 1;\n            message(`NIVEAU ${state.level} — Le destin de Ponan progresse.`);\n        }\n\n        save();\n    }\n\n    function addFragment() {\n        if (state.fragments >= (PROG.maxFragments || 3)) return;\n        state.fragments += 1;\n        addXP(80);\n        message(`Fragment obtenu — ${state.fragments}/3`);\n        save();\n    }\n\n    function installInput() {\n        window.addEventListener("keydown", event => {\n            state.keys.add(event.code);\n            state.keys.add(event.key);\n\n            if (!state.active || event.repeat) return;\n\n            if (event.code === COMBAT.attackKey)\n                attack(false);\n\n            if (event.code === COMBAT.heavyAttackKey)\n                attack(true);\n\n            if (event.code === COMBAT.dodgeKey)\n                dodge();\n\n            if (event.code === COMBAT.interactKey)\n                callPlayer(["interact", "interactNearest"]);\n        });\n\n        window.addEventListener("keyup", event => {\n            state.keys.delete(event.code);\n            state.keys.delete(event.key);\n        });\n    }\n\n    function disableNarrator() {\n        if (!window.Prologue) return;\n\n        if ("narratorEnabled" in window.Prologue)\n            window.Prologue.narratorEnabled = false;\n\n        if (\n            typeof window.speechSynthesis !== "undefined" &&\n            window.Prologue.narratorSpeaking\n        ) {\n            window.speechSynthesis.cancel();\n            window.Prologue.narratorSpeaking = false;\n        }\n    }\n\n    function installIntroAudioProtection() {\n        const stop = () => stopMenuAudio();\n\n        const skip = document.getElementById("skipIntro");\n        const video = document.getElementById("introVideoPlayer");\n\n        if (skip) skip.addEventListener("click", stop);\n        if (video) video.addEventListener("ended", stop);\n    }\n\n    function syncGameplayMode() {\n        const gameplay =\n            Boolean(window.Game?.running) &&\n            !(window.Prologue && window.Prologue.active);\n\n        if (gameplay !== state.active)\n            setGameplayActive(gameplay);\n    }\n\n    function boot() {\n        ensureHUD();\n        installInput();\n        installIntroAudioProtection();\n\n        setInterval(disableNarrator, 1000);\n        setInterval(syncGameplayMode, 250);\n\n        console.log("[PONAN] Gameplay global chargé.");\n    }\n\n    window.PonanGameplayRuntime = {\n        state,\n        update,\n        draw,\n        attack,\n        dodge,\n        addXP,\n        addFragment,\n        save,\n        load,\n        setGameplayActive,\n        getPlayer\n    };\n\n    boot();\n})();\n'
CSS_PATCH = "\n/* PONAN'S LEGACY — GAMEPLAY GLOBAL */\n#ponanRpgHUD { display:none; }\nbody.panon-menu #ponanRpgHUD,\nbody.panon-prologue #ponanRpgHUD { display:none !important; }\n"

CORE = [
    "index.html", "game.js", "style.css", "prologue.js",
    "map.js", "player.js", "npc.js", "inventory.js",
    "ui.js", "quest.js", "enemy.js", "boss.js"
]

def backup(path, dest):
    if path.exists():
        shutil.copy2(path, dest / path.name)

def remove_tag(text, filename):
    pattern = rf'\s*<script\s+src=["\']{re.escape(filename)}["\']\s*></script>\s*'
    return re.sub(pattern, "\n", text, flags=re.I)

def patch_game(path):
    text = path.read_text(encoding="utf-8")

    update_marker = '        if (typeof updatePlayer === "function") updatePlayer();'
    update_injection = update_marker + """
        if (
            typeof PonanGameplayRuntime !== "undefined" &&
            typeof PonanGameplayRuntime.update === "function"
        ) {
            PonanGameplayRuntime.update(dt);
        }"""

    if "PonanGameplayRuntime.update(dt);" not in text:
        if update_marker not in text:
            raise RuntimeError("Appel updatePlayer() introuvable dans game.js.")
        text = text.replace(update_marker, update_injection, 1)

    draw_marker = '        if (typeof drawPlayer === "function") drawPlayer();'
    draw_injection = draw_marker + """
        if (
            typeof PonanGameplayRuntime !== "undefined" &&
            typeof PonanGameplayRuntime.draw === "function"
        ) {
            PonanGameplayRuntime.draw();
        }"""

    if "PonanGameplayRuntime.draw();" not in text:
        if draw_marker not in text:
            raise RuntimeError("Appel drawPlayer() introuvable dans game.js.")
        text = text.replace(draw_marker, draw_injection, 1)

    path.write_text(text, encoding="utf-8")

def patch_index(path):
    text = path.read_text(encoding="utf-8")

    for name in [
        CONFIG_NAME, RUNTIME_NAME, "ponan_camera.js",
        "ponan_true_rpg.js", "gameplay_v2.js", "game_enhancements.js"
    ]:
        text = remove_tag(text, name)

    match = re.search(
        r'<script\s+src=["\']game\.js["\']\s*></script>',
        text,
        flags=re.I
    )
    if not match:
        raise RuntimeError("Balise game.js introuvable dans index.html.")

    replacement = (
        f'<script src="{CONFIG_NAME}"></script>\n'
        f'<script src="game.js"></script>\n'
        f'<script src="{RUNTIME_NAME}"></script>'
    )

    text = text[:match.start()] + replacement + text[match.end():]
    path.write_text(text, encoding="utf-8")

def patch_css(path):
    text = path.read_text(encoding="utf-8") if path.exists() else ""
    if "PONAN'S LEGACY — GAMEPLAY GLOBAL" not in text:
        path.write_text(text + "\n" + CSS_PATCH, encoding="utf-8")

def check_js(root):
    try:
        subprocess.run(["node", "--version"], capture_output=True, check=True)
    except Exception:
        print("[INFO] Node.js absent : vérification JS ignorée.")
        return True

    failed = False
    for name in ["game.js", "prologue.js", CONFIG_NAME, RUNTIME_NAME]:
        path = root / name
        if not path.exists():
            continue

        proc = subprocess.run(
            ["node", "--check", str(path)],
            capture_output=True,
            text=True
        )

        if proc.returncode == 0:
            print("[OK]", name)
        else:
            failed = True
            print("[ERREUR]", name)
            print(proc.stderr)

    return not failed

def main():
    if not (ROOT / "index.html").exists() or not (ROOT / "game.js").exists():
        raise SystemExit(f"Projet introuvable : {ROOT}")

    print("=" * 62)
    print(" PONAN'S LEGACY — GLOBAL GAMEPLAY SETUP V3")
    print("=" * 62)

    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = ROOT / f".ponan_backup_{stamp}"
    backup_dir.mkdir(exist_ok=True)

    for name in CORE:
        backup(ROOT / name, backup_dir)

    print("[BACKUP]", backup_dir.name)

    for name in [
        "ponan_true_rpg.js", "true_rpg_overhaul.py",
        "gameplay_v2.js", "game_enhancements.js", "ponan_camera.js"
    ]:
        p = ROOT / name
        if p.exists():
            p.unlink()
            print("[REMOVE]", name)

    (ROOT / CONFIG_NAME).write_text(CONFIG, encoding="utf-8")
    (ROOT / RUNTIME_NAME).write_text(RUNTIME, encoding="utf-8")

    patch_game(ROOT / "game.js")
    patch_index(ROOT / "index.html")
    patch_css(ROOT / "style.css")

    print("[OK] Configuration RPG créée")
    print("[OK] Runtime intégré dans la vraie boucle update/draw")
    print("[OK] Moteur existant conservé")
    print("[OK] HUD isolé du menu/prologue")
    print("[OK] Caméra suiveuse configurée")
    print("[OK] Combat / endurance / progression configurés")
    print("[OK] Audio menu/intro/gameplay séparé")
    print("[OK] Narrateur désactivé")

    if not check_js(ROOT):
        print("[STOP] Erreur JavaScript : rien d'autre n'est exécuté.")
        print("[BACKUP]", backup_dir)
        raise SystemExit(2)

    print()
    print("INSTALLATION TERMINÉE")
    print("Une seule action maintenant : Ctrl+Shift+R")
    print("Backup :", backup_dir)
    print()

if __name__ == "__main__":
    main()
