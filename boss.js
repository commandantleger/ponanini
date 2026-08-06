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

    if (currentMap !== "forest")
        return;

    if (!boss.alive)
        return;

    const dx = player.x - boss.x;
    const dy = player.y - boss.y;

    const dist = Math.sqrt(dx*dx + dy*dy);

    if (dist > 5) {

        boss.x += dx / dist * boss.speed;
        boss.y += dy / dist * boss.speed;

    }

    if (playerHitCooldown > 0)
        playerHitCooldown--;

    if (dist < 45 && playerHitCooldown === 0) {

        playerLife--;
        playerHitCooldown = 60;

    }

    if (bossAttackCooldown > 0)
        bossAttackCooldown--;

    if (keys[" "] && bossAttackCooldown === 0 && dist < 70) {

        boss.hp--;
        bossAttackCooldown = 20;

        if (boss.hp <= 0) {

            boss.alive = false;
            gameFinished = true;

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

    // Barre du boss

    ctx.fillStyle = "red";
    ctx.fillRect(20,20,300,20);

    ctx.fillStyle = "lime";
    ctx.fillRect(
        20,
        20,
        300 * (boss.hp / boss.maxHp),
        20
    );

    // Vie du joueur

    ctx.fillStyle = "white";
    ctx.font = "22px Arial";
    ctx.fillText("❤️ " + playerLife,20,70);

    if (gameFinished) {

        ctx.fillStyle="rgba(0,0,0,.8)";
        ctx.fillRect(
            0,
            0,
            Game.canvas.width,
            Game.canvas.height
        );

        ctx.fillStyle="white";
        ctx.font="60px Arial";
        ctx.fillText(
            "FIN",
            Game.canvas.width/2-50,
            Game.canvas.height/2-40
        );

        ctx.font="28px Arial";

        ctx.fillText(
            "Merci d'avoir joué à PONAN'S LEGACY",
            Game.canvas.width/2-220,
            Game.canvas.height/2+20
        );

    }

    if(playerLife<=0){

        location.reload();

    }

}
