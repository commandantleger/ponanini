const boss = {

    x: 26 * Game.tileSize,
    y: 8 * Game.tileSize,

    w: 48,
    h: 48,

    hp: 10,
    maxHp: 10,

    alive: true,

    speed: 1.2

};

let playerLife = 5;
let bossAttackCooldown = 0;
let playerHitCooldown = 0;

function updateBoss() {

    if (gameFinished)
        return;

    if (currentMap !== "forest")
        return;

    if (!boss.alive)
        return;

    const dx = player.x - boss.x;
    const dy = player.y - boss.y;

    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 5) {

        let nx = boss.x + dx / dist * boss.speed;
        let ny = boss.y + dy / dist * boss.speed;

        if (!collision(nx, boss.y, boss.w, boss.h))
            boss.x = nx;

        if (!collision(boss.x, ny, boss.w, boss.h))
            boss.y = ny;

    }

    if (playerHitCooldown > 0)
        playerHitCooldown--;

    if (dist < 45 && playerHitCooldown === 0) {

        playerLife--;

        playerHitCooldown = 60;

        if (playerLife <= 0)
            location.reload();

    }

    if (bossAttackCooldown > 0)
        bossAttackCooldown--;

    if (
        (keys[" "] || keys["enter"]) &&
        bossAttackCooldown === 0 &&
        dist < 100
    ) {

        boss.hp--;

        bossAttackCooldown = 20;

        if (boss.hp <= 0) {

            boss.alive = false;

            gameFinished = true;

            for (const k in keys)
                keys[k] = false;

        }

    }

}

function drawBoss() {

    if (currentMap !== "forest")
        return;

    const ctx = Game.ctx;

    if (boss.alive) {

        ctx.font = "60px serif";

        ctx.fillText(
            "👹",
            boss.x - Game.camera.x,
            boss.y - Game.camera.y + 55
        );

    }

    // Barre de vie du boss

    ctx.fillStyle = "#8b0000";
    ctx.fillRect(20,20,320,24);

    ctx.fillStyle = "#00ff00";
    ctx.fillRect(
        20,
        20,
        320 * (boss.hp / boss.maxHp),
        24
    );

    ctx.strokeStyle = "white";
    ctx.strokeRect(20,20,320,24);

    // Vie du joueur

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "left";
    ctx.fillText("❤️ " + playerLife,20,70);

    if (!gameFinished)
        return;

    ctx.fillStyle = "rgba(0,0,0,.90)";
    ctx.fillRect(
        0,
        0,
        Game.canvas.width,
        Game.canvas.height
    );

    const w = 720;
    const h = 430;

    const x = (Game.canvas.width - w) / 2;
    const y = (Game.canvas.height - h) / 2;

    ctx.fillStyle = "#f6ecd3";
    ctx.fillRect(x,y,w,h);

    ctx.strokeStyle = "#5d4037";
    ctx.lineWidth = 8;
    ctx.strokeRect(x,y,w,h);

    ctx.textAlign = "center";

    ctx.fillStyle = "#222";

    ctx.font = "58px Arial";
    ctx.fillText(
        "🏆 VICTOIRE 🏆",
        Game.canvas.width/2,
        y+70
    );

    ctx.font = "38px Arial";
    ctx.fillText(
        "PONAN'S LEGACY",
        Game.canvas.width/2,
        y+130
    );

    ctx.font = "26px Arial";

    ctx.fillText(
        "Vous avez vaincu le Seigneur Démon",
        Game.canvas.width/2,
        y+200
    );

    ctx.fillText(
        "Le royaume des canards est sauvé.",
        Game.canvas.width/2,
        y+235
    );

    ctx.fillText(
        "✅ Les 3 objets retrouvés",
        Game.canvas.width/2,
        y+300
    );

    ctx.fillText(
        "✅ Le Loup vaincu",
        Game.canvas.width/2,
        y+335
    );

    ctx.fillText(
        "✅ Le Démon vaincu",
        Game.canvas.width/2,
        y+370
    );

    ctx.fillStyle = "#555";
    ctx.font = "22px Arial";

    ctx.fillText(
        "Merci d'avoir joué !",
        Game.canvas.width/2,
        y+405
    );

}
