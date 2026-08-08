const Prologue = {

    active: false,

    scene: 0,

    timer: 0,

    textIndex: 0,

    finishedText: false,

    fade: 1,

    fadeDirection: -1,

    visualTime: 0,

    portalParticles: true,


    scenes: [

        {
            title: "IL ÉTAIT UNE FOIS...",
            text:
                "Dans une vallée oubliée des hommes, " +
                "un ancien royaume vivait derrière ses murailles. " +
                "Ponan dormait sous la brume, protégé par ses montagnes. " +
                "Au centre du royaume s'élevait le palais royal.",
            duration: 15000,
            speed: 48
        },

        {
            title: "LE ROYAUME DE PONAN",
            text:
                "Autour du palais s'étendait un village vivant. " +
                "Des marchands, des artisans, des soldats et des familles " +
                "y avaient bâti leur existence. " +
                "Tous regardaient la couronne comme un symbole de protection.",
            duration: 16000,
            speed: 48
        },

        {
            title: "PONANINI III",
            text:
                "Sur ce trône régnait Ponanini III. " +
                "Un roi imparfait, mais juste. " +
                "Il écoutait son peuple, protégeait ses terres " +
                "et croyait encore qu'un royaume pouvait être gouverné " +
                "sans sacrifier ceux qui y vivaient.",
            duration: 17500,
            speed: 47
        },

        {
            title: "DANS L'OMBRE",
            text:
                "Mais derrière les murs du palais, quelqu'un attendait. " +
                "Un frère qui regardait la couronne depuis trop longtemps. " +
                "Il ne rêvait pas de servir le royaume. " +
                "Il rêvait de le posséder.",
            duration: 15500,
            speed: 47
        },

        {
            title: "LE COMPLOT",
            text:
                "La couronne fut retirée de son écrin. " +
                "Les premiers mensonges furent préparés. " +
                "Chaque accusation devait paraître crédible. " +
                "Chaque témoin devait avoir une raison de se taire.",
            duration: 16000,
            speed: 46
        },

        {
            title: "LA TRAHISON",
            text:
                "Ponanini IV descendit alors parmi le peuple. " +
                "Il parla aux villageois, leur promit la sécurité " +
                "et leur raconta une histoire fabriquée. " +
                "Puis, dans l'ombre, il acheta le silence des gardes.",
            duration: 18000,
            speed: 45
        },

        {
            title: "LE BANNISSEMENT",
            text:
                "Le lendemain, Ponanini III fut arrêté devant son peuple. " +
                "Quatre gardes l'escortèrent jusqu'à la cour du palais. " +
                "Personne n'osa intervenir. " +
                "Un portail s'ouvrit devant lui. " +
                "Et derrière ce portail attendait un monde sans retour.",
            duration: 18500,
            speed: 44
        },

     {
    title: "LE SCEAU DU NETHER",

    text:
        "Le Nether ne fut pas seulement son exil. " +
        "Avant d'être banni, un ancien sceau fut gravé sur son destin. " +
        "Même si quelqu'un venait jusqu'à lui, " +
        "même si une porte s'ouvrait devant lui, " +
        "Ponanini III ne pourrait pas franchir le passage. " +
        "Le sceau ne peut être brisé que par trois fragments anciens.",

    duration: 19000,

    speed: 45
},
        {
    title: "LES TROIS FRAGMENTS",

    text:
        "Le premier fragment repose dans les cendres du Nether. " +
        "Il porte la marque de la Terre et peut affaiblir le sceau. " +
        "Le second fut perdu dans les profondeurs du royaume. " +
        "Il porte la marque du Passage. " +
        "Le troisième, plus ancien que les deux autres, " +
        "porte la marque de la Couronne. " +
        "Réunis, les trois fragments peuvent enfin briser le sceau.",

    duration: 22000,

    speed: 43
},
     {
    title: "LA PORTE",

    text:
        "Pendant des années, Ponanini III attendit. " +
        "Puis il comprit qu'il ne pouvait briser le sceau seul. " +
        "Il lui fallait quelqu'un du monde extérieur. " +
        "Quelqu'un capable de retrouver les trois fragments. " +
        "Quelqu'un qui croirait encore à son histoire. " +
        "Il choisit alors de t'appeler. " +
        "Mais il ne te raconta pas toute la vérité.",

    duration: 21000,

    speed: 43
},
    ],


    start() {

        this.active = true;

        this.scene = 0;

        this.timer = 0;

        this.textIndex = 0;

        this.finishedText = false;

        this.fade = 1;

        this.fadeDirection = -1;

        this.visualTime = 0;

        this.portalParticles = true;

        this.hideHUD();
    },


    hideHUD() {

        [
            "hud",
            "life",
            "quest",
            "pieces",
            "inventory",
            "dialogue"
        ].forEach(id => {

            const element =
                document.getElementById(id);

            if (element)
                element.style.display = "none";

        });
    },


    update(dt) {

        if (!this.active)
            return;

        const scene =
            this.scenes[this.scene];

        if (!scene)
            return;

        this.timer += dt;

        this.visualTime += dt;


        /*
         * Texte progressif
         */

        this.textIndex =
            Math.floor(
                this.timer *
                1000 /
                scene.speed
            );


        if (
            this.textIndex >=
            scene.text.length
        ) {

            this.textIndex =
                scene.text.length;

            this.finishedText = true;
        }


        /*
         * Fade d'entrée
         */

        if (
            this.fadeDirection === -1
        ) {

            this.fade -=
                dt * .75;

            if (this.fade <= 0) {

                this.fade = 0;

                this.fadeDirection = 0;
            }
        }


        /*
         * Scène 7 :
         * fermeture du portail très rapide.
         */

        if (
            this.scene === 6 &&
            this.visualTime > 8.7
        ) {

            this.portalParticles = false;
        }


        if (
            this.finishedText &&
            this.timer >=
            scene.duration / 1000
        ) {

            this.nextScene();
        }
    },


    nextScene() {

        if (
            this.scene >=
            this.scenes.length - 1
        ) {

            this.finish();

            return;
        }


        this.scene++;

        this.timer = 0;

        this.textIndex = 0;

        this.finishedText = false;

        this.fade = 1;

        this.fadeDirection = -1;

        this.visualTime = 0;

        this.portalParticles = true;
    },


    skipText() {

        const scene =
            this.scenes[this.scene];

        if (!scene)
            return;


        if (!this.finishedText) {

            this.textIndex =
                scene.text.length;

            this.finishedText = true;

            return;
        }


        this.nextScene();
    },


    finish() {

        this.active = false;

        this.portalParticles = false;

        if (
            typeof finishPrologue ===
            "function"
        ) {

            finishPrologue();

        } else {

            Game.running = true;
        }
    },


    draw() {

        const ctx = Game.ctx;

        ctx.clearRect(
            0,
            0,
            Game.canvas.width,
            Game.canvas.height
        );


        switch (this.scene) {

            case 0:
                this.drawScene1();
                break;

            case 1:
                this.drawScene2();
                break;

            case 2:
                this.drawScene3();
                break;

            case 3:
                this.drawScene4();
                break;

            case 4:
                this.drawScene5();
                break;

            case 5:
                this.drawScene6();
                break;

            case 6:
                this.drawScene7();
                break;

            case 7:
                this.drawScene8();
                break;

            case 8:
                this.drawScene9();
                break;

            case 9:
                this.drawScene10();
                break;
        }


        this.drawVignette();

        this.drawNarration();

        if (this.fade > 0) {

            ctx.fillStyle =
                `rgba(0,0,0,${this.fade})`;

            ctx.fillRect(
                0,
                0,
                Game.canvas.width,
                Game.canvas.height
            );
        },
        drawWindParticles(count) {

    const ctx = Game.ctx;

    const width =
        Game.canvas.width;

    const height =
        Game.canvas.height;


    ctx.save();

    ctx.strokeStyle =
        "rgba(170,180,190,0.20)";

    ctx.lineWidth = 1;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const x =
            (
                i * 91 +
                this.visualTime * 30
            ) % width;


        const y =
            (
                i * 53 +
                this.visualTime * 11
            ) % height;


        ctx.beginPath();

        ctx.moveTo(
            x,
            y
        );

        ctx.lineTo(
            x + 18,
            y - 3
        );

        ctx.stroke();

    }


    ctx.restore();

},
    },


    /* =====================================================
       SCÈNE 1
       VUE AÉRIENNE DU VILLAGE
    ===================================================== */


drawScene1() {

    const ctx = Game.ctx;
    const width = Game.canvas.width;
    const height = Game.canvas.height;

    /*
    ======================================================
    SCÈNE 1
    VUE AÉRIENNE DU ROYAUME
    ======================================================
    */

    const t = this.visualTime;

    /*
    Ciel nocturne.
    */

    const sky = ctx.createLinearGradient(
        0,
        0,
        0,
        height
    );

    sky.addColorStop(0, "#05070d");
    sky.addColorStop(.45, "#111827");
    sky.addColorStop(1, "#070a0f");

    ctx.fillStyle = sky;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
    ======================================================
    LUNE
    ======================================================
    */

    ctx.save();

    ctx.globalAlpha = .82;

    ctx.fillStyle = "#ddd3a2";

    ctx.beginPath();

    ctx.arc(
        width * .82,
        height * .16,
        42,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();


    /*
    ======================================================
    MONTAGNES
    ======================================================
    */

    ctx.fillStyle = "#080d16";

    ctx.beginPath();

    ctx.moveTo(
        0,
        height * .48
    );

    ctx.lineTo(
        width * .12,
        height * .30
    );

    ctx.lineTo(
        width * .23,
        height * .47
    );

    ctx.lineTo(
        width * .36,
        height * .26
    );

    ctx.lineTo(
        width * .49,
        height * .47
    );

    ctx.lineTo(
        width * .63,
        height * .31
    );

    ctx.lineTo(
        width * .76,
        height * .47
    );

    ctx.lineTo(
        width * .90,
        height * .28
    );

    ctx.lineTo(
        width,
        height * .45
    );

    ctx.lineTo(
        width,
        height
    );

    ctx.lineTo(
        0,
        height
    );

    ctx.closePath();

    ctx.fill();


    /*
    ======================================================
    BRUME LOINTAINE
    ======================================================
    */

    ctx.save();

    ctx.globalAlpha = .10;

    for (let i = 0; i < 5; i++) {

        const fogX =
            ((t * (5 + i) + i * 240) %
            (width + 500)) - 250;

        ctx.fillStyle = "#b9c0c7";

        ctx.beginPath();

        ctx.ellipse(
            fogX,
            height * (.42 + i * .045),
            220,
            25,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    ctx.restore();


    /*
    ======================================================
    VILLAGE
    ======================================================

    Le village entier est maintenant considéré comme
    UN SEUL décor.

    Le palais est positionné au centre.
    */

    const villageScale = .95;

    const villageX =
        width / 2;

    const villageY =
        height * .57;


    ctx.save();

    ctx.translate(
        villageX,
        villageY
    );

    ctx.scale(
        villageScale,
        villageScale
    );


    /*
    ------------------------------------------------------
    SOL DU VILLAGE
    ------------------------------------------------------
    */

    ctx.fillStyle = "#273b28";

    ctx.beginPath();

    ctx.ellipse(
        0,
        55,
        width * .43,
        height * .27,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
    ------------------------------------------------------
    RIVIÈRE
    ------------------------------------------------------
    */

    ctx.fillStyle = "#173b52";

    ctx.beginPath();

    ctx.moveTo(
        -width * .43,
        160
    );

    ctx.quadraticCurveTo(
        -width * .10,
        110,
        width * .10,
        155
    );

    ctx.quadraticCurveTo(
        width * .25,
        190,
        width * .43,
        125
    );

    ctx.lineTo(
        width * .43,
        230
    );

    ctx.quadraticCurveTo(
        width * .22,
        260,
        width * .05,
        215
    );

    ctx.quadraticCurveTo(
        -width * .15,
        165,
        -width * .43,
        220
    );

    ctx.closePath();

    ctx.fill();


    /*
    ------------------------------------------------------
    PETITS REFLETS DE L'EAU
    ------------------------------------------------------
    */

    ctx.strokeStyle =
        "rgba(130,190,215,.28)";

    ctx.lineWidth = 2;

    for (let i = 0; i < 8; i++) {

        const waterX =
            -width * .35 +
            i * width * .10;

        const waterY =
            175 +
            Math.sin(
                t * .7 + i
            ) * 4;

        ctx.beginPath();

        ctx.moveTo(
            waterX,
            waterY
        );

        ctx.lineTo(
            waterX + 35,
            waterY
        );

        ctx.stroke();

    }


    /*
    ------------------------------------------------------
    MAISONS
    ------------------------------------------------------
    */

    this.drawVillageHouse(
        -width * .30,
        10,
        .80
    );

    this.drawVillageHouse(
        -width * .18,
        -40,
        .65
    );

    this.drawVillageHouse(
        width * .25,
        -10,
        .80
    );

    this.drawVillageHouse(
        width * .34,
        55,
        .65
    );

    this.drawVillageHouse(
        -width * .34,
        110,
        .62
    );


    /*
    ------------------------------------------------------
    PLACE ROYALE
    ------------------------------------------------------
    */

    ctx.fillStyle = "#927b58";

    ctx.beginPath();

    ctx.ellipse(
        0,
        35,
        width * .18,
        height * .10,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
    ------------------------------------------------------
    PALAIS
    ------------------------------------------------------

    IMPORTANT :
    Le palais est dessiné ici dans le même repère
    que le village.

    Il ne peut donc plus "glisser".
    */

    this.drawAerialPalace(
        0,
        -5,
        1
    );


    /*
    ------------------------------------------------------
    PONT
    ------------------------------------------------------
    */

    ctx.fillStyle =
        "#65452f";

    ctx.fillRect(
        -28,
        145,
        56,
        20
    );


    /*
    planches
    */

    ctx.strokeStyle =
        "#38251b";

    ctx.lineWidth = 3;

    for (
        let x = -20;
        x <= 20;
        x += 10
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            145
        );

        ctx.lineTo(
            x,
            165
        );

        ctx.stroke();

    }


    ctx.restore();


    /*
    ======================================================
    BRUME BASSE
    ======================================================
    */

    this.drawAerialFog();


    /*
    ======================================================
    PLUIE
    ======================================================
    */

    this.drawRain(
        70
    );


    /*
    ======================================================
    PARTICULES
    ======================================================
    */

    this.drawDust(
        25
    );

},


    /* =====================================================
       SCÈNE 2
       TRAVELLING AÉRIEN
    ===================================================== */

drawScene2() {

    const ctx = Game.ctx;
    const width = Game.canvas.width;
    const height = Game.canvas.height;

    /*
    ======================================================
    SCÈNE 2
    DESCENTE VERS LE PALAIS
    ======================================================
    */

    const duration = 13;

    const progress =
        Math.min(
            1,
            this.visualTime / duration
        );


    /*
    Courbe de caméra douce.
    */

    const ease =
        progress *
        progress *
        (3 - 2 * progress);


    /*
    ------------------------------------------------------
    CIEL
    ------------------------------------------------------
    */

    const sky =
        ctx.createLinearGradient(
            0,
            0,
            0,
            height
        );

    sky.addColorStop(
        0,
        "#05070d"
    );

    sky.addColorStop(
        .55,
        "#101724"
    );

    sky.addColorStop(
        1,
        "#080b11"
    );

    ctx.fillStyle =
        sky;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
    ------------------------------------------------------
    MONTAGNES
    ------------------------------------------------------
    */

    ctx.fillStyle =
        "#080d16";

    ctx.beginPath();

    ctx.moveTo(
        0,
        height * .52
    );

    ctx.lineTo(
        width * .15,
        height * .35
    );

    ctx.lineTo(
        width * .31,
        height * .52
    );

    ctx.lineTo(
        width * .48,
        height * .32
    );

    ctx.lineTo(
        width * .66,
        height * .52
    );

    ctx.lineTo(
        width * .83,
        height * .36
    );

    ctx.lineTo(
        width,
        height * .52
    );

    ctx.lineTo(
        width,
        height
    );

    ctx.lineTo(
        0,
        height
    );

    ctx.closePath();

    ctx.fill();


    /*
    ======================================================
    CAMÉRA
    ======================================================

    On rapproche toute la scène du même facteur.

    Le palais, les maisons, la place et la rivière
    restent donc parfaitement solidaires.
    */

    const cameraScale =
        1 +
        ease * .85;


    const cameraY =
        ease * 80;


    ctx.save();


    ctx.translate(
        width / 2,
        height * .62 - cameraY
    );


    ctx.scale(
        cameraScale,
        cameraScale
    );


    /*
    Village entier.
    */

    ctx.fillStyle =
        "#273b28";

    ctx.beginPath();

    ctx.ellipse(
        0,
        55,
        width * .43,
        height * .27,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
    Rivière.
    */

    ctx.fillStyle =
        "#173b52";

    ctx.beginPath();

    ctx.moveTo(
        -width * .43,
        160
    );

    ctx.quadraticCurveTo(
        -width * .10,
        110,
        width * .10,
        155
    );

    ctx.quadraticCurveTo(
        width * .25,
        190,
        width * .43,
        125
    );

    ctx.lineTo(
        width * .43,
        230
    );

    ctx.quadraticCurveTo(
        width * .22,
        260,
        width * .05,
        215
    );

    ctx.quadraticCurveTo(
        -width * .15,
        165,
        -width * .43,
        220
    );

    ctx.closePath();

    ctx.fill();


    /*
    Maisons.
    */

    this.drawVillageHouse(
        -width * .30,
        10,
        .80
    );

    this.drawVillageHouse(
        width * .25,
        -10,
        .80
    );

    this.drawVillageHouse(
        -width * .34,
        110,
        .62
    );

    this.drawVillageHouse(
        width * .34,
        55,
        .65
    );


    /*
    Place.
    */

    ctx.fillStyle =
        "#927b58";

    ctx.beginPath();

    ctx.ellipse(
        0,
        35,
        width * .18,
        height * .10,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
    ======================================================
    PALAIS
    ======================================================
    */

    this.drawAerialPalace(
        0,
        -5,
        1
    );


    ctx.restore();


    /*
    ------------------------------------------------------
    FOCUS LUMINEUX
    ------------------------------------------------------
    */

    const focus =
        ctx.createRadialGradient(
            width / 2,
            height * .47,
            height * .08,
            width / 2,
            height * .47,
            height * .72
        );

    focus.addColorStop(
        0,
        "rgba(0,0,0,0)"
    );

    focus.addColorStop(
        .7,
        "rgba(0,0,0,.08)"
    );

    focus.addColorStop(
        1,
        "rgba(0,0,0,.55)"
    );

    ctx.fillStyle =
        focus;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
    ------------------------------------------------------
    BRUME
    ------------------------------------------------------
    */

    this.drawAerialFog();


    /*
    ------------------------------------------------------
    PLUIE
    ------------------------------------------------------
    */

    this.drawRain(
        55
    );


    /*
    ------------------------------------------------------
    VENT
    ------------------------------------------------------
    */

    this.drawWindParticles(
        25
    );

},

    /* =====================================================
       SCÈNE 3
       TRÔNE
    ===================================================== */

    drawScene3() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        this.drawThroneRoom();


        const throneX =
            w / 2;

        const throneY =
            h * .62;


        this.drawThrone(
            throneX,
            throneY
        );


        /*
         * Ombre sous le roi.
         */

        ctx.fillStyle =
            "rgba(0,0,0,.40)";


        ctx.beginPath();

        ctx.ellipse(
            throneX,
            throneY - 18,
            44,
            9,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * Roi réellement assis.
         */

        this.drawDuckKing(
            throneX,
            throneY - 76,
            .82
        );


        this.drawGuard(
            w * .17,
            h * .57
        );


        this.drawGuard(
            w * .83,
            h * .57
        );


        this.drawTorch(
            w * .08,
            h * .48
        );


        this.drawTorch(
            w * .92,
            h * .48
        );


        this.drawDust(
            45
        );
    },


    /* =====================================================
       SCÈNE 4
       OMBRE
    ===================================================== */

    drawScene4() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        this.drawThroneRoom();


        this.drawThrone(
            w / 2,
            h * .62
        );


        /*
         * Aucun élément blanc.
         */

        this.drawTorch(
            w * .10,
            h * .48
        );


        this.drawTorch(
            w * .90,
            h * .48
        );


        /*
         * IV est uniquement suggéré
         * par ses yeux.
         */

        this.drawVillainEyes(
            w * .79,
            h * .28
        );


        /*
         * Ombre profonde.
         */

        const shadow =
            ctx.createLinearGradient(
                0,
                0,
                w,
                0
            );


        shadow.addColorStop(
            0,
            "rgba(0,0,0,.15)"
        );


        shadow.addColorStop(
            .55,
            "rgba(0,0,0,.25)"
        );


        shadow.addColorStop(
            1,
            "rgba(0,0,0,.80)"
        );


        ctx.fillStyle =
            shadow;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        this.drawVillainEyes(
            w * .79,
            h * .28
        );


        this.drawDust(
            35
        );
    },


    /* =====================================================
       SCÈNE 5
       COURONNE SUR LA TABLE
    ===================================================== */

    drawScene5() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        this.drawThroneRoom();


        /*
         * Table royale.
         */

        const tableY =
            h * .65;


        ctx.fillStyle =
            "#3a261c";


        ctx.fillRect(
            w * .25,
            tableY,
            w * .50,
            28
        );


        ctx.fillStyle =
            "#211510";


        ctx.fillRect(
            w * .29,
            tableY + 28,
            20,
            105
        );


        ctx.fillRect(
            w * .69,
            tableY + 28,
            20,
            105
        );


        /*
         * Coussin royal.
         */

        ctx.fillStyle =
            "#63242f";


        ctx.fillRect(
            w / 2 - 65,
            tableY - 35,
            130,
            30
        );


        ctx.strokeStyle =
            "#a78338";


        ctx.lineWidth = 2;


        ctx.strokeRect(
            w / 2 - 65,
            tableY - 35,
            130,
            30
        );


        /*
         * COURONNE SUR LE SUPPORT.
         *
         * Aucun œil rouge.
         */

        this.drawCrown(
            w / 2,
            tableY - 48,
            .68
        );


        /*
         * Documents.
         */

        ctx.fillStyle =
            "#cfc1a0";


        ctx.save();

        ctx.translate(
            w * .35,
            tableY - 2
        );

        ctx.rotate(-.06);

        ctx.fillRect(
            -55,
            -18,
            110,
            65
        );

        ctx.restore();


        ctx.save();

        ctx.translate(
            w * .65,
            tableY - 3
        );

        ctx.rotate(.05);

        ctx.fillRect(
            -55,
            -18,
            110,
            65
        );

        ctx.restore();


        /*
         * Ombre de IV très subtile,
         * mais aucun visage.
         */

        ctx.fillStyle =
            "rgba(0,0,0,.48)";


        ctx.beginPath();

        ctx.ellipse(
            w * .78,
            h * .42,
            70,
            150,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        this.drawTorch(
            w * .12,
            h * .47
        );


        this.drawTorch(
            w * .88,
            h * .47
        );


        this.drawDust(
            50
        );
    },


    /* =====================================================
       SCÈNE 6
       IV MANIPULE LE VILLAGE
    ===================================================== */

    drawScene6() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        this.drawVillageStreet();


        /*
         * Ponanini IV apparaît enfin.
         */

        this.drawDuckVillainFull(
            w * .30,
            h * .47,
            .82
        );


        /*
         * Villageois.
         */

        this.drawVillager(
            w * .48,
            h * .54,
            .9
        );


        this.drawVillager(
            w * .57,
            h * .57,
            .85
        );


        this.drawVillager(
            w * .66,
            h * .53,
            .9
        );


        /*
         * Garde soudoyé.
         */

        this.drawGuard(
            w * .82,
            h * .52
        );


        /*
         * Bourse.
         */

        const bagX =
            w * .72;


        const bagY =
            h * .57;


        ctx.fillStyle =
            "#6f4627";


        ctx.beginPath();

        ctx.arc(
            bagX,
            bagY,
            11,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle =
            "#b78c42";


        ctx.beginPath();

        ctx.moveTo(
            bagX - 8,
            bagY - 7
        );

        ctx.lineTo(
            bagX + 8,
            bagY - 7
        );

        ctx.stroke();


        /*
         * Mouvement de la bourse
         * vers le garde.
         */

        const exchange =
            Math.min(
                1,
                this.visualTime / 6
            );


        const ex =
            w * .68 +
            exchange * w * .12;


        ctx.fillStyle =
            "#8a5b2c";


        ctx.beginPath();

        ctx.arc(
            ex,
            h * .58,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * IV parle aux villageois.
         */

        this.drawSpeechBubble(
            w * .30,
            h * .31,
            "Votre roi vous a abandonnés."
        );


        /*
         * Quelques silhouettes
         * en arrière-plan.
         */

        this.drawVillager(
            w * .13,
            h * .59,
            .7
        );


        this.drawVillager(
            w * .90,
            h * .59,
            .7
        );


        this.drawWind(
            25
        );
    },


    /* =====================================================
       SCÈNE 7
       ESCORTE + PORTAIL
    ===================================================== */

    drawScene7() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        this.drawCastleCourtyard();


        /*
         * Foule.
         */

        this.drawCrowd(
            h * .69
        );


        /*
         * Position du roi.
         */

        const walkProgress =
            Math.min(
                1,
                this.visualTime / 6
            );


        const kingX =
            w * .28 +
            walkProgress *
            w * .17;


        /*
         * Quatre gardes.
         */

        this.drawGuard(
            kingX - 95,
            h * .57
        );


        this.drawGuard(
            kingX - 45,
            h * .61
        );


        this.drawGuard(
            kingX + 50,
            h * .61
        );


        this.drawGuard(
            kingX + 100,
            h * .57
        );


        /*
         * Portail.
         */

        const portalX =
            w * .52;


        const portalY =
            h * .48;


        const openProgress =
            Math.min(
                1,
                this.visualTime / 2.2
            );


        /*
         * Fermeture rapide.
         */

        let close =
            1;


        if (
            this.visualTime > 7.8
        ) {

            close =
                1 -
                Math.min(
                    1,
                    (
                        this.visualTime -
                        7.8
                    ) /
                    1.25
                );
        }


        const portalScale =
            openProgress *
            close;


        if (portalScale > 0) {

            this.drawPortal(
                portalX,
                portalY,
                portalScale
            );
        }


        /*
         * III avance.
         */

        let kingAlpha =
            1;


        if (
            this.visualTime > 6.2
        ) {

            kingAlpha =
                1 -
                Math.min(
                    1,
                    (
                        this.visualTime -
                        6.2
                    ) /
                    1.6
                );
        }


        if (kingAlpha > 0) {

            ctx.save();

            ctx.globalAlpha =
                kingAlpha;


            this.drawDuckKing(
                kingX,
                h * .53,
                .82
            );


            ctx.restore();
        }


        /*
         * Les gardes poussent III.
         */

        if (
            this.visualTime > 4 &&
            this.visualTime < 7
        ) {

            ctx.strokeStyle =
                "rgba(210,210,210,.35)";


            ctx.lineWidth = 4;


            ctx.beginPath();

            ctx.moveTo(
                kingX + 48,
                h * .55
            );

            ctx.lineTo(
                kingX + 78,
                h * .55
            );

            ctx.stroke();
        }


        /*
         * PARTICULES DU PORTAIL.
         *
         * Elles disparaissent
         * immédiatement après III.
         */

        if (
            this.portalParticles &&
            kingAlpha > 0
        ) {

            this.drawPortalParticles(
                portalX,
                portalY,
                80
            );
        }


        this.drawWind(
            45
        );
    },


    /* =====================================================
       SCÈNE 8
       NETHER
    ===================================================== */

drawScene8() {

    const ctx = Game.ctx;

    const width =
        Game.canvas.width;

    const height =
        Game.canvas.height;


    /*
     * Nether.
     */

    this.drawNetherBackground();


    /*
     * Sol noir.
     */

    this.drawBlackGround();


    this.drawNetherRocks();


    /*
     * Lave uniquement dans le décor lointain.
     *
     * Elle ne doit surtout pas former une ligne
     * juste derrière la tête de Ponanini III.
     */

    this.drawDistantLava(
        height * .82
    );


    /*
     * --------------------------------------------------
     * SCEAU
     *
     * Le symbole est AU SOL.
     * Il n'est jamais au-dessus du personnage.
     * --------------------------------------------------
     */

    const sealX =
        width * .50;

    const sealY =
        height * .78;


    ctx.save();

    ctx.globalAlpha = .72;


    /*
     * Fissures autour du sceau.
     */

    ctx.strokeStyle =
        "#44151b";

    ctx.lineWidth = 3;


    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const angle =
            i * Math.PI / 4;

        const r1 = 30;
        const r2 = 75;

        ctx.beginPath();

        ctx.moveTo(
            sealX +
            Math.cos(angle) * r1,

            sealY +
            Math.sin(angle) * r1
        );

        ctx.lineTo(
            sealX +
            Math.cos(angle) * r2,

            sealY +
            Math.sin(angle) * r2
        );

        ctx.stroke();
    }


    /*
     * Sceau central.
     */

    ctx.strokeStyle =
        "#6b2026";

    ctx.lineWidth = 4;


    ctx.beginPath();

    ctx.arc(
        sealX,
        sealY,
        38,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        sealX - 25,
        sealY - 25
    );

    ctx.lineTo(
        sealX + 25,
        sealY + 25
    );

    ctx.moveTo(
        sealX + 25,
        sealY - 25
    );

    ctx.lineTo(
        sealX - 25,
        sealY + 25
    );

    ctx.stroke();


    ctx.restore();


    /*
     * --------------------------------------------------
     * PONANINI III
     *
     * Un seul personnage.
     * --------------------------------------------------
     */

    const walk =
        Math.sin(
            this.visualTime * 2
        ) * 2;


    const kingX =
        width * .42;


    const kingY =
        height * .60 +
        walk;


    /*
     * Ombre sous ses pieds.
     */

    ctx.fillStyle =
        "rgba(0,0,0,.72)";


    ctx.beginPath();

    ctx.ellipse(
        kingX,
        height * .75,
        68,
        14,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    this.drawDuckKing(
        kingX,
        kingY,
        .88
    );


    /*
     * Aucun trait rouge derrière lui.
     * Aucun cercle flottant.
     */


    this.drawSmoke(
        width * .16,
        height * .72,
        .9
    );


    this.drawSmoke(
        width * .82,
        height * .67,
        1.1
    );


    this.drawEmbers(
        80
    );


    this.drawDust(
        35
    );
},

    /* =====================================================
       SCÈNE 9
       FRAGMENTS
    ===================================================== */

drawScene9() {

    const ctx = Game.ctx;

    const width =
        Game.canvas.width;

    const height =
        Game.canvas.height;


    this.drawNetherBackground();

    this.drawBlackGround();

    this.drawNetherRocks();


    /*
     * Ponanini III reste au centre.
     */

    const kingX =
        width * .38;

    const kingY =
        height * .61;


    ctx.fillStyle =
        "rgba(0,0,0,.70)";


    ctx.beginPath();

    ctx.ellipse(
        kingX,
        height * .76,
        66,
        14,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    this.drawDuckKing(
        kingX,
        kingY,
        .80
    );


    /*
     * ==================================================
     * FRAGMENT 1
     * ==================================================
     */

    const fragment1Time =
        3.0;


    if (
        this.visualTime >
        fragment1Time
    ) {

        const p =
            Math.min(
                1,
                (
                    this.visualTime -
                    fragment1Time
                ) / 1.2
            );


        const ease =
            p * p * (3 - 2 * p);


        ctx.save();

        ctx.globalAlpha =
            ease;


        const x =
            width * .68;

        const y =
            height * .67;


        /*
         * Petite fissure.
         */

        ctx.strokeStyle =
            "#684127";

        ctx.lineWidth = 3;


        ctx.beginPath();

        ctx.moveTo(
            x - 40,
            y + 22
        );

        ctx.lineTo(
            x - 10,
            y
        );

        ctx.lineTo(
            x + 18,
            y + 12
        );

        ctx.lineTo(
            x + 42,
            y - 12
        );

        ctx.stroke();


        this.drawFragment(
            x,
            y,
            "#c79c39"
        );


        ctx.restore();


        /*
         * Petite lumière au moment
         * de sa découverte.
         */

        if (p < 1) {

            ctx.fillStyle =
                `rgba(215,175,70,${(
                    1 - p
                ) * .25})`;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                80 * (1 - p),
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    }


    /*
     * ==================================================
     * FRAGMENT 2
     * ==================================================
     */

    const fragment2Time =
        9.0;


    if (
        this.visualTime >
        fragment2Time
    ) {

        const p =
            Math.min(
                1,
                (
                    this.visualTime -
                    fragment2Time
                ) / 1.2
            );


        const ease =
            p * p * (3 - 2 * p);


        ctx.save();

        ctx.globalAlpha =
            ease;


        const x =
            width * .77;

        const y =
            height * .42;


        /*
         * Rocher qui abrite
         * le fragment.
         */

        ctx.fillStyle =
            "#171317";


        ctx.beginPath();

        ctx.moveTo(
            x - 42,
            y + 35
        );

        ctx.lineTo(
            x - 20,
            y - 22
        );

        ctx.lineTo(
            x + 18,
            y - 45
        );

        ctx.lineTo(
            x + 48,
            y + 15
        );

        ctx.closePath();

        ctx.fill();


        this.drawFragment(
            x,
            y - 8,
            "#526fd0"
        );


        ctx.restore();
    }


    /*
     * ==================================================
     * FRAGMENT 3
     * ==================================================
     */

    const fragment3Time =
        15.0;


    if (
        this.visualTime >
        fragment3Time
    ) {

        const p =
            Math.min(
                1,
                (
                    this.visualTime -
                    fragment3Time
                ) / 1.5
            );


        const ease =
            p * p * (3 - 2 * p);


        ctx.save();

        ctx.globalAlpha =
            ease;


        const x =
            width * .61;

        const y =
            height * .27;


        /*
         * Fragment suspendu dans une fissure
         * rocheuse, pas dans un cercle magique.
         */

        ctx.strokeStyle =
            "#432033";

        ctx.lineWidth = 3;


        ctx.beginPath();

        ctx.moveTo(
            x - 35,
            y - 45
        );

        ctx.lineTo(
            x - 12,
            y - 8
        );

        ctx.lineTo(
            x - 28,
            y + 45
        );

        ctx.moveTo(
            x + 32,
            y - 40
        );

        ctx.lineTo(
            x + 8,
            y
        );

        ctx.lineTo(
            x + 30,
            y + 48
        );

        ctx.stroke();


        this.drawFragment(
            x,
            y,
            "#7955bd"
        );


        ctx.restore();
    }


    /*
     * ==================================================
     * LUEUR FINALE
     * ==================================================
     */

    if (
        this.visualTime > 18
    ) {

        const pulse =
            .10 +
            Math.abs(
                Math.sin(
                    this.visualTime * 2
                )
            ) * .08;


        const glow =
            ctx.createRadialGradient(
                width * .68,
                height * .48,
                10,
                width * .68,
                height * .48,
                300
            );


        glow.addColorStop(
            0,
            `rgba(100,85,190,${pulse})`
        );


        glow.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );


        ctx.fillStyle =
            glow;


        ctx.fillRect(
            0,
            0,
            width,
            height
        );
    }


    this.drawSmoke(
        width * .17,
        height * .72,
        .9
    );


    this.drawSmoke(
        width * .90,
        height * .65,
        1
    );


    this.drawEmbers(
        75
    );
}, 


    /* =====================================================
       SCÈNE 10
       APPEL
    ===================================================== */

    drawScene10() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        this.drawNetherSky();

        this.drawBlackGround();


        /*
         * Portail propre.
         */

        const portalX =
            w * .70;


        const portalY =
            h * .47;


        const pulse =
            1 +
            Math.sin(
                this.visualTime * 2
            ) * .025;


        this.drawPortal(
            portalX,
            portalY,
            pulse
        );


        /*
         * III au premier plan.
         */

        ctx.fillStyle =
            "rgba(0,0,0,.65)";


        ctx.beginPath();

        ctx.ellipse(
            w * .37,
            h * .77,
            65,
            15,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        this.drawDuckKing(
            w * .37,
            h * .59,
            .78
        );


        /*
         * Silhouette du joueur.
         */

        const playerX =
            portalX;


        const playerY =
            h * .67;


        ctx.fillStyle =
            "#030305";


        ctx.beginPath();

        ctx.arc(
            playerX,
            playerY - 55,
            24,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillRect(
            playerX - 26,
            playerY - 28,
            52,
            105
        );


        /*
         * Aucune texture parasite.
         * Seulement une légère lumière
         * venant du portail.
         */

        const light =
            ctx.createRadialGradient(
                portalX,
                portalY,
                30,
                portalX,
                portalY,
                330
            );


        light.addColorStop(
            0,
            "rgba(75,100,255,.18)"
        );


        light.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );


        ctx.fillStyle =
            light;


        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        this.drawPortalParticles(
            portalX,
            portalY,
            35
        );


        this.drawEmbers(
            35
        );
    },


    /* =====================================================
       DÉCOR : CIEL
    ===================================================== */

    drawNightSky() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                h
            );


        gradient.addColorStop(
            0,
            "#060a12"
        );


        gradient.addColorStop(
            .55,
            "#172236"
        );


        gradient.addColorStop(
            1,
            "#090d15"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        /*
         * Lune.
         */

        ctx.fillStyle =
            "#d5ca9c";


        ctx.beginPath();

        ctx.arc(
            w * .78,
            h * .17,
            42,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * Étoiles.
         */

        ctx.fillStyle =
            "rgba(255,255,255,.55)";


        for (
            let i = 0;
            i < 60;
            i++
        ) {

            const x =
                (
                    i * 137
                ) % w;


            const y =
                (
                    i * 71
                ) % (h * .42);


            ctx.fillRect(
                x,
                y,
                1.5,
                1.5
            );
        }
    },


    drawDistantMountains() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        ctx.fillStyle =
            "#0b111b";


        ctx.beginPath();

        ctx.moveTo(
            0,
            h * .48
        );

        ctx.lineTo(
            w * .12,
            h * .25
        );

        ctx.lineTo(
            w * .25,
            h * .48
        );

        ctx.lineTo(
            w * .40,
            h * .20
        );

        ctx.lineTo(
            w * .55,
            h * .48
        );

        ctx.lineTo(
            w * .72,
            h * .28
        );

        ctx.lineTo(
            w,
            h * .48
        );

        ctx.lineTo(
            w,
            h
        );

        ctx.lineTo(
            0,
            h
        );

        ctx.closePath();

        ctx.fill();
    },


    /* =====================================================
       VILLAGE AÉRIEN
    ===================================================== */

    drawAerialVillage(
        centerX,
        centerY,
        scale
    ) {

        const ctx = Game.ctx;


        ctx.save();

        ctx.translate(
            centerX,
            centerY
        );

        ctx.scale(
            scale,
            scale
        );


        /*
         * Place centrale.
         */

        ctx.fillStyle =
            "#20232a";


        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            260,
            145,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * Maisons disposées autour
         * du palais.
         */

        const houses = [

            [-300, -100],
            [-200, -160],
            [-90, -185],
            [90, -185],
            [200, -150],
            [300, -90],

            [-330, 35],
            [-235, 100],
            [235, 100],
            [330, 35],

            [-170, 185],
            [170, 185]

        ];


        houses.forEach(
            ([x, y], i) => {

                this.drawAerialHouse(
                    x,
                    y,
                    .85 +
                    (i % 3) * .08
                );
            }
        );


        /*
         * Routes.
         */

        ctx.strokeStyle =
            "#101217";


        ctx.lineWidth = 28;


        [
            [0, -300, 0, 300],
            [-390, 0, 390, 0],
            [-280, -210, 280, 210],
            [280, -210, -280, 210]

        ].forEach(
            line => {

                ctx.beginPath();

                ctx.moveTo(
                    line[0],
                    line[1]
                );

                ctx.lineTo(
                    line[2],
                    line[3]
                );

                ctx.stroke();
            }
        );


        ctx.restore();
    },


    drawAerialHouse(
        x,
        y,
        scale
    ) {

        const ctx = Game.ctx;


        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.scale(
            scale,
            scale
        );


        ctx.fillStyle =
            "#171a20";


        ctx.fillRect(
            -45,
            -30,
            90,
            60
        );


        ctx.fillStyle =
            "#0c0f14";


        ctx.beginPath();

        ctx.moveTo(
            -58,
            -30
        );

        ctx.lineTo(
            0,
            -70
        );

        ctx.lineTo(
            58,
            -30
        );

        ctx.closePath();

        ctx.fill();


        ctx.fillStyle =
            "#c39b39";


        ctx.fillRect(
            -7,
            -5,
            14,
            16
        );


        ctx.restore();
    },


    drawVillageLights() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        ctx.fillStyle =
            "rgba(231,178,60,.65)";


        for (
            let i = 0;
            i < 24;
            i++
        ) {

            const x =
                (
                    i * 137
                ) % w;


            const y =
                h * .45 +
                (
                    i * 59
                ) % (h * .35);


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                3,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    },


    /* =====================================================
       SALLE DU TRÔNE
    ===================================================== */

    drawThroneRoom() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        ctx.fillStyle =
            "#0c0e13";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        ctx.fillStyle =
            "#171b24";


        ctx.fillRect(
            0,
            0,
            w,
            h * .72
        );


        /*
         * Pierres.
         */

        ctx.strokeStyle =
            "rgba(72,75,84,.45)";


        ctx.lineWidth = 2;


        for (
            let y = 0;
            y < h * .72;
            y += 58
        ) {

            const offset =
                (
                    y / 58
                ) % 2 === 0 ?
                0 :
                35;


            for (
                let x = -70 + offset;
                x < w + 70;
                x += 70
            ) {

                ctx.strokeRect(
                    x,
                    y,
                    70,
                    58
                );
            }
        }


        /*
         * Sol.
         */

        ctx.fillStyle =
            "#111319";


        ctx.fillRect(
            0,
            h * .72,
            w,
            h * .28
        );


        /*
         * Tapis.
         */

        ctx.fillStyle =
            "#5b1d2b";


        ctx.beginPath();

        ctx.moveTo(
            w * .42,
            h * .52
        );

        ctx.lineTo(
            w * .58,
            h * .52
        );

        ctx.lineTo(
            w * .76,
            h
        );

        ctx.lineTo(
            w * .24,
            h
        );

        ctx.closePath();

        ctx.fill();
    },


    /* =====================================================
       CHÂTEAU
    ===================================================== */

    drawCastle(
        x,
        y,
        scale
    ) {

        const ctx = Game.ctx;


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
         * Corps.
         */

        ctx.fillStyle =
            "#202631";


        ctx.fillRect(
            -220,
            -230,
            440,
            230
        );


        /*
         * Tours.
         */

        ctx.fillRect(
            -270,
            -270,
            90,
            270
        );


        ctx.fillRect(
            180,
            -270,
            90,
            270
        );


        /*
         * Tour centrale.
         */

        ctx.fillStyle =
            "#2a303c";


        ctx.fillRect(
            -75,
            -315,
            150,
            315
        );


        /*
         * Toits.
         */

        ctx.fillStyle =
            "#0b0e14";


        this.drawRoof(
            -270,
            -270,
            90
        );


        this.drawRoof(
            180,
            -270,
            90
        );


        ctx.beginPath();

        ctx.moveTo(
            -100,
            -315
        );

        ctx.lineTo(
            0,
            -455
        );

        ctx.lineTo(
            100,
            -315
        );

        ctx.closePath();

        ctx.fill();


        /*
         * Fenêtres.
         */

        ctx.fillStyle =
            "#d5aa3c";


        for (
            let i = -2;
            i <= 2;
            i++
        ) {

            ctx.fillRect(
                i * 55 - 6,
                -180,
                12,
                27
            );
        }


        /*
         * Porte.
         */

        ctx.fillStyle =
            "#07090c";


        ctx.fillRect(
            -34,
            -85,
            68,
            85
        );


        /*
         * Drapeaux.
         */

        this.drawFlag(
            -225,
            -460,
            "#752532"
        );


        this.drawFlag(
            225,
            -460,
            "#752532"
        );


        ctx.restore();
    },


    drawRoof(
        x,
        y,
        width
    ) {

        const ctx = Game.ctx;


        ctx.beginPath();

        ctx.moveTo(
            x - 12,
            y
        );

        ctx.lineTo(
            x + width / 2,
            y - 75
        );

        ctx.lineTo(
            x + width + 12,
            y
        );

        ctx.closePath();

        ctx.fill();
    },


    drawFlag(
        x,
        y,
        color
    ) {

        const ctx = Game.ctx;


        ctx.strokeStyle =
            "#8d784d";


        ctx.lineWidth = 3;


        ctx.beginPath();

        ctx.moveTo(
            x,
            y
        );

        ctx.lineTo(
            x,
            y + 90
        );

        ctx.stroke();


        const wave =
            Math.sin(
                this.visualTime * 2
            ) * 5;


        ctx.fillStyle =
            color;


        ctx.beginPath();

        ctx.moveTo(
            x + 3,
            y + 5
        );

        ctx.quadraticCurveTo(
            x + 30,
            y + 15 + wave,
            x + 65,
            y + 5
        );

        ctx.lineTo(
            x + 50,
            y + 45
        );

        ctx.quadraticCurveTo(
            x + 25,
            y + 30 + wave,
            x + 3,
            y + 38
        );

        ctx.closePath();

        ctx.fill();
    },


    /* =====================================================
       TRÔNE
    ===================================================== */

    drawThrone(
        x,
        y
    ) {

        const ctx = Game.ctx;


        ctx.fillStyle =
            "#7a5b28";


        ctx.fillRect(
            x - 82,
            y - 120,
            164,
            150
        );


        ctx.fillStyle =
            "#5a1e29";


        ctx.fillRect(
            x - 61,
            y - 100,
            122,
            105
        );


        ctx.fillStyle =
            "#b9963e";


        ctx.fillRect(
            x - 104,
            y,
            35,
            30
        );


        ctx.fillRect(
            x + 69,
            y,
            35,
            30
        );


        ctx.fillStyle =
            "#3f2c19";


        ctx.fillRect(
            x - 63,
            y + 30,
            18,
            50
        );


        ctx.fillRect(
            x + 45,
            y + 30,
            18,
            50
        );


        /*
         * Coussin visible.
         */

        ctx.fillStyle =
            "#762735";


        ctx.fillRect(
            x - 48,
            y - 2,
            96,
            24
        );
    },


    /* =====================================================
       PONANINI III
    ===================================================== */

    drawDuckKing(
        x,
        y,
        scale = 1
    ) {

        const ctx = Game.ctx;


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
         * Cape.
         */

        ctx.fillStyle =
            "#15131a";


        ctx.beginPath();

        ctx.moveTo(
            -48,
            35
        );

        ctx.quadraticCurveTo(
            -75,
            90,
            -82,
            140
        );

        ctx.lineTo(
            82,
            140
        );

        ctx.quadraticCurveTo(
            75,
            90,
            48,
            35
        );

        ctx.closePath();

        ctx.fill();


        ctx.strokeStyle =
            "#7f6635";


        ctx.lineWidth = 3;

        ctx.stroke();


        /*
         * Corps.
         */

        ctx.fillStyle =
            "#303944";


        ctx.fillRect(
            -40,
            35,
            80,
            92
        );


        ctx.strokeStyle =
            "#81734e";


        ctx.strokeRect(
            -40,
            35,
            80,
            92
        );


        /*
         * Tête.
         */

        ctx.fillStyle =
            "#d6b747";


        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            44,
            41,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * Plumage.
         */

        ctx.fillStyle =
            "#292a2f";


        ctx.beginPath();

        ctx.arc(
            0,
            -9,
            40,
            Math.PI,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * Yeux.
         */

        ctx.fillStyle =
            "#f1e9bd";


        ctx.fillRect(
            -22,
            -6,
            13,
            9
        );


        ctx.fillRect(
            9,
            -6,
            13,
            9
        );


        ctx.fillStyle =
            "#111217";


        ctx.fillRect(
            -17,
            -4,
            5,
            6
        );


        ctx.fillRect(
            14,
            -4,
            5,
            6
        );


        /*
         * Bec.
         */

        ctx.fillStyle =
            "#d98226";


        ctx.beginPath();

        ctx.moveTo(
            -26,
            10
        );

        ctx.lineTo(
            0,
            27
        );

        ctx.lineTo(
            26,
            10
        );

        ctx.closePath();

        ctx.fill();


        /*
         * Couronne fixée à la tête.
         */

        this.drawCrown(
            0,
            -43,
            .95
        );


        ctx.restore();
    },


    /* =====================================================
       COURONNE
    ===================================================== */

    drawCrown(
        x,
        y,
        scale = 1
    ) {

        const ctx = Game.ctx;


        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.scale(
            scale,
            scale
        );


        ctx.fillStyle =
            "#d7a92f";


        ctx.beginPath();

        ctx.moveTo(
            -38,
            8
        );

        ctx.lineTo(
            -29,
            -27
        );

        ctx.lineTo(
            -10,
            -4
        );

        ctx.lineTo(
            0,
            -39
        );

        ctx.lineTo(
            12,
            -4
        );

        ctx.lineTo(
            32,
            -27
        );

        ctx.lineTo(
            39,
            8
        );

        ctx.closePath();

        ctx.fill();


        ctx.fillRect(
            -39,
            5,
            78,
            11
        );


        ctx.fillStyle =
            "#a62d3b";


        ctx.beginPath();

        ctx.arc(
            0,
            -23,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.restore();
    },


    /* =====================================================
       IV — OMBRE UNIQUEMENT
    ===================================================== */

    drawVillainEyes(
        x,
        y
    ) {

        const ctx = Game.ctx;


        const pulse =
            .65 +
            Math.abs(
                Math.sin(
                    this.visualTime * 2
                )
            ) * .35;


        ctx.save();


        ctx.shadowBlur = 18;

        ctx.shadowColor =
            `rgba(210,25,30,${pulse})`;


        ctx.fillStyle =
            `rgba(220,35,40,${pulse})`;


        ctx.fillRect(
            x - 25,
            y,
            16,
            6
        );


        ctx.fillRect(
            x + 9,
            y,
            16,
            6
        );


        ctx.restore();
    },


    /* =====================================================
       IV — APPARAÎT SCÈNE 6
    ===================================================== */

    drawDuckVillainFull(
        x,
        y,
        scale = 1
    ) {

        const ctx = Game.ctx;


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
         * Cape noire.
         */

        ctx.fillStyle =
            "#0b0a0d";


        ctx.beginPath();

        ctx.moveTo(
            -48,
            30
        );

        ctx.lineTo(
            -80,
            145
        );

        ctx.lineTo(
            80,
            145
        );

        ctx.lineTo(
            48,
            30
        );

        ctx.closePath();

        ctx.fill();


        /*
         * Armure sombre.
         */

        ctx.fillStyle =
            "#20232a";


        ctx.fillRect(
            -40,
            32,
            80,
            100
        );


        /*
         * Tête.
         */

        ctx.fillStyle =
            "#b69b3d";


        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            43,
            40,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * Bec.
         */

        ctx.fillStyle =
            "#9f5d22";


        ctx.beginPath();

        ctx.moveTo(
            -25,
            10
        );

        ctx.lineTo(
            0,
            26
        );

        ctx.lineTo(
            25,
            10
        );

        ctx.closePath();

        ctx.fill();


        /*
         * Yeux normaux.
         */

        ctx.fillStyle =
            "#e8ddb0";


        ctx.fillRect(
            -21,
            -6,
            12,
            8
        );


        ctx.fillRect(
            9,
            -6,
            12,
            8
        );


        ctx.fillStyle =
            "#17171b";


        ctx.fillRect(
            -17,
            -4,
            5,
            5
        );


        ctx.fillRect(
            13,
            -4,
            5,
            5
        );


        /*
         * Couronne sombre.
         */

        this.drawCrown(
            0,
            -42,
            .90
        );


        ctx.restore();
    },


    /* =====================================================
       VILLAGEOIS
    ===================================================== */

    drawVillager(
        x,
        y,
        scale = 1
    ) {

        const ctx = Game.ctx;


        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.scale(
            scale,
            scale
        );


        ctx.fillStyle =
            "#514335";


        ctx.fillRect(
            -18,
            15,
            36,
            75
        );


        ctx.fillStyle =
            "#d0a948";


        ctx.beginPath();

        ctx.arc(
            0,
            0,
            22,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#1b1b20";


        ctx.fillRect(
            -10,
            -4,
            5,
            5
        );


        ctx.fillRect(
            5,
            -4,
            5,
            5
        );


        ctx.fillStyle =
            "#d77c24";


        ctx.beginPath();

        ctx.moveTo(
            -12,
            8
        );

        ctx.lineTo(
            0,
            17
        );

        ctx.lineTo(
            12,
            8
        );

        ctx.closePath();

        ctx.fill();


        ctx.restore();
    },


    /* =====================================================
       GARDE
    ===================================================== */

    drawGuard(
        x,
        y
    ) {

        const ctx = Game.ctx;


        /*
         * Ombre au sol.
         */

        ctx.fillStyle =
            "rgba(0,0,0,.5)";


        ctx.beginPath();

        ctx.ellipse(
            x,
            y + 88,
            27,
            8,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#0c1017";


        ctx.fillRect(
            x - 21,
            y,
            42,
            90
        );


        /*
         * Casque.
         */

        ctx.fillStyle =
            "#39404b";


        ctx.beginPath();

        ctx.arc(
            x,
            y - 10,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#090b0f";


        ctx.fillRect(
            x - 20,
            y - 4,
            40,
            10
        );


        /*
         * Lance.
         */

        ctx.strokeStyle =
            "#756447";


        ctx.lineWidth = 3;


        ctx.beginPath();

        ctx.moveTo(
            x + 30,
            y - 55
        );

        ctx.lineTo(
            x + 30,
            y + 105
        );

        ctx.stroke();
    },


    /* =====================================================
       FOULE
    ===================================================== */

    drawCrowd(
        baseY
    ) {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;


        for (
            let i = -9;
            i <= 9;
            i++
        ) {

            const x =
                w / 2 +
                i * 55;


            const bob =
                Math.sin(
                    this.visualTime * 1.2 +
                    i
                ) * 2;


            ctx.fillStyle =
                "#11141a";


            ctx.beginPath();

            ctx.arc(
                x,
                baseY - 35 + bob,
                14,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillRect(
                x - 17,
                baseY - 20 + bob,
                34,
                50
            );
        }
    },


    /* =====================================================
       COUR
    ===================================================== */

    drawCastleCourtyard() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        this.drawNightSky();


        this.drawCastle(
            w / 2,
            h * .64,
            .55
        );


        ctx.fillStyle =
            "#17191e";


        ctx.fillRect(
            0,
            h * .66,
            w,
            h * .34
        );


        /*
         * Pavés.
         */

        ctx.strokeStyle =
            "rgba(90,92,100,.25)";


        ctx.lineWidth = 2;


        for (
            let y = h * .68;
            y < h;
            y += 42
        ) {

            ctx.beginPath();

            ctx.moveTo(
                0,
                y
            );

            ctx.lineTo(
                w,
                y
            );

            ctx.stroke();
        }


        for (
            let x = 0;
            x < w;
            x += 75
        ) {

            ctx.beginPath();

            ctx.moveTo(
                x,
                h * .66
            );

            ctx.lineTo(
                x,
                h
            );

            ctx.stroke();
        }
    },


    /* =====================================================
       RUE DU VILLAGE
    ===================================================== */

    drawVillageStreet() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        this.drawNightSky();


        ctx.fillStyle =
            "#16191e";


        ctx.fillRect(
            0,
            h * .62,
            w,
            h * .38
        );


        /*
         * Maisons.
         */

        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const x =
                i * 170;


            const height =
                130 +
                (i % 3) * 25;


            ctx.fillStyle =
                "#1c2028";


            ctx.fillRect(
                x,
                h * .62 - height,
                120,
                height
            );


            ctx.fillStyle =
                "#0d1015";


            ctx.beginPath();

            ctx.moveTo(
                x - 20,
                h * .62 - height
            );

            ctx.lineTo(
                x + 60,
                h * .62 - height - 65
            );

            ctx.lineTo(
                x + 140,
                h * .62 - height
            );

            ctx.closePath();

            ctx.fill();
        }


        /*
         * Rue.
         */

        ctx.fillStyle =
            "#101217";


        ctx.beginPath();

        ctx.moveTo(
            w * .32,
            h * .62
        );

        ctx.lineTo(
            w * .68,
            h * .62
        );

        ctx.lineTo(
            w,
            h
        );

        ctx.lineTo(
            0,
            h
        );

        ctx.closePath();

        ctx.fill();
    },


drawVillageHouse(x, y, scale = 1) {

    const ctx = Game.ctx;

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
    Corps.
    */

    ctx.fillStyle =
        "#80654b";

    ctx.fillRect(
        -45,
        0,
        90,
        65
    );


    /*
    Toit.
    */

    ctx.fillStyle =
        "#382d2a";

    ctx.beginPath();

    ctx.moveTo(
        -58,
        5
    );

    ctx.lineTo(
        0,
        -48
    );

    ctx.lineTo(
        58,
        5
    );

    ctx.closePath();

    ctx.fill();


    /*
    Porte.
    */

    ctx.fillStyle =
        "#39271e";

    ctx.fillRect(
        -12,
        32,
        24,
        33
    );


    /*
    Fenêtres.
    */

    ctx.fillStyle =
        "#d4b45c";

    ctx.fillRect(
        -35,
        22,
        17,
        17
    );

    ctx.fillRect(
        18,
        22,
        17,
        17
    );


    /*
    Petite cheminée.
    */

    ctx.fillStyle =
        "#493833";

    ctx.fillRect(
        22,
        -38,
        12,
        28
    );


    /*
    Fumée.
    */

    ctx.globalAlpha =
        .22;

    ctx.fillStyle =
        "#b8b8b8";

    ctx.beginPath();

    ctx.arc(
        28,
        -52,
        10,
        0,
        Math.PI * 2
    );

    ctx.arc(
        38,
        -70,
        13,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

},


drawAerialPalace(x, y, scale = 1) {

    const ctx = Game.ctx;

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
    ------------------------------------------------------
    CORPS CENTRAL
    ------------------------------------------------------
    */

    ctx.fillStyle =
        "#302f35";

    ctx.fillRect(
        -125,
        -155,
        250,
        180
    );


    /*
    ------------------------------------------------------
    PIERRES
    ------------------------------------------------------
    */

    ctx.strokeStyle =
        "rgba(15,15,20,.30)";

    ctx.lineWidth = 2;

    for (
        let row = 0;
        row < 5;
        row++
    ) {

        for (
            let col = -3;
            col < 4;
            col++
        ) {

            const bx =
                col * 38 +
                (row % 2) * 19;

            const by =
                -145 +
                row * 35;

            ctx.strokeRect(
                bx,
                by,
                36,
                33
            );

        }

    }


    /*
    ------------------------------------------------------
    TOURS
    ------------------------------------------------------
    */

    this.drawAerialTower(
        -150,
        -205,
        72
    );

    this.drawAerialTower(
        78,
        -205,
        72
    );


    /*
    ------------------------------------------------------
    TOUR CENTRALE
    ------------------------------------------------------
    */

    ctx.fillStyle =
        "#393940";

    ctx.fillRect(
        -52,
        -230,
        104,
        255
    );


    /*
    toit.
    */

    ctx.fillStyle =
        "#12131a";

    ctx.beginPath();

    ctx.moveTo(
        -70,
        -230
    );

    ctx.lineTo(
        0,
        -315
    );

    ctx.lineTo(
        70,
        -230
    );

    ctx.closePath();

    ctx.fill();


    /*
    ------------------------------------------------------
    GRAND PORTAIL
    ------------------------------------------------------
    */

    ctx.fillStyle =
        "#111218";

    ctx.beginPath();

    ctx.arc(
        0,
        -25,
        34,
        Math.PI,
        0
    );

    ctx.fill();

    ctx.fillRect(
        -34,
        -25,
        68,
        50
    );


    /*
    ------------------------------------------------------
    FENÊTRES
    ------------------------------------------------------
    */

    ctx.fillStyle =
        "#d4ad45";

    for (
        let i = -2;
        i <= 2;
        i++
    ) {

        ctx.fillRect(
            i * 42 - 6,
            -125,
            12,
            28
        );

    }


    /*
    ------------------------------------------------------
    DRAPEAUX
    ------------------------------------------------------
    */

    this.drawFlag(
        -152,
        -270,
        "#6e2631"
    );

    this.drawFlag(
        150,
        -270,
        "#6e2631"
    );


    /*
    Blason.
    */

    ctx.fillStyle =
        "#d8b64a";

    ctx.beginPath();

    ctx.arc(
        0,
        -65,
        13,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

},


drawAerialTower(x, y, width) {

    const ctx = Game.ctx;

    ctx.fillStyle =
        "#292a31";

    ctx.fillRect(
        x,
        y,
        width,
        230
    );


    /*
    Créneaux.
    */

    ctx.fillStyle =
        "#222329";

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        ctx.fillRect(
            x + i * 19,
            y - 12,
            14,
            15
        );

    }


    /*
    Toit.
    */

    ctx.fillStyle =
        "#101117";

    ctx.beginPath();

    ctx.moveTo(
        x - 10,
        y
    );

    ctx.lineTo(
        x + width / 2,
        y - 85
    );

    ctx.lineTo(
        x + width + 10,
        y
    );

    ctx.closePath();

    ctx.fill();


    /*
    Fenêtres.
    */

    ctx.fillStyle =
        "#c49e42";

    for (
        let i = 0;
        i < 3;
        i++
    ) {

        ctx.fillRect(
            x + width / 2 - 5,
            y + 40 + i * 55,
            10,
            22
        );

    }

},


drawAerialFog() {

    const ctx = Game.ctx;

    const width =
        Game.canvas.width;

    const height =
        Game.canvas.height;


    ctx.save();

    ctx.globalAlpha =
        .10;


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const movement =
            Math.sin(
                this.visualTime * .22 +
                i * 1.7
            ) * 80;


        const x =
            width * .15 +
            i * width * .16 +
            movement;


        const y =
            height * .69 +
            i * 14;


        ctx.fillStyle =
            "#b5bbc1";


        ctx.beginPath();

        ctx.ellipse(
            x,
            y,
            180,
            30,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    ctx.restore();

},


drawRain(count) {

    const ctx = Game.ctx;

    const width =
        Game.canvas.width;

    const height =
        Game.canvas.height;


    ctx.save();

    ctx.strokeStyle =
        "rgba(180,195,210,.18)";

    ctx.lineWidth = 1;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const x =
            (
                i * 97 +
                this.visualTime * 32
            ) % width;


        const y =
            (
                i * 53 +
                this.visualTime * 105
            ) % height;


        ctx.beginPath();

        ctx.moveTo(
            x,
            y
        );

        ctx.lineTo(
            x - 5,
            y + 16
        );

        ctx.stroke();

    }


    ctx.restore();

},

    /* =====================================================
       NETHER
    ===================================================== */

    drawNetherSky() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                h
            );


        gradient.addColorStop(
            0,
            "#100208"
        );


        gradient.addColorStop(
            .55,
            "#32080d"
        );


        gradient.addColorStop(
            1,
            "#080207"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        /*
         * Rochers lointains.
         */

        ctx.fillStyle =
            "#18060a";


        for (
            let i = 0;
            i < 9;
            i++
        ) {

            const x =
                i * 160;


            ctx.beginPath();

            ctx.moveTo(
                x,
                h * .67
            );

            ctx.lineTo(
                x + 80,
                h * (
                    .30 +
                    (i % 3) * .06
                )
            );

            ctx.lineTo(
                x + 160,
                h * .67
            );

            ctx.closePath();

            ctx.fill();
        }
    },


    drawBlackGround() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        ctx.fillStyle =
            "#050506";


        ctx.fillRect(
            0,
            h * .68,
            w,
            h * .32
        );


        /*
         * Texture très discrète.
         */

        ctx.strokeStyle =
            "#191116";


        ctx.lineWidth = 2;


        for (
            let i = 0;
            i < 22;
            i++
        ) {

            const x =
                (
                    i * 97
                ) % w;


            const y =
                h * .72 +
                (
                    i * 31
                ) % (h * .25);


            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x + 35,
                y - 10
            );

            ctx.lineTo(
                x + 60,
                y + 7
            );

            ctx.stroke();
        }
    },


    drawNetherRocks() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        ctx.fillStyle =
            "#111014";


        for (
            let i = 0;
            i < 14;
            i++
        ) {

            const x =
                i * 110;


            const y =
                h * .68 +
                (i % 4) * 20;


            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x + 30,
                y - 28
            );

            ctx.lineTo(
                x + 65,
                y
            );

            ctx.closePath();

            ctx.fill();
        }
    },


    drawDistantLava(
        y
    ) {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;


        ctx.fillStyle =
            "#3b100d";


        ctx.fillRect(
            0,
            y,
            w,
            30
        );


        ctx.fillStyle =
            "#8f2817";


        for (
            let i = 0;
            i < 10;
            i++
        ) {

            const x =
                i * 130;


            ctx.fillRect(
                x,
                y + 5,
                70,
                5
            );
        }
    },


    /* =====================================================
       FRAGMENT
    ===================================================== */

    drawFragment(
        x,
        y,
        color
    ) {

        const ctx = Game.ctx;


        const pulse =
            .75 +
            Math.sin(
                this.visualTime * 2
            ) * .15;


        ctx.save();

        ctx.shadowBlur =
            18;


        ctx.shadowColor =
            color;


        ctx.globalAlpha =
            pulse;


        ctx.fillStyle =
            color;


        ctx.beginPath();

        ctx.moveTo(
            x,
            y - 27
        );

        ctx.lineTo(
            x + 18,
            y
        );

        ctx.lineTo(
            x,
            y + 27
        );

        ctx.lineTo(
            x - 18,
            y
        );

        ctx.closePath();

        ctx.fill();


        ctx.strokeStyle =
            "#eee5c4";


        ctx.lineWidth = 2;

        ctx.stroke();


        ctx.restore();
    },


    /* =====================================================
       PORTAIL
    ===================================================== */

    drawPortal(
        x,
        y,
        scale = 1
    ) {

        const ctx = Game.ctx;


        if (scale <= 0)
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
         * Aura.
         */

        const glow =
            ctx.createRadialGradient(
                0,
                0,
                15,
                0,
                0,
                220
            );


        glow.addColorStop(
            0,
            "rgba(60,100,255,.32)"
        );


        glow.addColorStop(
            .60,
            "rgba(40,50,180,.10)"
        );


        glow.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );


        ctx.fillStyle =
            glow;


        ctx.fillRect(
            -240,
            -240,
            480,
            480
        );


        /*
         * Anneau.
         */

        ctx.shadowBlur =
            24;


        ctx.shadowColor =
            "#486dff";


        ctx.strokeStyle =
            "#536fff";


        ctx.lineWidth =
            14;


        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            112,
            175,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();


        /*
         * Intérieur.
         */

        const inside =
            ctx.createRadialGradient(
                0,
                0,
                5,
                0,
                0,
                180
            );


        inside.addColorStop(
            0,
            "rgba(20,30,95,.85)"
        );


        inside.addColorStop(
            .65,
            "rgba(9,5,35,.95)"
        );


        inside.addColorStop(
            1,
            "rgba(0,0,0,.98)"
        );


        ctx.fillStyle =
            inside;


        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            101,
            160,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.restore();
    },


    drawPortalParticles(
        x,
        y,
        count
    ) {

        const ctx = Game.ctx;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const angle =
                i * .81 +
                this.visualTime * .7;


            const radius =
                120 +
                (i % 4) * 14;


            const px =
                x +
                Math.cos(angle) *
                radius;


            const py =
                y +
                Math.sin(angle) *
                radius *
                1.45;


            ctx.fillStyle =
                i % 2 === 0 ?
                "#718aff" :
                "#9caeff";


            ctx.globalAlpha =
                .25 +
                Math.abs(
                    Math.sin(
                        this.visualTime * 2 +
                        i
                    )
                ) * .45;


            ctx.fillRect(
                px,
                py,
                2,
                2
            );
        }


        ctx.globalAlpha = 1;
    },


    /* =====================================================
       TORCHE
    ===================================================== */

    drawTorch(
        x,
        y
    ) {

        const ctx = Game.ctx;


        const flicker =
            Math.sin(
                this.visualTime * 9
            ) * 3;


        const glow =
            ctx.createRadialGradient(
                x,
                y - 15,
                5,
                x,
                y - 15,
                100
            );


        glow.addColorStop(
            0,
            "rgba(255,180,50,.30)"
        );


        glow.addColorStop(
            1,
            "rgba(255,100,10,0)"
        );


        ctx.fillStyle =
            glow;


        ctx.fillRect(
            x - 100,
            y - 115,
            200,
            200
        );


        ctx.fillStyle =
            "#513522";


        ctx.fillRect(
            x - 4,
            y - 2,
            8,
            50
        );


        ctx.fillStyle =
            "#e89526";


        ctx.beginPath();

        ctx.arc(
            x,
            y - 17 + flicker,
            13,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#ffe0a0";


        ctx.beginPath();

        ctx.arc(
            x,
            y - 19 + flicker,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();
    },


    /* =====================================================
       NUAGES
    ===================================================== */

    drawCloud(
        x,
        y,
        scale
    ) {

        const ctx = Game.ctx;


        ctx.beginPath();

        ctx.ellipse(
            x,
            y,
            100 * scale,
            28 * scale,
            0,
            0,
            Math.PI * 2
        );

        ctx.ellipse(
            x + 75 * scale,
            y - 12 * scale,
            75 * scale,
            32 * scale,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();
    },


    /* =====================================================
       BRUME
    ===================================================== */

    drawAerialFog() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        /*
         * Pas de grosse couche opaque.
         * Seulement de petits voiles.
         */

        ctx.save();

        for (
            let i = 0;
            i < 6;
            i++
        ) {

            const x =
                (
                    i * 250 +
                    this.visualTime * 9
                ) %
                (w + 400) -
                200;


            const y =
                h * .48 +
                i * 34;


            ctx.globalAlpha =
                .035 +
                i * .008;


            ctx.fillStyle =
                "#aeb4bd";


            ctx.beginPath();

            ctx.ellipse(
                x,
                y,
                170,
                22,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }


        ctx.restore();
    },


    drawLowFog(
        y
    ) {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;


        ctx.save();

        ctx.globalAlpha = .08;

        ctx.fillStyle =
            "#a7adb5";


        const x =
            (
                this.visualTime * 8
            ) %
            (w + 400) -
            200;


        ctx.beginPath();

        ctx.ellipse(
            x,
            y,
            220,
            30,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.restore();
    },


    /* =====================================================
       PLUIE
    ===================================================== */

    drawRain(
        count,
        alpha
    ) {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        ctx.strokeStyle =
            `rgba(150,175,205,${alpha})`;


        ctx.lineWidth = 1;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                (
                    i * 91 +
                    this.visualTime * 28
                ) % w;


            const y =
                (
                    i * 47 +
                    this.visualTime * 90
                ) % h;


            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x - 5,
                y + 16
            );

            ctx.stroke();
        }
    },


    /* =====================================================
       VENT
    ===================================================== */

    drawWind(
        count
    ) {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        ctx.strokeStyle =
            "rgba(180,190,205,.16)";


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                (
                    i * 83 +
                    this.visualTime * 30
                ) % w;


            const y =
                (
                    i * 51 +
                    this.visualTime * 8
                ) % h;


            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x + 18,
                y - 3
            );

            ctx.stroke();
        }
    },


    /* =====================================================
       POUSSIÈRE
    ===================================================== */

    drawDust(
        count
    ) {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                (
                    i * 79 +
                    this.visualTime * 5
                ) % w;


            const y =
                (
                    i * 43 +
                    this.visualTime * 4
                ) % h;


            ctx.globalAlpha =
                .10 +
                Math.abs(
                    Math.sin(
                        this.visualTime +
                        i
                    )
                ) * .20;


            ctx.fillStyle =
                "#bcb5a1";


            ctx.fillRect(
                x,
                y,
                2,
                2
            );
        }


        ctx.globalAlpha = 1;
    },


    /* =====================================================
       FUMÉE
    ===================================================== */

    drawSmoke(
        x,
        y,
        scale = 1
    ) {

        const ctx = Game.ctx;


        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const rise =
                (
                    this.visualTime * 18 +
                    i * 32
                ) % 150;


            const drift =
                Math.sin(
                    this.visualTime * .6 +
                    i
                ) * 20;


            ctx.fillStyle =
                "rgba(80,75,75,.07)";


            ctx.beginPath();

            ctx.arc(
                x + drift,
                y - rise,
                (20 + i * 4) * scale,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    },


    /* =====================================================
       BRAISES
    ===================================================== */

    drawEmbers(
        count
    ) {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                (
                    i * 83 +
                    this.visualTime * 15
                ) % w;


            const y =
                h -
                (
                    (
                        i * 47 +
                        this.visualTime * 20
                    ) %
                    (h * .65)
                );


            ctx.fillStyle =
                i % 2 === 0 ?
                "#e77b2b" :
                "#b93620";


            ctx.globalAlpha =
                .20 +
                Math.abs(
                    Math.sin(
                        this.visualTime * 3 +
                        i
                    )
                ) * .55;


            ctx.fillRect(
                x,
                y,
                2,
                2
            );
        }


        ctx.globalAlpha = 1;
    },


    /* =====================================================
       BULLE
    ===================================================== */

    drawSpeechBubble(
        x,
        y,
        text
    ) {

        const ctx = Game.ctx;


        ctx.fillStyle =
            "rgba(10,10,12,.90)";


        ctx.strokeStyle =
            "#9e8140";


        ctx.lineWidth = 2;


        ctx.fillRect(
            x - 150,
            y - 35,
            300,
            70
        );


        ctx.strokeRect(
            x - 150,
            y - 35,
            300,
            70
        );


        ctx.fillStyle =
            "#eee7d5";


        ctx.font =
            "16px Georgia";


        ctx.textAlign =
            "center";


        ctx.fillText(
            text,
            x,
            y + 5
        );
    },


    /* =====================================================
       VIGNETTE
    ===================================================== */

    drawVignette() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        const gradient =
            ctx.createRadialGradient(
                w / 2,
                h / 2,
                h * .18,
                w / 2,
                h / 2,
                h * .78
            );


        gradient.addColorStop(
            0,
            "rgba(0,0,0,0)"
        );


        gradient.addColorStop(
            1,
            "rgba(0,0,0,.78)"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            w,
            h
        );
    },


    /* =====================================================
       NARRATEUR
    ===================================================== */

    drawNarration() {

        const ctx = Game.ctx;

        const scene =
            this.scenes[this.scene];


        if (!scene)
            return;


        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        const boxWidth =
            Math.min(
                900,
                w * .82
            );


        const boxHeight =
            165;


        const x =
            (w - boxWidth) / 2;


        const y =
            h - 220;


        ctx.fillStyle =
            "rgba(4,5,8,.90)";


        ctx.fillRect(
            x,
            y,
            boxWidth,
            boxHeight
        );


        ctx.strokeStyle =
            "#a8883d";


        ctx.lineWidth = 2;


        ctx.strokeRect(
            x,
            y,
            boxWidth,
            boxHeight
        );


        ctx.textAlign =
            "left";


        ctx.font =
            "bold 17px Georgia";


        ctx.fillStyle =
            "#d5b34e";


        ctx.fillText(
            "NARRATEUR",
            x + 22,
            y + 28
        );


        const visible =
            scene.text.substring(
                0,
                this.textIndex
            );


        ctx.font =
            "20px Georgia";


        ctx.fillStyle =
            "#e8e3d5";


        this.drawWrappedText(
            visible,
            x + 22,
            y + 63,
            boxWidth - 44,
            28
        );


        ctx.textAlign =
            "center";


        ctx.font =
            "14px Arial";


        ctx.fillStyle =
            "rgba(255,255,255,.48)";


        ctx.fillText(
            "ESPACE / ENTRÉE",
            w / 2,
            h - 28
        );
    },


    drawWrappedText(
        text,
        x,
        y,
        maxWidth,
        lineHeight
    ) {

        const ctx = Game.ctx;

        const words =
            text.split(" ");

        let line = "";


        for (
            let i = 0;
            i < words.length;
            i++
        ) {

            const test =
                line +
                words[i] +
                " ";


            if (
                ctx.measureText(test).width >
                maxWidth &&
                line !== ""
            ) {

                ctx.fillText(
                    line,
                    x,
                    y
                );

                line =
                    words[i] + " ";

                y += lineHeight;

            } else {

                line = test;
            }
        }


        ctx.fillText(
            line,
            x,
            y
        );
    }
};


/* ==========================================================
   CONTRÔLES DE LA PROLOGUE
========================================================== */

window.addEventListener(
    "keydown",
    event => {

        if (!Prologue.active)
            return;


        if (
            event.code === "Space" ||
            event.code === "Enter"
        ) {

            event.preventDefault();

            Prologue.skipText();
        }
    }
);
