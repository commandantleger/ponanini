const player = {

    x: 128,
    y: 128,

    w: 40,
    h: 40,

    speed: 4,

    direction: "down",

    walkTime: 0,

    moving: false
};


const keys = {};

let portalPressed = false;
let portalMessage = false;


/*
=========================================================
ARRIVÉE DU JOUEUR — PORTAIL + CHUTE DU CIEL
=========================================================

Le joueur reste immobile au-dessus de son point de spawn.
Le portail s'ouvre d'abord, puis le joueur tombe réellement
vers le sol avant de rendre le contrôle au joueur.
*/

const playerArrival = {

    active: false,

    started: false,

    timer: 0,

    z: 700,

    velocity: 0,

    gravity: 650,

    portalZ: 550,

    impact: 0,

    impactParticles: [],

    portalParticles: []
};


function startPlayerArrival() {

    if (
        playerArrival.started ||
        currentMap !== "village"
    )
        return;


    /*
    =====================================================
    POINT D'ARRIVÉE
    =====================================================

    On cherche automatiquement une case libre
    dans le coin sud-ouest de la map.

    Le joueur n'arrive donc plus près du garde.
    */

    const T =
        Game.tileSize;

    let found = false;


    for (
        let y = WORLD.length - 5;
        y >= 3 && !found;
        y--
    ) {

        for (
            let x = 3;
            x < 18;
            x++
        ) {

            if (
                WORLD[y][x] !== "." &&
                WORLD[y][x] !== "+"
            ) {

                continue;
            }


            const testX =
                x * T;

            const testY =
                y * T;


            if (
                !collision(
                    testX,
                    testY,
                    player.w,
                    player.h
                )
            ) {

                player.x =
                    testX;

                player.y =
                    testY;

                found = true;

                break;
            }
        }
    }


    /*
    =====================================================
    INITIALISATION DE LA CHUTE
    =====================================================
    */

    playerArrival.started = true;

    playerArrival.active = true;

    playerArrival.timer = 0;

    playerArrival.z = 700;

    playerArrival.velocity = 0;

    playerArrival.impact = 0;

    playerArrival.impactParticles = [];

    playerArrival.portalParticles = [];

    player.moving = false;
}

function updatePlayerArrival(dt) {

    if (!playerArrival.active)
        return;


    playerArrival.timer += dt;


    /*
    ==============================================
    OUVERTURE DU PORTAIL
    ==============================================
    */

    if (
        playerArrival.timer < 1.2
    ) {

        playerArrival.z = 560;

        playerArrival.velocity = 0;

        return;
    }


    /*
    ==============================================
    CHUTE
    ==============================================
    */

    if (
        playerArrival.z > 0
    ) {

        playerArrival.velocity +=
            playerArrival.gravity * dt;

        playerArrival.z -=
            playerArrival.velocity * dt;


        if (
            playerArrival.z <= 0
        ) {

            playerArrival.z = 0;

            playerArrival.velocity = 0;

            playerArrival.impact = 1;

            createArrivalImpact();
        }

        return;
    }


    /*
    ==============================================
    IMPACT
    ==============================================
    */

    if (
        playerArrival.impact > 0
    ) {

        playerArrival.impact -=
            dt * 2.8;

        updateArrivalParticles(dt);

        return;
    }


    /*
    ==============================================
    FIN
    ==============================================
    */

    if (
        playerArrival.timer > 2.85
    ) {

        playerArrival.active = false;

        playerArrival.impactParticles = [];

        playerArrival.portalParticles = [];

        player.moving = false;
    }
}


function createArrivalImpact() {

    playerArrival.impactParticles = [];


    for (
        let i = 0;
        i < 28;
        i++
    ) {

        playerArrival.impactParticles.push({

            angle:
                Math.random() *
                Math.PI * 2,

            speed:
                45 +
                Math.random() * 120,

            life:
                0.35 +
                Math.random() * 0.45,

            size:
                2 +
                Math.random() * 4,

            distance: 0
        });
    }
}


function updateArrivalParticles(dt) {

    playerArrival.impactParticles.forEach(
        particle => {

            particle.life -= dt;

            particle.distance +=
                particle.speed * dt;
        }
    );


    playerArrival.impactParticles =
        playerArrival.impactParticles.filter(
            particle =>
                particle.life > 0
        );
}


function drawArrivalPortal(
    x,
    y
) {

    const ctx =
        Game.ctx;

    const time =
        playerArrival.timer;


    /*
    Ouverture progressive.
    */

    const open =
        Math.min(
            1,
            time / 0.55
        );


    /*
    Fermeture après l'impact.
    */

    let close = 1;

    if (
        time > 2.15
    ) {

        close =
            1 -
            Math.min(
                1,
                (time - 2.15) / 0.70
            );
    }


    const pulse =
        1 +
        Math.sin(
            time * 5
        ) * 0.045;


    const scale =
        open *
        close *
        pulse;


    if (
        scale <= 0
    )
        return;


    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.scale(
        scale,
        scale
    );


    /*
    ==============================================
    HALO
    ==============================================
    */

    const halo =
        ctx.createRadialGradient(
            0,
            0,
            20,
            0,
            0,
            145
        );


    halo.addColorStop(
        0,
        "rgba(93,117,255,.30)"
    );

    halo.addColorStop(
        .45,
        "rgba(93,117,255,.12)"
    );

    halo.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        halo;


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        145,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
    ==============================================
    PORTAIL
    ==============================================
    */

    ctx.strokeStyle =
        "rgba(112,132,255,.95)";

    ctx.lineWidth = 8;

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        58,
        88,
        0,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    ctx.strokeStyle =
        "rgba(190,200,255,.70)";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        44,
        72,
        0,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    /*
    ==============================================
    INTERIEUR
    ==============================================
    */

    const inside =
        ctx.createRadialGradient(
            0,
            0,
            4,
            0,
            0,
            70
        );


    inside.addColorStop(
        0,
        "rgba(110,130,255,.38)"
    );

    inside.addColorStop(
        .55,
        "rgba(50,55,130,.22)"
    );

    inside.addColorStop(
        1,
        "rgba(0,0,0,.78)"
    );


    ctx.fillStyle =
        inside;


    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        52,
        82,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
    ==============================================
    PARTICULES
    ==============================================
    */

    for (
        let i = 0;
        i < 18;
        i++
    ) {

        const angle =
            time * 1.8 +
            i * 0.35;

        const radius =
            60 +
            Math.sin(
                time * 3 +
                i
            ) * 18;

        const px =
            Math.cos(angle) *
            radius;

        const py =
            Math.sin(angle) *
            radius *
            1.35;


        ctx.fillStyle =
            "rgba(150,170,255,.70)";

        ctx.fillRect(
            px,
            py,
            3,
            3
        );
    }


    ctx.restore();
}


function drawArrivalImpact(
    x,
    y
) {

    const ctx =
        Game.ctx;


    if (
        playerArrival.impact <= 0
    )
        return;


    const progress =
        1 -
        playerArrival.impact;


    /*
    Onde de choc.
    */

    ctx.save();

    ctx.strokeStyle =
        "rgba(215,225,255," +
        playerArrival.impact +
        ")";

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 38,
        25 +
        progress * 75,
        8 +
        progress * 20,
        0,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    /*
    Poussière / éclats.
    */

    playerArrival.impactParticles.forEach(
        particle => {

            const px =
                x +
                Math.cos(
                    particle.angle
                ) *
                particle.distance;

            const py =
                y +
                38 -
                Math.sin(
                    particle.angle
                ) *
                particle.distance;


            ctx.globalAlpha =
                Math.max(
                    0,
                    particle.life / 0.8
                );


            ctx.fillStyle =
                "#d8d0bd";


            ctx.fillRect(
                px,
                py,
                particle.size,
                particle.size
            );
        }
    );


    ctx.globalAlpha = 1;

    ctx.restore();
}


window.addEventListener(
    "keydown",
    event => {

        keys[
            event.key.toLowerCase()
        ] = true;
    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;


        if (
            event.key.toLowerCase() === "e"
        )
            portalPressed = false;
    }
);


function updatePlayer() {

    if (gameFinished)
        return;


    /*
    Première frame de gameplay :
    le joueur arrive du ciel.
    */

    if (
        !playerArrival.started &&
        currentMap === "village"
    ) {

        startPlayerArrival();
    }


    /*
    Tant que la chute n'est pas terminée,
    aucun déplacement manuel n'est accepté.
    */

    if (
        playerArrival.active
    ) {

        updatePlayerArrival(
            1 / 60
        );

        return;
    }


    let nx = player.x;

    let ny = player.y;

    let dx = 0;

    let dy = 0;


    /*
    ==============================
    DÉPLACEMENT
    ==============================
    */

    if (
        keys["z"] ||
        keys["w"] ||
        keys["arrowup"]
    ) {

        dy--;

        player.direction =
            "up";
    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        dy++;

        player.direction =
            "down";
    }


    if (
        keys["q"] ||
        keys["a"] ||
        keys["arrowleft"]
    ) {

        dx--;

        player.direction =
            "left";
    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        dx++;

        player.direction =
            "right";
    }


    /*
    ==============================
    NORMALISATION DIAGONALE
    ==============================
    */

    if (
        dx !== 0 &&
        dy !== 0
    ) {

        dx *= Math.SQRT1_2;

        dy *= Math.SQRT1_2;
    }


    player.moving =
        dx !== 0 ||
        dy !== 0;


    /*
    ==============================
    ANIMATION
    ==============================
    */

    if (player.moving) {

        player.walkTime +=
            0.15;

    } else {

        player.walkTime = 0;
    }


    /*
    ==============================
    COLLISION X
    ==============================
    */

    nx +=
        dx *
        player.speed;


    if (
        !collision(
            nx,
            player.y,
            player.w,
            player.h
        )
    ) {

        player.x = nx;
    }


    /*
    ==============================
    COLLISION Y
    ==============================
    */

    ny +=
        dy *
        player.speed;


    if (
        !collision(
            player.x,
            ny,
            player.w,
            player.h
        )
    ) {

        player.y = ny;
    }


    /*
    ==============================
    PORTAIL
    ==============================
    */

    const tx =
        Math.floor(
            player.x /
            Game.tileSize
        );

    const ty =
        Math.floor(
            player.y /
            Game.tileSize
        );


    let onPortal = false;


    if (
        ty >= 0 &&
        ty < WORLD.length &&
        tx >= 0 &&
        tx < WORLD[0].length
    ) {

        const tile =
            WORLD[ty][tx];


        if (
            tile === "D" &&
            currentMap === "village" &&
            bridgeOpen
        ) {

            onPortal = true;


            if (!portalMessage) {

                portalMessage =
                    true;


                openDialogue(
                    "🌲 PASSAGE VERS LA FORÊT<br><br>" +
                    "Appuie sur E pour traverser."
                );
            }


            if (
                keys["e"] &&
                !portalPressed
            ) {

                portalPressed = true;


                if (
                    typeof closeDialogue ===
                    "function"
                ) {

                    closeDialogue();
                }


                loadForest();
            }
        }
    }


    if (
        !onPortal &&
        portalMessage
    ) {

        portalMessage =
            false;


        if (
            typeof closeDialogue ===
            "function"
        ) {

            closeDialogue();
        }
    }
}

/*
=========================================================
DESSIN DU CANARD
=========================================================
*/

function drawPlayer() {

    const ctx =
        Game.ctx;


    const x =
        player.x -
        Game.camera.x;


    const groundY =
        player.y -
        Game.camera.y;


    const z =
        playerArrival.active
            ? playerArrival.z
            : 0;


    const y =
        groundY -
        z;


    const cx =
        x + 20;


    /*
    Portail dans le ciel,
    exactement au-dessus
    du point d'atterrissage.
    */

    if (
        playerArrival.active
    ) {

        const portalY =
            groundY -
            playerArrival.portalZ;


        drawArrivalPortal(
            cx,
            portalY
        );


        drawArrivalImpact(
            cx,
            groundY
        );
    }


    let bob = 0;


    if (
        player.moving
    ) {

        bob =
            Math.sin(
                player.walkTime
            ) * 1.5;
    }


    const cy =
        y +
        20 +
        bob;


    ctx.save();


    /*
    ==============================
    OMBRE
    ==============================
    */

    ctx.fillStyle =
        "rgba(0,0,0,0.25)";


    ctx.beginPath();


    ctx.ellipse(
        cx,
        groundY + 39,
        16,
        5,
        0,
        0,
        Math.PI * 2
    );


    ctx.fill();


    /*
    ==============================
    CORPS
    ==============================
    */

    ctx.fillStyle =
        "#d8b94f";


    ctx.beginPath();


    ctx.ellipse(
        cx,
        cy + 9,
        14,
        12,
        0,
        0,
        Math.PI * 2
    );


    ctx.fill();


    /*
    ==============================
    PATTES
    ==============================
    */

    let foot = 0;


    if (
        player.moving
    ) {

        foot =
            Math.sin(
                player.walkTime
            ) * 2;
    }


    /*
    ==============================
    DIRECTION : BAS
    ==============================
    */

    if (
        player.direction === "down"
    ) {

        /*
        Tête
        */

        ctx.fillStyle =
            "#e4c65b";


        ctx.beginPath();


        ctx.arc(
            cx,
            cy - 6,
            13,
            0,
            Math.PI * 2
        );


        ctx.fill();


        /*
        Yeux
        */

        ctx.fillStyle =
            "#17130b";


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


        /*
        Bec
        */

        ctx.fillStyle =
            "#d88732";


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
    }


    /*
    ==============================
    DIRECTION : HAUT
    ==============================
    */

    else if (
        player.direction === "up"
    ) {

        /*
        Vue arrière du canard
        */

        ctx.fillStyle =
            "#d8b94f";


        ctx.beginPath();


        ctx.ellipse(
            cx,
            cy + 8,
            14,
            13,
            0,
            0,
            Math.PI * 2
        );


        ctx.fill();


        /*
        Tête vue de dos
        */

        ctx.fillStyle =
            "#e4c65b";


        ctx.beginPath();


        ctx.arc(
            cx,
            cy - 7,
            12,
            0,
            Math.PI * 2
        );


        ctx.fill();


        /*
        Partie sombre à l'arrière
        */

        ctx.fillStyle =
            "#c5a845";


        ctx.beginPath();


        ctx.arc(
            cx,
            cy - 6,
            9,
            0,
            Math.PI
        );


        ctx.fill();


        /*
        Aile gauche
        */

        ctx.fillStyle =
            "#b89b3e";


        ctx.beginPath();


        ctx.ellipse(
            cx - 11,
            cy + 8,
            6,
            10,
            -0.15,
            0,
            Math.PI * 2
        );


        ctx.fill();


        /*
        Aile droite
        */

        ctx.beginPath();


        ctx.ellipse(
            cx + 11,
            cy + 8,
            6,
            10,
            0.15,
            0,
            Math.PI * 2
        );


        ctx.fill();


        /*
        Queue
        */

        ctx.fillStyle =
            "#c09f3f";


        ctx.beginPath();


        ctx.moveTo(
            cx - 8,
            cy + 18
        );


        ctx.lineTo(
            cx,
            cy + 11
        );


        ctx.lineTo(
            cx + 8,
            cy + 18
        );


        ctx.lineTo(
            cx + 4,
            cy + 22
        );


        ctx.lineTo(
            cx,
            cy + 18
        );


        ctx.lineTo(
            cx - 4,
            cy + 22
        );


        ctx.closePath();


        ctx.fill();


        /*
        Pattes
        */

        ctx.fillStyle =
            "#d88732";


        ctx.fillRect(
            cx - 10,
            cy + 19 + foot,
            7,
            3
        );


        ctx.fillRect(
            cx + 3,
            cy + 19 - foot,
            7,
            3
        );
    }


    /*
    ==============================
    DIRECTION : GAUCHE
    ==============================
    */

    else if (
        player.direction === "left"
    ) {

        /*
        Tête légèrement décalée
        vers la gauche.
        */

        ctx.fillStyle =
            "#e4c65b";


        ctx.beginPath();


        ctx.arc(
            cx - 3,
            cy - 6,
            13,
            0,
            Math.PI * 2
        );


        ctx.fill();


        /*
        Œil
        */

        ctx.fillStyle =
            "#17130b";


        ctx.fillRect(
            cx - 10,
            cy - 10,
            4,
            4
        );


        /*
        Bec
        */

        ctx.fillStyle =
            "#d88732";


        ctx.beginPath();


        ctx.moveTo(
            cx - 14,
            cy - 2
        );


        ctx.lineTo(
            cx - 24,
            cy + 2
        );


        ctx.lineTo(
            cx - 14,
            cy + 5
        );


        ctx.closePath();


        ctx.fill();
    }


    /*
    ==============================
    DIRECTION : DROITE
    ==============================
    */

    else {

        /*
        Tête légèrement décalée
        vers la droite.
        */

        ctx.fillStyle =
            "#e4c65b";


        ctx.beginPath();


        ctx.arc(
            cx + 3,
            cy - 6,
            13,
            0,
            Math.PI * 2
        );


        ctx.fill();


        /*
        Œil
        */

        ctx.fillStyle =
            "#17130b";


        ctx.fillRect(
            cx + 6,
            cy - 10,
            4,
            4
        );


        /*
        Bec
        */

        ctx.fillStyle =
            "#d88732";


        ctx.beginPath();


        ctx.moveTo(
            cx + 14,
            cy - 2
        );


        ctx.lineTo(
            cx + 24,
            cy + 2
        );


        ctx.lineTo(
            cx + 14,
            cy + 5
        );


        ctx.closePath();


        ctx.fill();
    }


    /*
    ==============================
    AILE
    ==============================
    */

    ctx.fillStyle =
        "#b89b3e";


    ctx.beginPath();


    ctx.ellipse(
        cx - 9,
        cy + 8,
        6,
        9,
        -0.25,
        0,
        Math.PI * 2
    );


    ctx.fill();


    /*
    ==============================
    PATTES
    ==============================
    */

    ctx.fillStyle =
        "#d88732";


    ctx.fillRect(
        cx - 11,
        cy + 19 + foot,
        7,
        3
    );


    ctx.fillRect(
        cx + 4,
        cy + 19 - foot,
        7,
        3
    );


    ctx.restore();
}
