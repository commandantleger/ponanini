#!/usr/bin/env python3
"""PONAN'S LEGACY — V2 gameplay + audio fix.

Usage:
    python3 upgrade_ponan_v2.py
    python3 upgrade_ponan_v2.py /home/paulo/ponanini
"""
from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(sys.argv[1]).expanduser().resolve() if len(sys.argv) > 1 else Path('/home/paulo/ponanini')
INDEX = ROOT / 'index.html'
STYLE = ROOT / 'style.css'
V2 = ROOT / 'gameplay_v2.js'
BACKUP = '.before_v2'


def log(msg):
    print(msg)


def backup(path):
    if not path.exists():
        log(f'[SKIP] {path.name} absent')
        return
    dst = path.with_name(path.name + BACKUP)
    if not dst.exists():
        shutil.copy2(path, dst)
        log(f'[BACKUP] {dst.name}')


GAMEPLAY_JS = r'''(() => {
    "use strict";

    const V2 = {
        hp: 5,
        maxHp: 5,
        xp: 0,
        level: 1,
        stamina: 100,
        attackUntil: 0,
        attackCooldown: 0,
        dashUntil: 0,
        invulnerableUntil: 0,
        lastDamage: 0,
        slashes: []
    };

    let sprint = false;
    const now = () => performance.now();
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    function active() {
        return !!(window.Game && Game.running && !window.dialogueOpen && !window.gameFinished);
    }

    function playerRef() {
        return typeof window.player !== "undefined" ? window.player : null;
    }

    /* ================= AUDIO ================= */

    function stopIntro() {
        const a = document.getElementById('introVideoPlayer');
        if (!a) return;
        try { a.pause(); a.currentTime = 0; a.volume = 0; } catch (_) {}
    }

    function stopMenu() {
        const a = document.getElementById('menuMusic');
        if (!a) return;
        try { a.pause(); a.currentTime = 0; a.volume = 0; } catch (_) {}
    }

    function startGameAudio() {
        stopMenu();
        let a = document.getElementById('gameplayMusic');
        if (!a) {
            a = document.createElement('audio');
            a.id = 'gameplayMusic';
            a.loop = true;
            a.preload = 'auto';
            a.src = 'assets/audio/gameplay.waw';
            a.volume = 0.28;
            document.body.appendChild(a);
        }
        a.play().catch(() => {});
    }

    function stopGameAudio() {
        const a = document.getElementById('gameplayMusic');
        if (!a) return;
        try { a.pause(); a.currentTime = 0; } catch (_) {}
    }

    function audioGuard() {
        const skip = document.getElementById('skipIntro');
        if (skip && !skip.dataset.v2Audio) {
            skip.dataset.v2Audio = '1';
            skip.addEventListener('click', stopIntro, true);
        }

        document.addEventListener('click', e => {
            const button = e.target.closest ? e.target.closest('#playButton,#continueButton') : null;
            if (button) {
                stopIntro();
                stopMenu();
                stopGameAudio();
            }
            if (window.Game && Game.running) {
                stopMenu();
                startGameAudio();
            }
        }, true);

        document.addEventListener('pointerdown', () => {
            if (window.Game && Game.running) stopMenu();
        }, true);

        document.addEventListener('keydown', () => {
            if (window.Game && Game.running) stopMenu();
        }, true);

        // Empêche l'ancien listener du menu de relancer sa musique en jeu.
        setInterval(() => {
            if (window.Game && Game.running) stopMenu();
        }, 250);
    }

    /* ================= HUD ================= */

    function createHUD() {
        if (document.getElementById('v2-hud')) return;
        const el = document.createElement('div');
        el.id = 'v2-hud';
        el.innerHTML = `
            <div class="v2-head">
                <span id="v2-zone">PONAN</span>
                <span id="v2-level">NIVEAU 1</span>
            </div>
            <small>VIE</small><div class="v2-bar"><i id="v2-hp"></i></div>
            <small>XP</small><div class="v2-bar"><i id="v2-xp"></i></div>
            <small>ENDURANCE</small><div class="v2-bar"><i id="v2-stamina"></i></div>
            <div class="v2-help">J / CLIC : attaquer<br>SHIFT : courir · SPACE : esquiver</div>
        `;
        document.body.appendChild(el);
    }

    function updateHUD() {
        const hp = document.getElementById('v2-hp');
        const xp = document.getElementById('v2-xp');
        const st = document.getElementById('v2-stamina');
        const lv = document.getElementById('v2-level');
        const zone = document.getElementById('v2-zone');
        if (hp) hp.style.width = `${V2.hp / V2.maxHp * 100}%`;
        if (xp) xp.style.width = `${V2.xp}%`;
        if (st) st.style.width = `${V2.stamina}%`;
        if (lv) lv.textContent = `NIVEAU ${V2.level}`;
        if (zone) {
            const names = { village: 'VILLAGE', forest: 'FORÊT', lake: 'LAC', nether: 'NETHER' };
            zone.textContent = names[window.currentMap] || String(window.currentMap || 'PONAN').toUpperCase();
        }
    }

    /* ================= COMBAT ================= */

    function notify(text) {
        let el = document.getElementById('v2-toast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'v2-toast';
            document.body.appendChild(el);
        }
        el.textContent = text;
        el.classList.add('show');
        clearTimeout(el._timer);
        el._timer = setTimeout(() => el.classList.remove('show'), 1600);
    }

    function gainXP(amount) {
        V2.xp += amount;
        while (V2.xp >= 100) {
            V2.xp -= 100;
            V2.level++;
            V2.maxHp++;
            V2.hp = V2.maxHp;
            notify(`NIVEAU ${V2.level} — Votre force augmente.`);
        }
    }

    function attack() {
        if (!active() || now() < V2.attackCooldown) return;
        const p = playerRef();
        if (!p) return;
        V2.attackCooldown = now() + 400;
        V2.attackUntil = now() + 180;
        V2.slashes.push({ life: .22 });

        const list = Array.isArray(window.enemies) ? window.enemies : null;
        if (!list) return;

        for (const enemy of list) {
            if (!enemy || enemy.dead) continue;
            const dx = (enemy.x || 0) - p.x;
            const dy = (enemy.y || 0) - p.y;
            if (Math.hypot(dx, dy) > 90) continue;

            let front = true;
            if (p.direction === 'up') front = dy < 25;
            if (p.direction === 'down') front = dy > -25;
            if (p.direction === 'left') front = dx < 25;
            if (p.direction === 'right') front = dx > -25;
            if (!front) continue;

            if (typeof enemy.hp === 'number') enemy.hp -= 1;
            else if (typeof enemy.health === 'number') enemy.health -= 1;
            else if (typeof enemy.life === 'number') enemy.life -= 1;
            else { enemy.hit = true; enemy.hitUntil = now() + 150; continue; }

            enemy.hit = true;
            enemy.hitUntil = now() + 150;
            if (enemy.hp <= 0 || enemy.health <= 0 || enemy.life <= 0) {
                enemy.dead = true;
                gainXP(25);
                if (typeof window.addItem === 'function') window.addItem('✦ Essence de créature');
                notify('+25 XP — Ennemi vaincu');
            }
        }
    }

    function damagePlayer(amount = 1) {
        if (!active() || now() < V2.invulnerableUntil || now() - V2.lastDamage < 650) return;
        V2.lastDamage = now();
        V2.invulnerableUntil = now() + 850;
        V2.hp = clamp(V2.hp - amount, 0, V2.maxHp);
        if (V2.hp <= 0) {
            V2.hp = V2.maxHp;
            const p = playerRef();
            if (p) { p.x = 128; p.y = 128; }
            notify('Vous vous réveillez au village.');
        }
    }

    function updateEnemiesCombat() {
        const p = playerRef();
        const list = Array.isArray(window.enemies) ? window.enemies : null;
        if (!p || !list) return;
        for (const enemy of list) {
            if (!enemy || enemy.dead) continue;
            if (Math.hypot((enemy.x || 0) - p.x, (enemy.y || 0) - p.y) < 52) damagePlayer(1);
        }
        for (let i = list.length - 1; i >= 0; i--) if (list[i] && list[i].dead) list.splice(i, 1);
    }

    /* ================= MOVEMENT ================= */

    function dash() {
        if (!active() || V2.stamina < 25) return;
        V2.stamina -= 25;
        V2.dashUntil = now() + 180;
        V2.invulnerableUntil = now() + 300;
    }

    function movementModifiers() {
        const p = playerRef();
        if (!p) return;
        if (p._v2BaseSpeed === undefined) p._v2BaseSpeed = p.speed;
        if (now() < V2.dashUntil) p.speed = p._v2BaseSpeed * 2.7;
        else if (sprint && V2.stamina > 0 && active()) {
            p.speed = p._v2BaseSpeed * 1.55;
            V2.stamina = clamp(V2.stamina - .65, 0, 100);
        } else {
            p.speed = p._v2BaseSpeed;
            if (!p.moving) V2.stamina = clamp(V2.stamina + .45, 0, 100);
        }
    }

    function input() {
        window.addEventListener('keydown', e => {
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') sprint = true;
            if (e.code === 'Space' && !e.repeat && active()) { e.preventDefault(); dash(); }
            if ((e.key.toLowerCase() === 'j' || e.key.toLowerCase() === 'f') && !e.repeat) attack();
        });
        window.addEventListener('keyup', e => {
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') sprint = false;
        });
        window.addEventListener('mousedown', e => {
            if (e.button === 0 && active()) attack();
        });
    }

    /* ================= DRAW FEEDBACK ================= */

    function effects() {
        if (!window.Game) return;
        const ctx = Game.ctx;
        const p = playerRef();
        if (!p) return;
        for (const s of V2.slashes) {
            ctx.save();
            ctx.globalAlpha = clamp(s.life / .22, 0, 1);
            ctx.strokeStyle = '#e5c861';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(p.x - Game.camera.x + 20, p.y - Game.camera.y + 20, 38, 0, Math.PI * 1.25);
            ctx.stroke();
            ctx.restore();
            s.life -= .016;
        }
        V2.slashes = V2.slashes.filter(s => s.life > 0);

        if (now() < V2.invulnerableUntil) {
            ctx.save();
            ctx.globalAlpha = Math.floor(now() / 80) % 2 ? .12 : .30;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(p.x - Game.camera.x + 20, p.y - Game.camera.y + 20, 28, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    /* ================= WRAPPERS ================= */

    function wrapPlayer() {
        if (typeof window.updatePlayer !== 'function' || window.updatePlayer.__v2) return;
        const original = window.updatePlayer;
        function wrapped() { movementModifiers(); original(); }
        wrapped.__v2 = true;
        window.updatePlayer = wrapped;
    }

    function wrapEnemies() {
        if (typeof window.updateEnemies !== 'function' || window.updateEnemies.__v2) return;
        const original = window.updateEnemies;
        function wrapped() { original(); updateEnemiesCombat(); }
        wrapped.__v2 = true;
        window.updateEnemies = wrapped;
    }

    function wrapDraw() {
        if (typeof window.drawPlayer !== 'function' || window.drawPlayer.__v2) return;
        const original = window.drawPlayer;
        function wrapped() { original(); effects(); }
        wrapped.__v2 = true;
        window.drawPlayer = wrapped;
    }

    /* ================= BOOT ================= */

    function boot() {
        createHUD();
        input();
        audioGuard();
        setInterval(() => {
            wrapPlayer();
            wrapEnemies();
            wrapDraw();
            updateHUD();
            if (window.Game && Game.running) {
                stopMenu();
                startGameAudio();
            }
        }, 100);
        console.log('⚔️ PONAN V2 — gameplay + audio actif');
    }

    const createHUD = () => {
        if (document.getElementById('v2-hud')) return;
        const el = document.createElement('div');
        el.id = 'v2-hud';
        el.innerHTML = '<div class="v2-head"><span id="v2-zone">PONAN</span><span id="v2-level">NIVEAU 1</span></div><small>VIE</small><div class="v2-bar"><i id="v2-hp"></i></div><small>XP</small><div class="v2-bar"><i id="v2-xp"></i></div><small>ENDURANCE</small><div class="v2-bar"><i id="v2-stamina"></i></div><div class="v2-help">J / CLIC : attaquer<br>SHIFT : courir · SPACE : esquiver</div>';
        document.body.appendChild(el);
    };

    const wait = setInterval(() => {
        if (window.Game) { clearInterval(wait); boot(); }
    }, 100);
})();
'''

STYLE_CSS = r'''
/* PONAN'S LEGACY — GAMEPLAY V2 */
#v2-hud{position:fixed;right:20px;top:20px;width:210px;padding:13px;z-index:5000;pointer-events:none;color:#eee6ca;background:rgba(10,13,12,.88);border:1px solid rgba(218,187,91,.55);box-shadow:0 10px 35px rgba(0,0,0,.4);font-family:Georgia,serif;letter-spacing:.06em}
#v2-hud .v2-head{display:flex;justify-content:space-between;margin-bottom:10px;font-size:10px}
#v2-level{color:#d9bc5d}#v2-hud small{display:block;margin-bottom:3px;font-size:8px;opacity:.65}
.v2-bar{height:5px;margin-bottom:8px;background:rgba(255,255,255,.08);overflow:hidden}.v2-bar i{display:block;height:100%;width:100%;transition:width .12s linear}
#v2-hp{background:#a94b42}#v2-xp{background:#d3b64f}#v2-stamina{background:#6c9d78}
.v2-help{margin-top:8px;font-size:7px;line-height:1.6;opacity:.48}
#v2-toast{position:fixed;left:50%;bottom:90px;transform:translate(-50%,12px);z-index:6000;padding:10px 18px;color:#f3e7ba;background:rgba(8,10,9,.92);border:1px solid rgba(218,187,91,.65);font-family:Georgia,serif;font-size:12px;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease}
#v2-toast.show{opacity:1;transform:translate(-50%,0)}
'''


def patch_index():
    text = INDEX.read_text(encoding='utf-8')
    marker = '<script src="game.js"></script>'
    include = '<script src="gameplay_v2.js"></script>'
    if include not in text:
        if marker not in text:
            raise RuntimeError('balise game.js introuvable')
        text = text.replace(marker, marker + '\n    ' + include, 1)
        log('[OK] gameplay_v2.js branché')

    old = '''            introPlayer.pause();

            introScreen.classList.add(
                "hidden"
            );'''
    new = '''            introPlayer.pause();
            introPlayer.currentTime = 0;
            introPlayer.volume = 0;

            introScreen.classList.add(
                "hidden"
            );'''
    if old in text:
        text = text.replace(old, new, 1)
        log('[OK] skip intro : audio arrêté + reset')

    old = '''        function launchGame() {
            console.log(
                "Lancement de la nouvelle partie..."
            );'''
    new = '''        function launchGame() {
            const menuAudio = document.getElementById("menuMusic");
            const introAudio = document.getElementById("introVideoPlayer");
            if (menuAudio) {
                menuAudio.pause();
                menuAudio.currentTime = 0;
                menuAudio.volume = 0;
            }
            if (introAudio) {
                introAudio.pause();
                introAudio.currentTime = 0;
                introAudio.volume = 0;
            }
            console.log(
                "Lancement de la nouvelle partie..."
            );'''
    if old in text:
        text = text.replace(old, new, 1)
        log('[OK] launchGame : menu + intro audio coupés')

    INDEX.write_text(text, encoding='utf-8')


def patch_style():
    if not STYLE.exists(): return
    text = STYLE.read_text(encoding='utf-8')
    if "PONAN'S LEGACY — GAMEPLAY V2" in text: return
    STYLE.write_text(text.rstrip() + '\n\n' + STYLE_CSS + '\n', encoding='utf-8')
    log('[OK] HUD V2 ajouté au CSS')


def check_js(path):
    if not path.exists(): return True
    try:
        r = subprocess.run(['node', '--check', str(path)], capture_output=True, text=True)
    except FileNotFoundError:
        log('[INFO] Node absent : vérification syntaxique ignorée')
        return True
    if r.returncode:
        log(f'[ERREUR SYNTAXE] {path.name}')
        print(r.stderr)
        return False
    log(f'[OK] {path.name}')
    return True


def main():
    if not ROOT.exists():
        raise SystemExit(f'Projet introuvable : {ROOT}')
    log('==============================================')
    log(" PONAN'S LEGACY — V2")
    log('==============================================')
    backup(INDEX)
    backup(STYLE)
    V2.write_text(GAMEPLAY_JS.strip() + '\n', encoding='utf-8')
    log('[OK] gameplay_v2.js créé')
    patch_index()
    patch_style()
    ok = True
    for path in [V2, ROOT/'game.js', ROOT/'player.js', ROOT/'enemy.js', ROOT/'map.js']:
        ok = check_js(path) and ok
    if not ok:
        raise SystemExit('Une erreur JavaScript a été détectée.')
    log('')
    log('V2 INSTALLÉE')
    log('  J / clic gauche = attaque')
    log('  SHIFT = sprint')
    log('  SPACE = esquive')
    log('  PASSER = intro audio coupé + reset')
    log('  JEU = musique menu forcée à l’arrêt')
    log('  JEU = gameplay.waw si présent')
    log('')
    log(f'cd {ROOT}')
    log('python3 -m http.server 8000')
    log('http://localhost:8000')
    log('Backups : *.before_v2')


if __name__ == '__main__':
    main()
