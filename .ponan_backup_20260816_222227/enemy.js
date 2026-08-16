const enemies = [

    {
        x: 8 * Game.tileSize,
        y: 8 * Game.tileSize,

        w: 40,
        h: 40,

        hp: 3,

        alive: true,

        speed: 1.5
    }

];

let attackCooldown = 0;

function updateEnemies() {

    if (currentMap != "forest")
        return;

    enemies.forEach(enemy => {

        if (!enemy.alive)
            return;

        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;

        const distance = Math.sqrt(dx*dx + dy*dy);

        if (distance > 10) {

            enemy.x += dx / distance * enemy.speed;
            enemy.y += dy / distance * enemy.speed;

        }

        if (
            distance < 45 &&
            attackCooldown <= 0 &&
            keys[" "]
        ) {

            enemy.hp--;

            attackCooldown = 20;

            if (enemy.hp <= 0)
                enemy.alive = false;

        }

    });

    if (attackCooldown > 0)
        attackCooldown--;

}

function drawEnemies() {

    if (currentMap != "forest")
        return;

    const ctx = Game.ctx;

    ctx.font = "40px serif";

    enemies.forEach(enemy => {

        if (!enemy.alive)
            return;

        ctx.fillText(
            "🐺",
            enemy.x - Game.camera.x,
            enemy.y - Game.camera.y + 40
        );

    });

}
