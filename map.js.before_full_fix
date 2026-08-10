
let bridgeOpen = false;

/*
==========================================================
PONAN'S LEGACY
MAP PRINCIPALE — ROYAUME
==========================================================

Légende :

# = bord / mur
. = herbe
T = arbres
H = maison
P = palais
S = place royale
~ = eau
D = pont
R = sortie vers la forêt

Le palais est volontairement placé AU CENTRE
du village.

==========================================================
*/

const VILLAGE = [

"############################################################",
"#T.TT.TT.TT................................................#",
"#.TT.TT.TT.T................TT.TTT.TTT.TTT.................#",
"#TT.TT.TT.TT................TTT.TTT.TTT.TTT................#",
"#T.TT.TT.TT..................TTT.TTT.TTT.TT................#",
"#.TT.TT.TT.T................T.TTT.TTT.TTT.T................#",
"#TT.TT.TT.TT................TT.TTT.TTT.TTT.................#",
"#T.TT.TT.TT.................TTT.TTT.TTT.TTT................#",
"#............................TTT.TTT.TTT.TT................#",
"#...........................T.TTT.TTT.TTTPPPPPP............#",
"#...........................TT.TTT.TTT.TTPPPPPP............#",
"#...........................TTT.TTT.TTT.TPPPPPP............#",
"#............................RTT.T.......PPPPPP............#",
"#...........................T.TTT........PPPPPP............#",
"#..........................................................#",
"#..................................HHHH...........HHHH.....#",
"#..................................HHHH...........HHHH.....#",
"#..................................HHHHSSSSSSSSS..HHHH.....#",
"#......................................SSSSSSSSS...........#",
"#......................................SSSSSSSSS...........#",
"#......................................SSSSSSSSS...........#",
"#..........................................................#",
"#.......................................SSSSSSSS...........#",
"#..........................................................#",
"#..........................................................#",
"#...~~~~~~~~~~~~~~~~~..............HHHH...........HHHH.....#",
"#...~~~~~~~~~~~~~~~~~..............HHHH...........HHHH.....#",
"#...~~~~~~~~~~~~~~~~~.........DDDDDHHHH...........HHHH.....#",
"#...~~~~~~~~~~~~~~~~~......................................#",
"#...~~~~~~~~~~~~~~~~~......................................#",
"#...~~~~~~~~~~~~~~~~~......................................#",
"#...~~~~~~~~~~~~~~~~~......................................#",
"#...~~~~~~~~~~~~~~~~~......................................#",
"#...~~~~~~~~~~~~~~~~~......................................#",
"#TTTTTTT~~~~~~~~~~~~~......................................#",
"#TTTTTTT...................................................#",
"#TTTTTTT...................................................#",
"#TTTTTTT...................................................#",
"#TTTTTTT...................................................#",
"############################################################"

];


/*
==========================================================
FORET
==========================================================
*/

const FOREST = [

"############################################################",
"#TTTTTTTT............................................TTTT#",
"#TTTTTT................................................TT#",
"#TTTT...................................................T#",
"#..........................................................#",
"#.............TTTTTT.....................................#",
"#.............T....T.....................................#",
"#.............TTTTTT.....................................#",
"#..........................................................#",
"#.........................TTTTTT...........................#",
"#.........................T....T...........................#",
"#.........................TTTTTT...........................#",
"#..........................................................#",
"#........................................................R#",
"#..........................................................#",
"#..........................................................#",
"#TTTT................................................TTTT#",
"#TTTTTT............................................TTTTTT#",
"############################################################"

];


/*
==========================================================
ETAT DE LA MAP
==========================================================
*/

let WORLD = [...VILLAGE];

let currentMap = "village";


/*
==========================================================
CHARGEMENT DE LA FORET
==========================================================
*/

function loadForest() {

    currentMap = "forest";

    WORLD = [...FOREST];

    player.x = 2 * Game.tileSize;
    player.y = 2 * Game.tileSize;

}


/*
==========================================================
CHARGEMENT DU VILLAGE
==========================================================
*/

function loadVillage() {

    currentMap = "village";

    WORLD = [...VILLAGE];

}



/*
==========================================================
COLLISION
==========================================================
*/

function solid(tile) {

    if (tile === "D")
        return !bridgeOpen;

    return (
        tile === "#" ||
        tile === "T" ||
        tile === "H" ||
        tile === "P" ||
        tile === "~"
    );

}


/*
==========================================================
COLLISION RECTANGULAIRE
==========================================================
*/

function collision(x, y, w, h) {

    const T = Game.tileSize;

    const left =
        Math.floor(x / T);

    const right =
        Math.floor((x + w - 1) / T);

    const top =
        Math.floor(y / T);

    const bottom =
        Math.floor((y + h - 1) / T);


    if (
        top < 0 ||
        left < 0 ||
        bottom >= WORLD.length ||
        right >= WORLD[0].length
    ) {
        return true;
    }


    return (
        solid(WORLD[top][left]) ||
        solid(WORLD[top][right]) ||
        solid(WORLD[bottom][left]) ||
        solid(WORLD[bottom][right])
    );

}


/*
==========================================================
DESSIN DE LA MAP
==========================================================
*/

function drawMap() {

    const ctx = Game.ctx;
    const T = Game.tileSize;


    /*
    ------------------------------------------------------
    CAMERA
    ------------------------------------------------------
    */

    Game.camera.x =
        player.x -
        Game.canvas.width / 2;

    Game.camera.y =
        player.y -
        Game.canvas.height / 2;


    /*
    ------------------------------------------------------
    TILES
    ------------------------------------------------------
    */

    for (
        let y = 0;
        y < WORLD.length;
        y++
    ) {

        for (
            let x = 0;
            x < WORLD[y].length;
            x++
        ) {

            let tile =
                WORLD[y][x];


            /*
            Le pont devient un chemin
            lorsqu'il est réparé.
            */

            if (
                tile === "D" &&
                bridgeOpen
            ) {
                tile = ".";
            }


            const dx =
                x * T -
                Game.camera.x;

            const dy =
                y * T -
                Game.camera.y;


            /*
            --------------------------------------------------
            SOL DE BASE
            --------------------------------------------------
            */

            ctx.fillStyle =
                "#72d45c";

            ctx.fillRect(
                dx,
                dy,
                T,
                T
            );


            /*
            --------------------------------------------------
            HERBE
            --------------------------------------------------
            */

            if (tile === ".") {

                ctx.fillStyle =
                    "#72d45c";

                ctx.fillRect(
                    dx,
                    dy,
                    T,
                    T
                );


                /*
                petites variations
                pour éviter un sol totalement plat
                */

                ctx.fillStyle =
                    "rgba(45,110,45,.16)";

                ctx.fillRect(
                    dx + 8,
                    dy + 12,
                    4,
                    8
                );

                ctx.fillRect(
                    dx + 39,
                    dy + 30,
                    3,
                    7
                );

            }


            /*
            --------------------------------------------------
            MUR / LIMITE
            --------------------------------------------------
            */

            else if (tile === "#") {

                ctx.fillStyle =
                    "#263238";

                ctx.fillRect(
                    dx,
                    dy,
                    T,
                    T
                );

                ctx.fillStyle =
                    "#37474f";

                ctx.fillRect(
                    dx + 4,
                    dy + 4,
                    T - 8,
                    7
                );

            }


            /*
            --------------------------------------------------
            ARBRE
            --------------------------------------------------
            */

            else if (tile === "T") {

                /*
                sol
                */

                ctx.fillStyle =
                    "#5fa64f";

                ctx.fillRect(
                    dx,
                    dy,
                    T,
                    T
                );


                /*
                tronc
                */

                ctx.fillStyle =
                    "#5d4037";

                ctx.fillRect(
                    dx + 27,
                    dy + 31,
                    12,
                    29
                );


                /*
                feuillage
                */

                ctx.fillStyle =
                    "#1b5e20";

                ctx.beginPath();

                ctx.arc(
                    dx + 32,
                    dy + 27,
                    25,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                ctx.fillStyle =
                    "#2e7d32";

                ctx.beginPath();

                ctx.arc(
                    dx + 20,
                    dy + 20,
                    14,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                ctx.beginPath();

                ctx.arc(
                    dx + 44,
                    dy + 19,
                    15,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }


            /*
            --------------------------------------------------
            MAISON
            --------------------------------------------------
            */

            else if (tile === "H") {

                ctx.fillStyle =
                    "#bc8f5c";

                ctx.fillRect(
                    dx,
                    dy,
                    T,
                    T
                );


                ctx.fillStyle =
                    "#7b3f25";

                ctx.fillRect(
                    dx + 5,
                    dy + 8,
                    T - 10,
                    10
                );


                ctx.fillStyle =
                    "#4e342e";

                ctx.fillRect(
                    dx + 23,
                    dy + 33,
                    18,
                    31
                );


                ctx.fillStyle =
                    "#9bd7e8";

                ctx.fillRect(
                    dx + 8,
                    dy + 35,
                    13,
                    13
                );

            }


            /*
            --------------------------------------------------
            PALAIS
            --------------------------------------------------
            */

            else if (tile === "P") {

                ctx.fillStyle =
                    "#d8c49a";

                ctx.fillRect(
                    dx,
                    dy,
                    T,
                    T
                );


                /*
                pierre
                */

                ctx.strokeStyle =
                    "rgba(80,65,50,.20)";

                ctx.lineWidth = 1;

                ctx.strokeRect(
                    dx + 2,
                    dy + 2,
                    T - 4,
                    T - 4
                );


                /*
                bande dorée
                */

                ctx.fillStyle =
                    "#a98432";

                ctx.fillRect(
                    dx,
                    dy,
                    T,
                    6
                );


                /*
                fenêtre
                */

                ctx.fillStyle =
                    "#31475a";

                ctx.fillRect(
                    dx + 20,
                    dy + 18,
                    24,
                    24
                );


                ctx.fillStyle =
                    "#d8b75a";

                ctx.fillRect(
                    dx + 30,
                    dy + 18,
                    4,
                    24
                );

            }


            /*
            --------------------------------------------------
            PLACE ROYALE
            --------------------------------------------------
            */

            else if (tile === "S") {

                ctx.fillStyle =
                    "#c9a66b";

                ctx.fillRect(
                    dx,
                    dy,
                    T,
                    T
                );


                ctx.fillStyle =
                    "rgba(95,70,40,.15)";

                ctx.fillRect(
                    dx + 2,
                    dy + 2,
                    T - 4,
                    T - 4
                );

            }


            /*
            --------------------------------------------------
            EAU
            --------------------------------------------------
            */

            else if (tile === "~") {

                ctx.fillStyle =
                    "#1976a8";

                ctx.fillRect(
                    dx,
                    dy,
                    T,
                    T
                );


                ctx.strokeStyle =
                    "rgba(180,235,255,.55)";

                ctx.lineWidth = 2;


                const wave =
                    Math.sin(
                        performance.now() * .003 +
                        x
                    ) * 3;


                ctx.beginPath();

                ctx.moveTo(
                    dx + 5,
                    dy + 28 + wave
                );

                ctx.lineTo(
                    dx + T - 5,
                    dy + 28 + wave
                );

                ctx.stroke();

            }


            /*
            --------------------------------------------------
            PONT
            --------------------------------------------------
            */

            else if (tile === "D") {

                ctx.fillStyle =
                    "#795548";

                ctx.fillRect(
                    dx,
                    dy,
                    T,
                    T
                );


                ctx.fillStyle =
                    "#a66a3f";

                ctx.fillRect(
                    dx + 4,
                    dy + 8,
                    T - 8,
                    8
                );

                ctx.fillRect(
                    dx + 4,
                    dy + 28,
                    T - 8,
                    8
                );

                ctx.fillRect(
                    dx + 4,
                    dy + 48,
                    T - 8,
                    8
                );

            }


            /*
            --------------------------------------------------
            SORTIE FORET
            --------------------------------------------------
            */

            else if (tile === "R") {

                ctx.fillStyle =
                    "#72d45c";

                ctx.fillRect(
                    dx,
                    dy,
                    T,
                    T
                );


                ctx.fillStyle =
                    "#1b5e20";

                ctx.beginPath();

                ctx.arc(
                    dx + 32,
                    dy + 32,
                    27,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }

        }

    }


    /*
    ------------------------------------------------------
    DÉCOR DU PALAIS
    ------------------------------------------------------
    */

    drawPalaceDecoration();


    /*
    ------------------------------------------------------
    DÉCOR DU VILLAGE
    ------------------------------------------------------
    */

    drawVillageDecoration();

}


/*
==========================================================
DÉCOR DU PALAIS
==========================================================
*/

function drawPalaceDecoration() {

    const ctx = Game.ctx;
    const T = Game.tileSize;


    /*
    Position du palais dans la map :
    centre approximatif.
    */

    const px =
        23 * T -
        Game.camera.x;

    const py =
        8 * T -
        Game.camera.y;


    /*
    Si le palais est hors écran,
    on ne dessine rien.
    */

    if (
        px < -300 ||
        px > Game.canvas.width + 300 ||
        py < -300 ||
        py > Game.canvas.height + 300
    ) {
        return;
    }


    /*
    Grande entrée.
    */

    ctx.fillStyle =
        "#795548";

    ctx.fillRect(
        px + T * 3,
        py + T * 2,
        T * 2,
        T * 2
    );


    /*
    Portes.
    */

    ctx.fillStyle =
        "#3e2723";

    ctx.fillRect(
        px + T * 3.3,
        py + T * 2.2,
        T * .7,
        T * 1.8
    );

    ctx.fillRect(
        px + T * 4,
        py + T * 2.2,
        T * .7,
        T * 1.8
    );


    /*
    Blason.
    */

    ctx.fillStyle =
        "#d6b44f";

    ctx.beginPath();

    ctx.arc(
        px + T * 3.8,
        py + T * 1.25,
        15,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
    Tours.
    */

    ctx.fillStyle =
        "#bba477";

    ctx.fillRect(
        px - T * .5,
        py - T * .7,
        T,
        T * 3
    );

    ctx.fillRect(
        px + T * 4.8,
        py - T * .7,
        T,
        T * 3
    );


}


/*
==========================================================
DÉCOR DU VILLAGE
==========================================================
*/

function drawVillageDecoration() {

    const ctx = Game.ctx;
    const T = Game.tileSize;


    /*
    Chemin principal menant au palais.
    */

    const centerX =
        25 * T -
        Game.camera.x;


    const centerY =
        14 * T -
        Game.camera.y;


    if (
        centerX > -200 &&
        centerX < Game.canvas.width + 200
    ) {

        ctx.fillStyle =
            "rgba(122,91,55,.18)";

        ctx.fillRect(
            centerX - T * 5,
            centerY,
            T * 10,
            4
        );

    }


    /*
    Quelques lampes autour de la place.
    */

    const lamps = [

        [19, 5],
        [31, 5],
        [19, 15],
        [31, 15]

    ];


    for (
        let i = 0;
        i < lamps.length;
        i++
    ) {

        const lx =
            lamps[i][0] * T -
            Game.camera.x;

        const ly =
            lamps[i][1] * T -
            Game.camera.y;


        if (
            lx < -50 ||
            lx > Game.canvas.width + 50
        ) {
            continue;
        }


        /*
        halo
        */

        const glow =
            ctx.createRadialGradient(
                lx,
                ly,
                2,
                lx,
                ly,
                55
            );


        glow.addColorStop(
            0,
            "rgba(255,210,100,.30)"
        );

        glow.addColorStop(
            1,
            "rgba(255,210,100,0)"
        );


        ctx.fillStyle =
            glow;

        ctx.fillRect(
            lx - 55,
            ly - 55,
            110,
            110
        );


        /*
        poteau
        */

        ctx.fillStyle =
            "#4e342e";

        ctx.fillRect(
            lx - 3,
            ly,
            6,
            28
        );


        /*
        lumière
        */

        ctx.fillStyle =
            "#ffd54f";

        ctx.beginPath();

        ctx.arc(
            lx,
            ly,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}
