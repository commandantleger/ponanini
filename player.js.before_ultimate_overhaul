const player = {
    x: 21 * Game.tileSize,
    y: 34 * Game.tileSize,

    w: 40,
    h: 40,

    speed: 4,
    direction: "down",
    moving: false,
    walkTime: 0
};

const keys = {};
let portalPressed = false;
let portalMessage = false;

const ARRIVAL_X = 21;
const ARRIVAL_Y = 34;
const ARRIVAL_Z = 760;

const playerArrival = {
    active: false,
    started: false,
    timer: 0,
    z: ARRIVAL_Z,
    velocity: 0,
    gravity: 420,
    impact: 0,
    particles: []
};

window.addEventListener("keydown", event => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", event => {
    keys[event.key.toLowerCase()] = false;

    if (event.key.toLowerCase() === "e")
        portalPressed = false;
});

function startPlayerArrival() {
    if (playerArrival.started || currentMap !== "village")
        return;

    playerArrival.started = true;
    playerArrival.active = true;
    playerArrival.timer = 0;
    playerArrival.z = ARRIVAL_Z;
    playerArrival.velocity = 0;
    playerArrival.impact = 0;
    playerArrival.particles = [];

    player.x = ARRIVAL_X * Game.tileSize;
    player.y = ARRIVAL_Y * Game.tileSize;
    player.direction = "down";
    player.moving = false;
    player.walkTime = 0;
}

function updatePlayerArrival(dt) {
    if (!playerArrival.active)
        return;

    playerArrival.timer += dt;

    if (playerArrival.timer < 1.0)
        return;

    if (playerArrival.z > 0) {
        playerArrival.velocity += playerArrival.gravity * dt;
        playerArrival.z -= playerArrival.velocity * dt;

        if (playerArrival.z <= 0) {
            playerArrival.z = 0;
            playerArrival.velocity = 0;
            playerArrival.impact = 1;
            createArrivalImpact();

            if (
                typeof addItem === "function" &&
                !playerArrival.itemGiven
            ) {
                playerArrival.itemGiven = true;
                addItem("✦ Fragment résiduel du portail");
            }
        }

        return;
    }

    if (playerArrival.impact > 0) {
        playerArrival.impact -= dt * 2.2;
        updateArrivalParticles(dt);
        return;
    }

    if (playerArrival.timer > 4.2)
        playerArrival.active = false;
}

function createArrivalImpact() {
    playerArrival.particles = [];

    for (let i = 0; i < 30; i++) {
        playerArrival.particles.push({
            angle: Math.random() * Math.PI * 2,
            speed: 40 + Math.random() * 110,
            life: .4 + Math.random() * .5,
            distance: 0,
            size: 2 + Math.random() * 3
        });
    }
}

function updateArrivalParticles(dt) {
    playerArrival.particles.forEach(p => {
        p.life -= dt;
        p.distance += p.speed * dt;
    });

    playerArrival.particles =
        playerArrival.particles.filter(p => p.life > 0);
}

function updatePlayer() {
    if (
        typeof gameFinished !== "undefined" &&
        gameFinished
    )
        return;

    if (
        !playerArrival.started &&
        currentMap === "village"
    )
        startPlayerArrival();

    if (playerArrival.active) {
        updatePlayerArrival(1 / 60);
        return;
    }

    if (
        typeof dialogueOpen !== "undefined" &&
        dialogueOpen
    )
        return;

    let nx = player.x;
    let ny = player.y;
    let dx = 0;
    let dy = 0;

    if (
        keys["z"] ||
        keys["w"] ||
        keys["arrowup"]
    ) {
        dy--;
        player.direction = "up";
    }

    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {
        dy++;
        player.direction = "down";
    }

    if (
        keys["q"] ||
        keys["a"] ||
        keys["arrowleft"]
    ) {
        dx--;
        player.direction = "left";
    }

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {
        dx++;
        player.direction = "right";
    }

    if (dx && dy) {
        dx *= Math.SQRT1_2;
        dy *= Math.SQRT1_2;
    }

    player.moving = !!(dx || dy);

    if (player.moving)
        player.walkTime += .15;
    else
        player.walkTime = 0;

    nx += dx * player.speed;
    ny += dy * player.speed;

    if (!collision(nx, player.y, player.w, player.h))
        player.x = nx;

    if (!collision(player.x, ny, player.w, player.h))
        player.y = ny;

    const tx = Math.floor(
        player.x / Game.tileSize
    );

    const ty = Math.floor(
        player.y / Game.tileSize
    );

    let onPortal = false;

    if (
        ty >= 0 &&
        ty < WORLD.length &&
        tx >= 0 &&
        tx < WORLD[0].length
    ) {
        const tile = WORLD[ty][tx];

        if (
            tile === "D" &&
            currentMap === "village" &&
            bridgeOpen
        ) {
            onPortal = true;

            if (!portalMessage) {
                portalMessage = true;

                openDialogue(
                    "🌲 <b>Passage vers la forêt</b><br><br>" +
                    "Appuie sur E pour entrer."
                );
            }

            if (
                keys["e"] &&
                !portalPressed
            ) {
                portalPressed = true;
                closeDialogue();
                loadForest();
            }
        }
    }

    if (
        !onPortal &&
        portalMessage
    ) {
        portalMessage = false;
        closeDialogue();
    }
}

function drawArrivalPortal(x, y) {
    const ctx = Game.ctx;
    const t = playerArrival.timer;
    const open = Math.min(1, t / 1.0);

    if (open <= 0)
        return;

    const pulse =
        1 + Math.sin(t * 4) * .04;

    ctx.save();

    ctx.translate(x, y);
    ctx.scale(
        open * pulse,
        open * pulse
    );

    const glow =
        ctx.createRadialGradient(
            0, 0, 10,
            0, 0, 125
        );

    glow.addColorStop(
        0,
        "rgba(100,130,255,.42)"
    );

    glow.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(
        0,
        0,
        125,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.strokeStyle =
        "rgba(160,180,255,.95)";

    ctx.lineWidth = 7;

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        55,
        82,
        0,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.strokeStyle =
        "rgba(225,230,255,.65)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        42,
        67,
        0,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();
}

function drawArrivalImpact(x, y) {
    const ctx = Game.ctx;

    if (playerArrival.impact <= 0)
        return;

    const progress =
        1 - playerArrival.impact;

    ctx.save();

    ctx.strokeStyle =
        `rgba(230,235,255,${playerArrival.impact})`;

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 38,
        25 + progress * 80,
        8 + progress * 20,
        0,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    playerArrival.particles.forEach(p => {
        ctx.globalAlpha =
            Math.max(0, p.life / .8);

        ctx.fillStyle = "#d8d0bd";

        ctx.fillRect(
            x + Math.cos(p.angle) * p.distance,
            y + 38 -
                Math.sin(p.angle) * p.distance,
            p.size,
            p.size
        );
    });

    ctx.restore();
}

function drawDuckBody(ctx, cx, cy) {
    ctx.fillStyle = "#f2c94c";

    ctx.beginPath();

    ctx.ellipse(
        cx,
        cy + 10,
        14,
        13,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#ffd95a";

    ctx.beginPath();

    ctx.arc(
        cx,
        cy - 6,
        13,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#17130b";

    ctx.fillRect(
        cx - 7,
        cy - 10,
        4,
        4
    );

    ctx.fillRect(
        cx + 3,
        cy - 10,
        4,
        4
    );

    ctx.fillStyle = "#d88732";

    ctx.beginPath();

    ctx.moveTo(
        cx - 6,
        cy - 2
    );

    ctx.lineTo(
        cx,
        cy + 4
    );

    ctx.lineTo(
        cx + 6,
        cy - 2
    );

    ctx.closePath();

    ctx.fill();

    ctx.fillStyle = "#b89b3e";

    ctx.beginPath();

    ctx.ellipse(
        cx - 10,
        cy + 9,
        6,
        9,
        -.2,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#d88732";

    ctx.fillRect(
        cx - 10,
        cy + 20,
        7,
        3
    );

    ctx.fillRect(
        cx + 3,
        cy + 20,
        7,
        3
    );
}

function drawPlayer() {
    const ctx = Game.ctx;

    const x =
        player.x -
        Game.camera.x;

    const groundY =
        player.y -
        Game.camera.y;

    const y =
        groundY -
        (
            playerArrival.active ?
            playerArrival.z :
            0
        );

    const cx = x + 20;

    const bob =
        player.moving ?
        Math.sin(player.walkTime) * 1.5 :
        0;

    if (playerArrival.active) {
        drawArrivalPortal(
            cx,
            groundY - ARRIVAL_Z
        );

        drawArrivalImpact(
            cx,
            groundY
        );
    }

    ctx.fillStyle =
        "rgba(0,0,0,.25)";

    ctx.beginPath();

    ctx.ellipse(
        cx,
        groundY + 39,
        17,
        5,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.save();

    if (player.direction === "left") {
        ctx.translate(
            cx,
            y + 20 + bob
        );

        ctx.scale(-1, 1);

        drawDuckBody(
            ctx,
            0,
            0
        );

    } else if (player.direction === "up") {

        ctx.fillStyle = "#f2c94c";

        ctx.beginPath();

        ctx.ellipse(
            cx,
            y + 30 + bob,
            14,
            13,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "#e4bd3f";

        ctx.beginPath();

        ctx.arc(
            cx,
            y + 13 + bob,
            12,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "#b89b3e";

        ctx.fillRect(
            cx - 14,
            y + 24 + bob,
            7,
            14
        );

        ctx.fillRect(
            cx + 7,
            y + 24 + bob,
            7,
            14
        );

    } else {
        drawDuckBody(
            ctx,
            cx,
            y + 20 + bob
        );
    }

    ctx.restore();
}
