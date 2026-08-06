const player = {

    x: 128,
    y: 128,

    w: 40,
    h: 40,

    speed: 4,

    color: "#1565c0",

    direction: "down"

};

const keys = {};

window.addEventListener("keydown", e => {

    keys[e.key.toLowerCase()] = true;

});

window.addEventListener("keyup", e => {

    keys[e.key.toLowerCase()] = false;

});

function updatePlayer() {

    let nx = player.x;
    let ny = player.y;

    if (keys["z"] || keys["w"] || keys["arrowup"]) {

        ny -= player.speed;
        player.direction = "up";

    }

    if (keys["s"] || keys["arrowdown"]) {

        ny += player.speed;
        player.direction = "down";

    }

    if (keys["q"] || keys["a"] || keys["arrowleft"]) {

        nx -= player.speed;
        player.direction = "left";

    }

    if (keys["d"] || keys["arrowright"]) {

        nx += player.speed;
        player.direction = "right";

    }

    if (!collision(nx, player.y, player.w, player.h))
        player.x = nx;

    if (!collision(player.x, ny, player.w, player.h))
        player.y = ny;

}

function drawPlayer() {

    const ctx = Game.ctx;

    const x = player.x - Game.camera.x;
    const y = player.y - Game.camera.y;

    ctx.fillStyle = player.color;

    ctx.fillRect(
        x,
        y,
        player.w,
        player.h
    );

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(x + 12, y + 12, 3, 0, Math.PI * 2);

    ctx.arc(x + 28, y + 12, 3, 0, Math.PI * 2);

    ctx.fill();

}
