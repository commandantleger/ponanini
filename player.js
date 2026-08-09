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

    const ctx = Game.ctx;

    const x = player.x - Game.camera.x;
    const y = player.y - Game.camera.y;

    let bob = 0;

    if (player.moving) {
        bob = Math.sin(player.walkTime) * 1.5;
    }

    const cx = x + 20;
    const cy = y + 20 + bob;

    ctx.save();

    /*
    ==============================
    OMBRE
    ==============================
    */

    ctx.fillStyle = "rgba(0,0,0,0.25)";

    ctx.beginPath();

    ctx.ellipse(
        cx,
        y + 39,
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

    ctx.fillStyle = "#d8b94f";

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
    DIRECTION : BAS
    ==============================
    */

    if (player.direction === "down") {

        /*
        Tête
        */

        ctx.fillStyle = "#e4c65b";

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


        /*
        Bec
        */

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
    }


    /*
    ==============================
    DIRECTION : HAUT
    ==============================
    */


    else if (player.direction === "up") {

    /*
    ==============================
    VUE ARRIÈRE DU CANARD
    ==============================
    */

    /*
    Corps
    */

    ctx.fillStyle = "#d8b94f";

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

    ctx.fillStyle = "#e4c65b";

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
    Petite partie sombre à l'arrière
    de la tête pour donner du volume.
    */

    ctx.fillStyle = "#c5a845";

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

    ctx.fillStyle = "#b89b3e";

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
    ==============================
    QUEUE
    ==============================
    */

    ctx.fillStyle = "#c09f3f";

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
    ==============================
    PATTES
    ==============================
    */

    ctx.fillStyle = "#d88732";

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

    else if (player.direction === "left") {

        /*
        Tête légèrement décalée
        vers la gauche.
        */

        ctx.fillStyle = "#e4c65b";

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

        ctx.fillStyle = "#17130b";

        ctx.fillRect(
            cx - 10,
            cy - 10,
            4,
            4
        );


        /*
        Bec
        */

        ctx.fillStyle = "#d88732";

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

        ctx.fillStyle = "#e4c65b";

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

        ctx.fillStyle = "#17130b";

        ctx.fillRect(
            cx + 6,
            cy - 10,
            4,
            4
        );


        /*
        Bec
        */

        ctx.fillStyle = "#d88732";

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

    ctx.fillStyle = "#b89b3e";

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

    let foot = 0;

    if (player.moving) {
        foot =
            Math.sin(player.walkTime) * 2;
    }

    ctx.fillStyle = "#d88732";

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
