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


window.addEventListener("keydown", event => {

    keys[event.key.toLowerCase()] = true;

});


window.addEventListener("keyup", event => {

    keys[event.key.toLowerCase()] = false;

    if (event.key.toLowerCase() === "e")
        portalPressed = false;

});


function updatePlayer() {

    if (gameFinished)
        return;


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


    const y =
        player.y -
        Game.camera.y;


    /*
    Petite oscillation pendant la marche.
    */

    let bob = 0;


    if (player.moving) {

        bob =
            Math.sin(
                player.walkTime
            ) * 2;
    }


    const py =
        y + bob;


    ctx.save();


    /*
    Ombre.
    */

    ctx.fillStyle =
        "rgba(0,0,0,.25)";

    ctx.beginPath();

    ctx.ellipse(
        x + player.w / 2,
        y + player.h - 2,
        17,
        6,
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
        x + 20,
        py + 25,
        15,
        13,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
    ==============================
    TÊTE
    ==============================
    */

    ctx.fillStyle =
        "#e4c65b";

    ctx.beginPath();

    ctx.arc(
        x + 20,
        py + 14,
        14,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
    ==============================
    AILE
    ==============================
    */

    ctx.fillStyle =
        "#b89b3e";

    ctx.beginPath();

    ctx.ellipse(
        x + 12,
        py + 26,
        8,
        11,
        -0.35,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
    ==============================
    BEC
    ==============================
    */

    ctx.fillStyle =
        "#d88732";


    if (
        player.direction ===
        "left"
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x + 8,
            py + 14
        );

        ctx.lineTo(
            x - 4,
            py + 18
        );

        ctx.lineTo(
            x + 8,
            py + 21
        );

        ctx.closePath();

        ctx.fill();

    } else {

        ctx.beginPath();

        ctx.moveTo(
            x + 31,
            py + 14
        );

        ctx.lineTo(
            x + 42,
            py + 18
        );

        ctx.lineTo(
            x + 31,
            py + 21
        );

        ctx.closePath();

        ctx.fill();
    }


    /*
    ==============================
    YEUX
    ==============================
    */

    ctx.fillStyle =
        "#17130b";


    if (
        player.direction ===
        "left"
    ) {

        ctx.fillRect(
            x + 7,
            py + 9,
            4,
            4
        );

    } else {

        ctx.fillRect(
            x + 26,
            py + 9,
            4,
            4
        );
    }


    /*
    ==============================
    PATTES
    ==============================
    */

    ctx.fillStyle =
        "#d88732";


    let footOffset = 0;


    if (player.moving) {

        footOffset =
            Math.sin(
                player.walkTime
            ) * 2;
    }


    ctx.fillRect(
        x + 9,
        py + 36 + footOffset,
        7,
        3
    );

    ctx.fillRect(
        x + 25,
        py + 36 - footOffset,
        7,
        3
    );


    ctx.restore();
}
