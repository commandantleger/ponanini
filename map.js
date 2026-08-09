let bridgeOpen = false;


/*
==========================================================
PONAN'S LEGACY
MAP — VILLAGE DE PONAN
==========================================================

LÉGENDE

# = mur / bordure
. = herbe
T = arbre
H = maison
P = palais
S = place royale
+ = chemin
~ = eau
D = pont
R = sortie
* = fleurs

==========================================================
*/


const VILLAGE = [

    "############################################################",

    "#TTTTT................................................TTTTT#",

    "#TTTTT................................................TTTTT#",

    "#TTTTT................................................TTTTT#",

    "#TTTTT.........T...T....................T..T..........TTTTT#",

    "#......HHHHH.................++..............HHHHH.........#",

    "#......HHHHH.............PPPPPPPPPP..........HHHHH.........#",

    "#......HHHHH..*..........PPPPPPPPPP..........HHHHH.........#",

    "#......HHHHH......SSSSSSSPPPPPPPPPPSSSSSSS...HHHHH........#",

    "#.................SSSSSSSPPPPPPPPPPSSSSSSS.................#",

    "#.................SSSSSSSPPPPPPPPPPSSSSSSS.................#",

    "#...T.............SSSSSSSSSSSSSSSSSSSSSSSS.....*......T....#",

    "#.................SSSSSSSSSSSSSSSSSSSSSSSS.................#",

    "#......HHHHH......SSSSSSSSSSSSSSSSSSSSSSSS...HHHHH.........#",

    "#......HHHHH......SSSSSSSSSSSSSSSSSSSSSSSS...HHHHH.........#",

    "#......HHHHH......SSSSSSSSSSSSSSSSSSSSSSSS...HHHHH.........#",

    "#......HHHHH.....*SSSSSSSSSSSSSSSSSSSSSSSS...HHHHH.........#",

    "#...........*.....SSSSSSSSSSSSSSSSSSSSSSSS.*...............#",

    "#...++++++++++++++++++++++++++++++++++++++++++++++++++++...#",

    "#...++++++++++++++++++++++++++++++++++++++++++++++++++++...#",

    "#...T.........HHHHH..*.......++.....*..HHHHH..........T....#",

    "#.............HHHHH.T........++......T.HHHHH..............R.",

    "#.............HHHHH..........++........HHHHH...............#",

    "#.........*...HHHHH..........++........HHHHH....*..........#",

    "#.~~~~~~~~~~~~~~~~~~~~~~~~~DDDDDD~~~~~~~~~~~~~~~~~~~~~~~~~.#",

    "#T~~~~~~~~~~~~~~~~~~~~~~~~~DDDDDD~~~~~~~~~~~~~~~~~~~~~~~~~T#",

    "#T~~~~~~~~~~~~~~~~~~~~~~~~~DDDDDD~~~~~~~~~~~~~~~~~~~~~~~~~T#",

    "#TTTTT................................................TTTTT#",

    "#TTTTT................................................TTTTT#",

    "############################################################"

];


/*
==========================================================
FORÊT
==========================================================
*/

const FOREST = [

    "############################################################",

    "#TTTTTTTT............................................TTTTTT#",

    "#TTTTTT................................................TTTT#",

    "#TTTT...................................................TT#",

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

    "#TTTT................................................TTTTTT#",

    "#TTTTTT............................................TTTTTTT#",

    "############################################################"

];


/*
==========================================================
ÉTAT
==========================================================
*/

let WORLD = [...VILLAGE];

let currentMap = "village";


/*
==========================================================
CHARGER LE VILLAGE
==========================================================
*/

function loadVillage() {

    currentMap = "village";

    WORLD = [...VILLAGE];

    /*
    =====================================================
    SPAWN SÉCURISÉ
    =====================================================

    On cherche une vraie case libre dans le village
    au lieu de supposer qu'une coordonnée est libre.
    */

    const T = Game.tileSize;

    const spawnX = 29;
    const spawnY = 21;

    player.x =
        spawnX * T;

    player.y =
        spawnY * T;


    /*
    Vérification de sécurité.
    */

    if (
        collision(
            player.x,
            player.y,
            player.width || 32,
            player.height || 48
        )
    ) {

        /*
        On cherche automatiquement
        une case de chemin.
        */

        for (
            let y = 0;
            y < WORLD.length;
            y++
        ) {

            let found = false;

            for (
                let x = 0;
                x < WORLD[y].length;
                x++
            ) {

                if (
                    WORLD[y][x] === "+" ||
                    WORLD[y][x] === "."
                ) {

                    player.x =
                        x * T;

                    player.y =
                        y * T;

                    found = true;

                    break;
                }
            }

            if (found)
                break;
        }
    }
}

/*
==========================================================
CHARGER LA FORÊT
==========================================================
*/

function loadForest() {

    currentMap =
        "forest";

    WORLD =
        [...FOREST];


    player.x =
        2 * Game.tileSize;

    player.y =
        2 * Game.tileSize;

}


/*
==========================================================
SOLIDE
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
COLLISION
==========================================================
*/

function collision(
    x,
    y,
    w,
    h
) {

    const T =
        Game.tileSize;


    const left =
        Math.floor(
            x / T
        );

    const right =
        Math.floor(
            (x + w - 1) / T
        );

    const top =
        Math.floor(
            y / T
        );

    const bottom =
        Math.floor(
            (y + h - 1) / T
        );


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

    const ctx =
        Game.ctx;

    const T =
        Game.tileSize;


    /*
    ======================================================
    CAMERA
    ======================================================
    */

    Game.camera.x =
        player.x -
        Game.canvas.width / 2;

    Game.camera.y =
        player.y -
        Game.canvas.height / 2;


    /*
    Empêcher la caméra de sortir du monde.
    */

    const worldWidth =
        WORLD[0].length * T;

    const worldHeight =
        WORLD.length * T;


    Game.camera.x =
        Math.max(
            0,
            Math.min(
                Game.camera.x,
                worldWidth -
                Game.canvas.width
            )
        );


    Game.camera.y =
        Math.max(
            0,
            Math.min(
                Game.camera.y,
                worldHeight -
                Game.canvas.height
            )
        );


    /*
    ======================================================
    TILES
    ======================================================
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
            Pont réparé
            */

            if (
                tile === "D" &&
                bridgeOpen
            ) {

                tile = "+";
            }


            const dx =
                x * T -
                Game.camera.x;

            const dy =
                y * T -
                Game.camera.y;


            /*
            ==================================================
            SOL DE BASE
            ==================================================
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
            ==================================================
            HERBE
            ==================================================
            */

            if (tile === ".") {

                drawGrass(
                    ctx,
                    dx,
                    dy,
                    x,
                    y
                );
            }


            /*
            ==================================================
            MUR
            ==================================================
            */

            else if (tile === "#") {

                drawWall(
                    ctx,
                    dx,
                    dy
                );
            }


            /*
            ==================================================
            ARBRE
            ==================================================
            */

            else if (tile === "T") {

                drawTree(
                    ctx,
                    dx,
                    dy
                );
            }


            /*
            ==================================================
            MAISON
            ==================================================
            */

            else if (tile === "H") {

                drawHouse(
                    ctx,
                    dx,
                    dy
                );
            }


            /*
            ==================================================
            PALAIS
            ==================================================
            */

            else if (tile === "P") {

                drawPalaceTile(
                    ctx,
                    dx,
                    dy
                );
            }


            /*
            ==================================================
            PLACE
            ==================================================
            */

            else if (tile === "S") {

                drawPlaza(
                    ctx,
                    dx,
                    dy,
                    x,
                    y
                );
            }


            /*
            ==================================================
            CHEMIN
            ==================================================
            */

            else if (tile === "+") {

                drawPath(
                    ctx,
                    dx,
                    dy
                );
            }


            /*
            ==================================================
            FLEURS
            ==================================================
            */

            else if (tile === "*") {

                drawFlowers(
                    ctx,
                    dx,
                    dy
                );
            }


            /*
            ==================================================
            EAU
            ==================================================
            */

            else if (tile === "~") {

                drawWater(
                    ctx,
                    dx,
                    dy,
                    x
                );
            }


            /*
            ==================================================
            PONT
            ==================================================
            */

            else if (tile === "D") {

                drawBridge(
                    ctx,
                    dx,
                    dy
                );
            }


            /*
            ==================================================
            SORTIE
            ==================================================
            */

            else if (tile === "R") {

                drawExit(
                    ctx,
                    dx,
                    dy
                );
            }
        }
    }


    /*
    ======================================================
    DÉCOR SUPPLÉMENTAIRE
    ======================================================
    */

    drawPalaceDecoration();

    drawVillageDecoration();
}


/*
==========================================================
HERBE
==========================================================
*/

function drawGrass(
    ctx,
    x,
    y,
    gx,
    gy
) {

    ctx.fillStyle =
        "#72d45c";

    ctx.fillRect(
        x,
        y,
        Game.tileSize,
        Game.tileSize
    );


    /*
    Herbe sombre déterministe.
    */

    const seed =
        (gx * 17 + gy * 31) % 7;


    if (seed < 3) {

        ctx.fillStyle =
            "rgba(40,100,45,.20)";

        ctx.fillRect(
            x + 10,
            y + 13,
            3,
            8
        );

        ctx.fillRect(
            x + 38,
            y + 34,
            3,
            7
        );
    }
}


/*
==========================================================
MUR
==========================================================
*/

function drawWall(
    ctx,
    x,
    y
) {

    ctx.fillStyle =
        "#263238";

    ctx.fillRect(
        x,
        y,
        Game.tileSize,
        Game.tileSize
    );


    ctx.fillStyle =
        "#37474f";

    ctx.fillRect(
        x + 3,
        y + 4,
        Game.tileSize - 6,
        8
    );


    ctx.fillStyle =
        "rgba(0,0,0,.25)";

    ctx.fillRect(
        x + 6,
        y + 45,
        Game.tileSize - 12,
        5
    );
}


/*
==========================================================
ARBRE
==========================================================
*/

function drawTree(
    ctx,
    x,
    y
) {

    const T =
        Game.tileSize;


    /*
    Ombre
    */

    ctx.fillStyle =
        "rgba(0,0,0,.20)";

    ctx.beginPath();

    ctx.ellipse(
        x + T / 2,
        y + T - 5,
        23,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
    Tronc
    */

    ctx.fillStyle =
        "#5d4037";

    ctx.fillRect(
        x + 26,
        y + 31,
        12,
        29
    );


    /*
    Feuillage principal
    */

    ctx.fillStyle =
        "#1b5e20";

    ctx.beginPath();

    ctx.arc(
        x + 32,
        y + 26,
        25,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
    Feuillage clair
    */

    ctx.fillStyle =
        "#2e7d32";

    ctx.beginPath();

    ctx.arc(
        x + 20,
        y + 20,
        14,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        x + 44,
        y + 18,
        15,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


/*
==========================================================
MAISON
==========================================================
*/

function drawHouse(
    ctx,
    x,
    y
) {

    const T =
        Game.tileSize;


    /*
    Mur
    */

    ctx.fillStyle =
        "#bd8b57";

    ctx.fillRect(
        x,
        y,
        T,
        T
    );


    /*
    Ombre du toit
    */

    ctx.fillStyle =
        "#6e3525";

    ctx.fillRect(
        x + 4,
        y + 6,
        T - 8,
        12
    );


    /*
    Toit
    */

    ctx.fillStyle =
        "#8b4a2d";

    ctx.fillRect(
        x + 8,
        y + 2,
        T - 16,
        9
    );


    /*
    Porte
    */

    ctx.fillStyle =
        "#4e342e";

    ctx.fillRect(
        x + 23,
        y + 32,
        18,
        32
    );


    /*
    Poignée
    */

    ctx.fillStyle =
        "#d6b44f";

    ctx.fillRect(
        x + 35,
        y + 48,
        3,
        3
    );


    /*
    Fenêtre
    */

    ctx.fillStyle =
        "#9bd7e8";

    ctx.fillRect(
        x + 8,
        y + 35,
        13,
        13
    );


    ctx.strokeStyle =
        "#496c78";

    ctx.strokeRect(
        x + 8,
        y + 35,
        13,
        13
    );
}


/*
==========================================================
PALAIS
==========================================================
*/

function drawPalaceTile(
    ctx,
    x,
    y
) {

    const T =
        Game.tileSize;


    ctx.fillStyle =
        "#d8c49a";

    ctx.fillRect(
        x,
        y,
        T,
        T
    );


    /*
    Pierres
    */

    ctx.strokeStyle =
        "rgba(80,65,50,.20)";

    ctx.strokeRect(
        x + 2,
        y + 2,
        T - 4,
        T - 4
    );


    /*
    Bande dorée
    */

    ctx.fillStyle =
        "#a98432";

    ctx.fillRect(
        x,
        y,
        T,
        6
    );


    /*
    Fenêtre
    */

    ctx.fillStyle =
        "#31475a";

    ctx.fillRect(
        x + 20,
        y + 18,
        24,
        24
    );


    ctx.fillStyle =
        "#d8b75a";

    ctx.fillRect(
        x + 30,
        y + 18,
        4,
        24
    );
}


/*
==========================================================
PLACE
==========================================================
*/

function drawPlaza(
    ctx,
    x,
    y,
    gx,
    gy
) {

    const T =
        Game.tileSize;


    ctx.fillStyle =
        "#c9a66b";

    ctx.fillRect(
        x,
        y,
        T,
        T
    );


    ctx.fillStyle =
        "rgba(95,70,40,.12)";

    ctx.fillRect(
        x + 2,
        y + 2,
        T - 4,
        T - 4
    );


    /*
    Dalles.
    */

    ctx.strokeStyle =
        "rgba(80,60,35,.14)";

    ctx.strokeRect(
        x + 1,
        y + 1,
        T - 2,
        T - 2
    );
}


/*
==========================================================
CHEMIN
==========================================================
*/

function drawPath(
    ctx,
    x,
    y
) {

    const T =
        Game.tileSize;


    ctx.fillStyle =
        "#b89562";

    ctx.fillRect(
        x,
        y,
        T,
        T
    );


    ctx.fillStyle =
        "rgba(80,55,30,.13)";

    ctx.fillRect(
        x + 8,
        y + 17,
        5,
        3
    );

    ctx.fillRect(
        x + 41,
        y + 43,
        4,
        3
    );
}


/*
==========================================================
FLEURS
==========================================================
*/

function drawFlowers(
    ctx,
    x,
    y
) {

    const T =
        Game.tileSize;


    ctx.fillStyle =
        "#5fa64f";

    ctx.fillRect(
        x,
        y,
        T,
        T
    );


    ctx.fillStyle =
        "#f4d35e";

    ctx.fillRect(
        x + 20,
        y + 18,
        4,
        4
    );

    ctx.fillRect(
        x + 30,
        y + 30,
        4,
        4
    );


    ctx.fillStyle =
        "#e9a6c5";

    ctx.fillRect(
        x + 40,
        y + 15,
        4,
        4
    );
}


/*
==========================================================
EAU
==========================================================
*/

function drawWater(
    ctx,
    x,
    y,
    gridX
) {

    const T =
        Game.tileSize;


    ctx.fillStyle =
        "#1976a8";

    ctx.fillRect(
        x,
        y,
        T,
        T
    );


    ctx.strokeStyle =
        "rgba(180,235,255,.55)";

    ctx.lineWidth =
        2;


    const wave =
        Math.sin(
            performance.now() * .003 +
            gridX
        ) * 3;


    ctx.beginPath();

    ctx.moveTo(
        x + 5,
        y + 27 + wave
    );

    ctx.lineTo(
        x + T - 5,
        y + 27 + wave
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        x + 18,
        y + 47 - wave
    );

    ctx.lineTo(
        x + T - 15,
        y + 47 - wave
    );

    ctx.stroke();
}


/*
==========================================================
PONT
==========================================================
*/

function drawBridge(
    ctx,
    x,
    y
) {

    const T =
        Game.tileSize;


    ctx.fillStyle =
        "#795548";

    ctx.fillRect(
        x,
        y,
        T,
        T
    );


    ctx.fillStyle =
        "#a66a3f";

    ctx.fillRect(
        x + 4,
        y + 8,
        T - 8,
        8
    );

    ctx.fillRect(
        x + 4,
        y + 28,
        T - 8,
        8
    );

    ctx.fillRect(
        x + 4,
        y + 48,
        T - 8,
        8
    );
}


/*
==========================================================
SORTIE
==========================================================
*/

function drawExit(
    ctx,
    x,
    y
) {

    const T =
        Game.tileSize;


    ctx.fillStyle =
        "#4f9b48";

    ctx.fillRect(
        x,
        y,
        T,
        T
    );


    /*
    Ouverture vers la forêt.
    */

    ctx.fillStyle =
        "#173d20";

    ctx.beginPath();

    ctx.arc(
        x + T / 2,
        y + T / 2,
        24,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#8acb62";

    ctx.fillRect(
        x + 26,
        y + 9,
        12,
        42
    );
}


/*
==========================================================
DÉCOR DU PALAIS
==========================================================
*/

function drawPalaceDecoration() {

    const ctx =
        Game.ctx;

    const T =
        Game.tileSize;


    const px =
        25 * T -
        Game.camera.x;

    const py =
        6 * T -
        Game.camera.y;


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
        py + T * 3,
        T * 2,
        T * 2
    );


    /*
    Portes.
    */

    ctx.fillStyle =
        "#3e2723";

    ctx.fillRect(
        px + T * 3.2,
        py + T * 3.2,
        T * .8,
        T * 1.8
    );

    ctx.fillRect(
        px + T * 4,
        py + T * 3.2,
        T * .8,
        T * 1.8
    );


    /*
    Blason.
    */

    ctx.fillStyle =
        "#d6b44f";

    ctx.beginPath();

    ctx.arc(
        px + T * 3.9,
        py + T * 2.2,
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
        py - T * .5,
        T,
        T * 3
    );

    ctx.fillRect(
        px + T * 4.8,
        py - T * .5,
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

    const ctx =
        Game.ctx;

    const T =
        Game.tileSize;


    /*
    ======================================================
    FONTAINE CENTRALE
    ======================================================
    */

    const fx =
        29.5 * T -
        Game.camera.x;

    const fy =
        12.5 * T -
        Game.camera.y;


    if (
        fx > -100 &&
        fx < Game.canvas.width + 100 &&
        fy > -100 &&
        fy < Game.canvas.height + 100
    ) {

        /*
        Ombre.
        */

        ctx.fillStyle =
            "rgba(0,0,0,.20)";

        ctx.beginPath();

        ctx.ellipse(
            fx,
            fy + 22,
            42,
            12,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
        Bassin.
        */

        ctx.fillStyle =
            "#8a7358";

        ctx.beginPath();

        ctx.arc(
            fx,
            fy,
            34,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
        Eau.
        */

        ctx.fillStyle =
            "#3c9bc2";

        ctx.beginPath();

        ctx.arc(
            fx,
            fy,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
        Pilier.
        */

        ctx.fillStyle =
            "#c8b18a";

        ctx.fillRect(
            fx - 7,
            fy - 30,
            14,
            30
        );


        /*
        Petite couronne d'eau.
        */

        ctx.fillStyle =
            "#7ccbe7";

        ctx.fillRect(
            fx - 3,
            fy - 42,
            6,
            12
        );
    }


    /*
    ======================================================
    LAMPES
    ======================================================
    */

    const lamps = [

        [18, 8],
        [41, 8],
        [18, 17],
        [41, 17],
        [23, 19],
        [36, 19]

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
            lx < -70 ||
            lx > Game.canvas.width + 70
        ) {

            continue;
        }


        /*
        Halo.
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
        Poteau.
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
        Lampe.
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
