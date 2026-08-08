/*
==========================================================
PONAN'S LEGACY
PROLOGUE CINÉMATIQUE
==========================================================
Direction artistique :
- Royaume médiéval sombre
- Dark fantasy / Game of Thrones
- Ponanini III = seul vrai personnage visible
- Ponanini IV = uniquement deux yeux rouges
- Nether = sombre, infernal
- Texte narratif progressif
- Transitions, zooms, brume, braises, poussière
==========================================================
*/

const Prologue = {

    active: false,

    scene: 0,

    timer: 0,

    textIndex: 0,

    finishedText: false,

    fade: 1,

    fadeDirection: -1,

    visualTime: 0,

    textSpeed: 48,

    scenes: [

        {
            title: "IL ÉTAIT UNE FOIS...",
            text:
                "Bien avant que les royaumes ne soient oubliés, " +
                "une terre ancienne vivait sous la protection de ses rois. " +
                "Une terre de forêts profondes, de montagnes noires et de châteaux " +
                "où chaque pierre semblait garder le souvenir d'un serment.",
            duration: 16000,
            speed: 48
        },

        {
            title: "LE ROYAUME DE PONAN",
            text:
                "Au cœur de ces terres s'élevait le royaume de Ponan. " +
                "Ses murailles avaient résisté aux guerres, aux famines et aux hivers. " +
                "Depuis des générations, la couronne appartenait à la même lignée. " +
                "Et pendant longtemps, le royaume connut la paix.",
            duration: 17000,
            speed: 48
        },

        {
            title: "PONANINI III",
            text:
                "Ponanini III n'était pas un roi comme les autres. " +
                "Il croyait qu'une couronne n'était pas un privilège, " +
                "mais une dette envers ceux que l'on gouverne. " +
                "Son peuple l'aimait. Ses ennemis le respectaient. " +
                "Et son frère... attendait.",
            duration: 18000,
            speed: 47
        },

        {
            title: "DANS L'OMBRE",
            text:
                "Personne ne savait quand la rancœur était devenue de la haine. " +
                "Personne ne sut quand l'ambition devint une obsession. " +
                "Dans les couloirs du palais, une présence observait le roi. " +
                "On ne distinguait jamais son visage. " +
                "Seulement deux yeux rouges dans les ténèbres.",
            duration: 17000,
            speed: 46
        },

        {
            title: "PONANINI IV",
            text:
                "Ponanini IV était son frère. " +
                "Il ne voulait pas attendre son heure. " +
                "Il voulait prendre la couronne. " +
                "Alors les rumeurs commencèrent. " +
                "Puis vinrent les mensonges. " +
                "Et bientôt, les mensonges devinrent des preuves.",
            duration: 17000,
            speed: 46
        },

        {
            title: "LA TRAHISON",
            text:
                "Des gardes furent convaincus. Des témoins furent achetés. " +
                "Des paroles furent transformées jusqu'à devenir des accusations. " +
                "En quelques jours, le roi devint un traître aux yeux de son propre royaume. " +
                "La couronne changea de tête. " +
                "Et personne ne posa les bonnes questions.",
            duration: 18000,
            speed: 45
        },

        {
            title: "LE BANNISSEMENT",
            text:
                "Ponanini III fut conduit dans la cour du palais. " +
                "Devant lui s'ouvrit un portail interdit depuis des siècles. " +
                "Un passage vers un monde que les anciens nommaient le Nether. " +
                "Son frère venait de prendre son royaume. " +
                "Il allait maintenant lui prendre son monde.",
            duration: 20000,
            speed: 44
        },

        {
            title: "LE NETHER",
            text:
                "Le portail se referma derrière lui. " +
                "Le ciel disparut. La lumière disparut. " +
                "Il ne resta que le feu, la pierre et le silence. " +
                "Dans ce monde, personne ne viendrait le sauver. " +
                "Alors Ponanini III comprit une chose : " +
                "s'il voulait rentrer, il devrait devenir plus dangereux que ceux qui l'avaient trahi.",
            duration: 21000,
            speed: 43
        },

        {
            title: "LES TROIS FRAGMENTS",
            text:
                "Au fond des ténèbres, il découvrit une ancienne relique. " +
                "Trois fragments capables de rouvrir la porte entre les mondes. " +
                "Trois morceaux d'un pouvoir oublié. " +
                "Il ne pouvait pas les récupérer seul. " +
                "Il lui fallait quelqu'un du monde des vivants.",
            duration: 19000,
            speed: 44
        },

        {
            title: "L'HISTOIRE COMMENCE",
            text:
                "Des années passèrent. Puis un jour, le portail s'ouvrit. " +
                "Quelqu'un traversa les flammes. " +
                "Quelqu'un qui ne connaissait ni Ponan, ni sa couronne, ni sa trahison. " +
                "Ponanini III comprit qu'il avait enfin trouvé son moyen de revenir. " +
                "Et cet étranger... c'était toi.",
            duration: 20000,
            speed: 43
        }

    ],

    /* ==================================================
       INITIALISATION
    ================================================== */

    start() {

        this.active = true;

        this.scene = 0;

        this.timer = 0;

        this.textIndex = 0;

        this.finishedText = false;

        this.fade = 1;

        this.fadeDirection = -1;

        this.visualTime = 0;

    },

    update(dt) {

        if (!this.active)
            return;

        const current =
            this.scenes[this.scene];

        if (!current)
            return;

        this.timer += dt;

        this.visualTime += dt;

        if (!this.finishedText) {

            this.textIndex =
                Math.floor(
                    this.timer * 1000 /
                    current.speed
                );

            if (
                this.textIndex >=
                current.text.length
            ) {

                this.textIndex =
                    current.text.length;

                this.finishedText = true;

            }

        }

        if (
            this.fadeDirection === -1
        ) {

            this.fade -= dt * 1.5;

            if (this.fade <= 0) {

                this.fade = 0;

                this.fadeDirection = 0;

            }

        }

        if (
            this.finishedText &&
            this.timer >=
            current.duration / 1000
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

        this.visualTime = 0;

        this.fade = 1;

        this.fadeDirection = -1;

    },

    skipText() {

        const current =
            this.scenes[this.scene];

        if (!current)
            return;

        if (!this.finishedText) {

            this.textIndex =
                current.text.length;

            this.finishedText = true;

            return;

        }

        this.nextScene();

    },

    finish() {

        this.active = false;

        this.scene = 0;

        this.timer = 0;

        this.textIndex = 0;

        this.finishedText = false;

        this.fade = 0;

        if (
            typeof finishPrologue ===
            "function"
        ) {

            finishPrologue();

        } else if (
            typeof Game !== "undefined"
        ) {

            Game.running = true;

        }

    },

    /* ==================================================
       AFFICHAGE PRINCIPAL
    ================================================== */

    draw() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        const current =
            this.scenes[this.scene];

        if (!current)
            return;

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

        /* VIGNETTE */

        const vignette =
            ctx.createRadialGradient(
                w / 2,
                h / 2,
                h * .20,
                w / 2,
                h / 2,
                h * .75
            );

        vignette.addColorStop(
            0,
            "rgba(0,0,0,0)"
        );

        vignette.addColorStop(
            1,
            "rgba(0,0,0,.80)"
        );

        ctx.fillStyle =
            vignette;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /* TITRE */

        ctx.textAlign = "center";

        ctx.font =
            "bold 30px Georgia";

        ctx.fillStyle =
            "#d6b34a";

        ctx.fillText(
            current.title,
            w / 2,
            58
        );

        this.drawNarration(
            current
        );

        /* FADE */

        if (this.fade > 0) {

            ctx.fillStyle =
                "rgba(0,0,0," +
                this.fade +
                ")";

            ctx.fillRect(
                0,
                0,
                w,
                h
            );

        }

        ctx.font =
            "15px Arial";

        ctx.fillStyle =
            "rgba(255,255,255,.55)";

        ctx.fillText(
            "ESPACE / ENTRÉE : continuer",
            w / 2,
            h - 20
        );

    },

    /* ==================================================
       NARRATION
    ================================================== */

    drawNarration(scene) {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        const boxW =
            Math.min(
                920,
                w * .82
            );

        const boxH = 170;

        const x =
            (w - boxW) / 2;

        const y =
            h - 225;

        ctx.fillStyle =
            "rgba(0,0,0,.55)";

        ctx.fillRect(
            x - 5,
            y + 7,
            boxW + 10,
            boxH + 10
        );

        ctx.fillStyle =
            "rgba(5,7,11,.92)";

        ctx.fillRect(
            x,
            y,
            boxW,
            boxH
        );

        ctx.strokeStyle =
            "#9f8138";

        ctx.lineWidth = 2;

        ctx.strokeRect(
            x,
            y,
            boxW,
            boxH
        );

        ctx.textAlign =
            "left";

        ctx.font =
            "bold 17px Georgia";

        ctx.fillStyle =
            "#d6b34a";

        ctx.fillText(
            "NARRATEUR",
            x + 24,
            y + 30
        );

        const visible =
            scene.text.substring(
                0,
                this.textIndex
            );

        ctx.font =
            "21px Georgia";

        ctx.fillStyle =
            "#eee9dd";

        this.drawWrappedText(
            visible,
            x + 24,
            y + 68,
            boxW - 48,
            30
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
                i > 0
            ) {

                ctx.fillText(
                    line,
                    x,
                    y
                );

                line =
                    words[i] +
                    " ";

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

    },

    /* ==================================================
       SCÈNE 1
       LE ROYAUME
    ================================================== */

    drawScene1() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        const sky =
            ctx.createLinearGradient(
                0,
                0,
                0,
                h
            );

        sky.addColorStop(
            0,
            "#050711"
        );

        sky.addColorStop(
            .55,
            "#101827"
        );

        sky.addColorStop(
            1,
            "#030408"
        );

        ctx.fillStyle = sky;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /* LUNE */

        ctx.fillStyle =
            "#d8cc9a";

        ctx.beginPath();

        ctx.arc(
            w * .78,
            h * .18,
            50,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /* NUAGES */

        this.drawClouds();

        /* MONTAGNES */

        this.drawMountains();

        /* FORÊT */

        this.drawForest(
            h * .70
        );

        /* CHÂTEAU */

        const zoom =
            .68 +
            Math.min(
                .18,
                this.visualTime * .008
            );

        this.drawCastle(
            w / 2,
            h * .77,
            zoom
        );

        this.drawFog(
            w * .35,
            h * .80,
            1.5
        );

        this.drawWind(
            50
        );

    },

    /* ==================================================
       SCÈNE 2
       APPROCHE DU CHÂTEAU
    ================================================== */

    drawScene2() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        ctx.fillStyle =
            "#05070d";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        ctx.fillStyle =
            "#d9cc9b";

        ctx.beginPath();

        ctx.arc(
            w * .72,
            h * .16,
            60,
            0,
            Math.PI * 2
        );

        ctx.fill();

        this.drawClouds();

        const p =
            Math.min(
                1,
                this.visualTime / 12
            );

        const ease =
            p * p *
            (3 - 2 * p);

        const scale =
            .48 +
            ease * .55;

        this.drawCastle(
            w / 2,
            h * .86,
            scale
        );

        /* ROUTE */

        ctx.fillStyle =
            "#17191d";

        ctx.beginPath();

        ctx.moveTo(
            w * .36,
            h
        );

        ctx.lineTo(
            w * .64,
            h
        );

        ctx.lineTo(
            w * .54,
            h * .68
        );

        ctx.lineTo(
            w * .46,
            h * .68
        );

        ctx.closePath();

        ctx.fill();

        this.drawTorch(
            w * .46,
            h * .68
        );

        this.drawTorch(
            w * .54,
            h * .68
        );

        this.drawWind(
            70
        );

    },

    /* ==================================================
       SCÈNE 3
       ROI
    ================================================== */

    drawScene3() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        ctx.fillStyle =
            "#0b0d12";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        this.drawStoneWall();

        this.drawColumns();

        this.drawStainedGlass(
            w * .15,
            h * .30,
            120
        );

        this.drawStainedGlass(
            w * .85,
            h * .30,
            120
        );

        /* TAPIS */

        ctx.fillStyle =
            "#541b29";

        ctx.beginPath();

        ctx.moveTo(
            w * .44,
            h * .48
        );

        ctx.lineTo(
            w * .56,
            h * .48
        );

        ctx.lineTo(
            w * .72,
            h
        );

        ctx.lineTo(
            w * .28,
            h
        );

        ctx.closePath();

        ctx.fill();

        /* TRÔNE */

        this.drawThrone(
            w / 2,
            h * .55
        );

        /* ROI */

        const breathe =
            Math.sin(
                this.visualTime * 1.4
            ) * 2;

        this.drawDuckKing(
            w / 2,
            h * .39 + breathe,
            1
        );

        this.drawGuard(
            w * .20,
            h * .57
        );

        this.drawGuard(
            w * .80,
            h * .57
        );

        this.drawTorch(
            w * .08,
            h * .50
        );

        this.drawTorch(
            w * .92,
            h * .50
        );

        this.drawDust(
            80
        );

    },

    /* ==================================================
       SCÈNE 4
       OMBRE
    ================================================== */

    drawScene4() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        ctx.fillStyle =
            "#07090d";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        this.drawStoneWall();

        this.drawColumns();

        this.drawThrone(
            w / 2,
            h * .55
        );

        this.drawTorch(
            w * .08,
            h * .50
        );

        this.drawTorch(
            w * .92,
            h * .50
        );

        /* OBSCURITÉ */

        const darkness =
            Math.min(
                .82,
                .25 +
                this.visualTime * .06
            );

        ctx.fillStyle =
            "rgba(0,0,4," +
            darkness +
            ")";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /* IV : YEUX UNIQUEMENT */

        this.drawDuckVillain(
            w * .82,
            h * .27,
            1
        );

        this.drawDust(
            60
        );

    },

    /* ==================================================
       SCÈNE 5
       COMPLOT
    ================================================== */

    drawScene5() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        ctx.fillStyle =
            "#080a0e";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        this.drawStoneWall();

        this.drawTorch(
            w * .12,
            h * .40
        );

        this.drawTorch(
            w * .88,
            h * .40
        );

        /* TABLE */

        ctx.fillStyle =
            "#291c16";

        ctx.fillRect(
            w * .27,
            h * .64,
            w * .46,
            30
        );

        ctx.fillRect(
            w * .31,
            h * .67,
            18,
            100
        );

        ctx.fillRect(
            w * .67,
            h * .67,
            18,
            100
        );

        /* PARCHEMIN */

        ctx.fillStyle =
            "#d0c4a0";

        ctx.fillRect(
            w * .39,
            h * .56,
            220,
            105
        );

        ctx.strokeStyle =
            "#715932";

        ctx.strokeRect(
            w * .39,
            h * .56,
            220,
            105
        );

        /* SCEAU */

        ctx.fillStyle =
            "#8b2734";

        ctx.beginPath();

        ctx.arc(
            w * .58,
            h * .62,
            18,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /* IV */

        this.drawDuckVillain(
            w * .82,
            h * .22,
            .9
        );

        this.drawDust(
            80
        );

    },

    /* ==================================================
       SCÈNE 6
       COURONNE
    ================================================== */

    drawScene6() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        ctx.fillStyle =
            "#06080c";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        this.drawStoneWall();

        this.drawColumns();

        this.drawThrone(
            w / 2,
            h * .57
        );

        /* COURONNE */

        ctx.save();

        ctx.shadowBlur =
            25;

        ctx.shadowColor =
            "#d7af37";

        this.drawCrown(
            w / 2,
            h * .34,
            1
        );

        ctx.restore();

        /* ROI */

        this.drawDuckKing(
            w * .32,
            h * .58,
            .85
        );

        /* GARDES */

        this.drawGuard(
            w * .15,
            h * .58
        );

        this.drawGuard(
            w * .85,
            h * .58
        );

        /* IV */

        this.drawDuckVillain(
            w * .73,
            h * .27,
            1
        );

        this.drawTorch(
            w * .08,
            h * .45
        );

        this.drawTorch(
            w * .92,
            h * .45
        );

        this.drawDust(
            90
        );

    },

    /* ==================================================
       SCÈNE 7
       BANNISSEMENT
    ================================================== */

    drawScene7() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        const sky =
            ctx.createLinearGradient(
                0,
                0,
                0,
                h
            );

        sky.addColorStop(
            0,
            "#02040a"
        );

        sky.addColorStop(
            .65,
            "#101722"
        );

        sky.addColorStop(
            1,
            "#06070a"
        );

        ctx.fillStyle =
            sky;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        this.drawCastle(
            w / 2,
            h * .68,
            .65
        );

        ctx.fillStyle =
            "#17191d";

        ctx.fillRect(
            0,
            h * .68,
            w,
            h * .32
        );

        /* PORTAIL */

        const open =
            Math.min(
                1,
                this.visualTime / 2.5
            );

        let portalAlpha = 1;

        if (
            this.visualTime > 11
        ) {

            portalAlpha =
                1 -
                Math.min(
                    1,
                    (this.visualTime - 11) / 4
                );

        }

        ctx.save();

        ctx.globalAlpha =
            open *
            portalAlpha;

        this.drawPortal(
            w * .52,
            h * .51,
            1
        );

        ctx.restore();

        /* ROI QUI AVANCE */

        const move =
            Math.min(
                1,
                this.visualTime / 6
            );

        const ease =
            move *
            move *
            (3 - 2 * move);

        const kingX =
            w * .34 +
            ease * w * .18;

        /* DISPARITION */

        let alpha = 1;

        if (
            this.visualTime > 6
        ) {

            alpha =
                1 -
                Math.min(
                    1,
                    (this.visualTime - 6) / 4
                );

        }

        if (alpha > 0) {

            ctx.save();

            ctx.globalAlpha =
                alpha;

            this.drawDuckKing(
                kingX,
                h * .54,
                .95
            );

            ctx.restore();

        }

        /* COURONNE QUI TOMBE */

        if (
            this.visualTime > 5 &&
            this.visualTime < 10
        ) {

            const p =
                (this.visualTime - 5) / 5;

            ctx.save();

            ctx.globalAlpha =
                1 - p;

            this.drawCrown(
                kingX + p * 70,
                h * .64 +
                p * p * 75,
                .45
            );

            ctx.restore();

        }

        /* YEUX DE IV */

        this.drawDuckVillain(
            w * .17,
            h * .29,
            .9
        );

        this.drawPortalParticles(
            w * .52,
            h * .51,
            120
        );

        this.drawWind(
            100
        );

        this.drawEmbers(
            45
        );

    },

    /* ==================================================
       SCÈNE 8
       NETHER
    ================================================== */

    drawScene8() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        this.drawNether();

        /* UN SEUL PONANINI III */

        const breathe =
            Math.sin(
                this.visualTime * 1.5
            ) * 3;

        this.drawDuckKing(
            w / 2,
            h * .59 + breathe,
            .92
        );

        ctx.fillStyle =
            "rgba(0,0,0,.45)";

        ctx.beginPath();

        ctx.ellipse(
            w / 2,
            h * .75,
            100,
            20,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        this.drawSmoke(
            w * .20,
            h * .65,
            1
        );

        this.drawSmoke(
            w * .75,
            h * .60,
            1.3
        );

        this.drawEmbers(
            150
        );

    },

    /* ==================================================
       SCÈNE 9
       FRAGMENTS
    ================================================== */

    drawScene9() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        this.drawNether();

        /* CERCLE MAGIQUE */

        ctx.save();

        ctx.translate(
            w / 2,
            h * .43
        );

        ctx.rotate(
            this.visualTime * .15
        );

        ctx.strokeStyle =
            "#3c6eff";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            170,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            110,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.restore();

        /* FRAGMENTS */

        const fragments = [

            [
                w / 2,
                h * .25,
                "#d9b83c"
            ],

            [
                w * .36,
                h * .48,
                "#477ce0"
            ],

            [
                w * .64,
                h * .48,
                "#8057d4"
            ]

        ];

        fragments.forEach(
            (f, i) => {

                const y =
                    f[1] +
                    Math.sin(
                        this.visualTime * 2 +
                        i
                    ) * 10;

                ctx.save();

                ctx.translate(
                    f[0],
                    y
                );

                ctx.rotate(
                    this.visualTime *
                    (.25 + i * .1)
                );

                ctx.shadowBlur =
                    25;

                ctx.shadowColor =
                    f[2];

                ctx.fillStyle =
                    f[2];

                ctx.beginPath();

                ctx.moveTo(
                    0,
                    -30
                );

                ctx.lineTo(
                    22,
                    0
                );

                ctx.lineTo(
                    0,
                    30
                );

                ctx.lineTo(
                    -22,
                    0
                );

                ctx.closePath();

                ctx.fill();

                ctx.strokeStyle =
                    "#eee6c9";

                ctx.stroke();

                ctx.restore();

            }
        );

        /* UN SEUL ROI */

        this.drawDuckKing(
            w / 2,
            h * .65,
            .78
        );

        this.drawEmbers(
            100
        );

    },

    /* ==================================================
       SCÈNE 10
       LE JOUEUR
    ================================================== */

    drawScene10() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        this.drawNether();

        const px =
            w * .70;

        const py =
            h * .48;

        const pulse =
            1 +
            Math.sin(
                this.visualTime * 2.5
            ) * .04;

        this.drawPortal(
            px,
            py,
            pulse
        );

        /* ROI */

        this.drawDuckKing(
            w * .39,
            h * .54,
            .88
        );

        /* SILHOUETTE DU JOUEUR */

        const playerX =
            w * .70;

        const playerY =
            h * .67;

        ctx.fillStyle =
            "#020205";

        ctx.fillRect(
            playerX - 28,
            playerY,
            56,
            115
        );

        ctx.beginPath();

        ctx.arc(
            playerX,
            playerY - 30,
            31,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /* LIEN MAGIQUE */

        ctx.strokeStyle =
            "rgba(216,180,68,.35)";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            w * .45,
            h * .48
        );

        ctx.lineTo(
            playerX - 35,
            playerY - 30
        );

        ctx.stroke();

        this.drawPortalParticles(
            px,
            py,
            130
        );

        this.drawSmoke(
            w * .18,
            h * .70,
            1
        );

        this.drawEmbers(
            90
        );

    },

    /* ==================================================
       CHÂTEAU
    ================================================== */

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

        /* CORPS */

        ctx.fillStyle =
            "#1c2028";

        ctx.fillRect(
            -220,
            -270,
            440,
            270
        );

        /* CRÉNEAUX */

        ctx.fillStyle =
            "#282c34";

        for (
            let i = -4;
            i <= 4;
            i++
        ) {

            ctx.fillRect(
                i * 48 - 20,
                -295,
                35,
                25
            );

        }

        /* TOURS */

        this.drawTower(
            -290,
            -410,
            150
        );

        this.drawTower(
            140,
            -410,
            150
        );

        /* TOUR CENTRALE */

        ctx.fillStyle =
            "#282b33";

        ctx.fillRect(
            -78,
            -440,
            156,
            440
        );

        /* TOIT */

        ctx.fillStyle =
            "#08090d";

        ctx.beginPath();

        ctx.moveTo(
            -110,
            -440
        );

        ctx.lineTo(
            0,
            -590
        );

        ctx.lineTo(
            110,
            -440
        );

        ctx.closePath();

        ctx.fill();

        /* FENÊTRES */

        ctx.fillStyle =
            "#c09c3c";

        for (
            let i = -1;
            i <= 1;
            i++
        ) {

            ctx.fillRect(
                i * 55 - 9,
                -360,
                18,
                65
            );

        }

        /* PORTE */

        ctx.fillStyle =
            "#050609";

        ctx.beginPath();

        ctx.arc(
            0,
            -80,
            48,
            Math.PI,
            0
        );

        ctx.fill();

        ctx.fillRect(
            -48,
            -80,
            96,
            80
        );

        /* DRAPEAUX */

        this.drawFlag(
            -120,
            -485,
            "#762532"
        );

        this.drawFlag(
            120,
            -485,
            "#762532"
        );

        ctx.restore();

    },

    drawTower(
        x,
        y,
        width
    ) {

        const ctx = Game.ctx;

        ctx.fillStyle =
            "#242831";

        ctx.fillRect(
            x,
            y,
            width,
            400
        );

        for (
            let i = 0;
            i < 5;
            i++
        ) {

            ctx.fillRect(
                x + i * 32,
                y - 20,
                23,
                22
            );

        }

        ctx.fillStyle =
            "#08090d";

        ctx.beginPath();

        ctx.moveTo(
            x - 15,
            y
        );

        ctx.lineTo(
            x + width / 2,
            y - 125
        );

        ctx.lineTo(
            x + width + 15,
            y
        );

        ctx.closePath();

        ctx.fill();

        for (
            let i = 0;
            i < 4;
            i++
        ) {

            ctx.fillStyle =
                "#b8943b";

            ctx.fillRect(
                x + width / 2 - 8,
                y + 50 + i * 75,
                16,
                35
            );

        }

    },

    drawFlag(
        x,
        y,
        color
    ) {

        const ctx = Game.ctx;

        const wave =
            Math.sin(
                this.visualTime * 3
            ) * 5;

        ctx.fillStyle =
            "#806c43";

        ctx.fillRect(
            x,
            y,
            3,
            80
        );

        ctx.fillStyle =
            color;

        ctx.beginPath();

        ctx.moveTo(
            x + 3,
            y
        );

        ctx.quadraticCurveTo(
            x + 30,
            y + 8 + wave,
            x + 55,
            y + 15
        );

        ctx.lineTo(
            x + 3,
            y + 36
        );

        ctx.closePath();

        ctx.fill();

    },

    /* ==================================================
       ROI CANARD
    ================================================== */

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

        /* CAPE */

        ctx.fillStyle =
            "#15121a";

        ctx.beginPath();

        ctx.moveTo(
            -60,
            35
        );

        ctx.quadraticCurveTo(
            -85,
            90,
            -95,
            145
        );

        ctx.lineTo(
            95,
            145
        );

        ctx.quadraticCurveTo(
            85,
            90,
            60,
            35
        );

        ctx.closePath();

        ctx.fill();

        ctx.strokeStyle =
            "#806531";

        ctx.lineWidth = 3;

        ctx.stroke();

        /* ARMURE */

        ctx.fillStyle =
            "#303842";

        ctx.fillRect(
            -43,
            35,
            86,
            92
        );

        ctx.strokeStyle =
            "#78683f";

        ctx.strokeRect(
            -43,
            35,
            86,
            92
        );

        /* ÉPAULES */

        ctx.fillStyle =
            "#484e58";

        ctx.beginPath();

        ctx.arc(
            -47,
            52,
            17,
            0,
            Math.PI * 2
        );

        ctx.arc(
            47,
            52,
            17,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /* TÊTE */

        ctx.fillStyle =
            "#d9bd50";

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            44,
            42,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /* PLUMAGE */

        ctx.fillStyle =
            "#292a2e";

        ctx.beginPath();

        ctx.arc(
            0,
            -10,
            40,
            Math.PI,
            Math.PI * 2
        );

        ctx.fill();

        /* YEUX */

        ctx.fillStyle =
            "#f5edbd";

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

        /* BEC */

        ctx.fillStyle =
            "#d58a28";

        ctx.beginPath();

        ctx.moveTo(
            -26,
            10
        );

        ctx.lineTo(
            0,
            28
        );

        ctx.lineTo(
            26,
            10
        );

        ctx.closePath();

        ctx.fill();

        /* COURONNE */

        this.drawCrown(
            0,
            -45,
            1
        );

        ctx.restore();

    },

    /* ==================================================
       PONANINI IV
       STRICTEMENT : YEUX
    ================================================== */

    drawDuckVillain(
        x,
        y,
        scale = 1
    ) {

        const ctx = Game.ctx;

        const pulse =
            .65 +
            Math.abs(
                Math.sin(
                    this.visualTime * 2.3
                )
            ) * .35;

        ctx.save();

        ctx.shadowBlur =
            22 * scale;

        ctx.shadowColor =
            "rgba(220,20,30," +
            pulse +
            ")";

        ctx.fillStyle =
            "rgba(235,35,40," +
            pulse +
            ")";

        /* OEIL GAUCHE */

        ctx.fillRect(
            x - 27 * scale,
            y,
            17 * scale,
            6 * scale
        );

        /* OEIL DROIT */

        ctx.fillRect(
            x + 10 * scale,
            y,
            17 * scale,
            6 * scale
        );

        ctx.restore();

    },

    /* ==================================================
       GARDES
    ================================================== */

    drawGuard(
        x,
        y
    ) {

        const ctx = Game.ctx;

        ctx.fillStyle =
            "#090c12";

        ctx.fillRect(
            x - 20,
            y,
            40,
            90
        );

        ctx.fillStyle =
            "#303844";

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
            "#07090c";

        ctx.fillRect(
            x - 20,
            y - 5,
            40,
            10
        );

        /* LANCE */

        ctx.strokeStyle =
            "#625747";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.moveTo(
            x + 30,
            y - 50
        );

        ctx.lineTo(
            x + 30,
            y + 105
        );

        ctx.stroke();

    },

    /* ==================================================
       TRÔNE
    ================================================== */

    drawThrone(
        x,
        y
    ) {

        const ctx = Game.ctx;

        ctx.fillStyle =
            "#8d6d2e";

        ctx.fillRect(
            x - 85,
            y - 110,
            170,
            160
        );

        ctx.fillStyle =
            "#571d29";

        ctx.fillRect(
            x - 65,
            y - 90,
            130,
            115
        );

        ctx.fillStyle =
            "#b9983d";

        ctx.fillRect(
            x - 105,
            y + 15,
            35,
            25
        );

        ctx.fillRect(
            x + 70,
            y + 15,
            35,
            25
        );

        ctx.fillStyle =
            "#6d5126";

        ctx.fillRect(
            x - 70,
            y + 40,
            20,
            55
        );

        ctx.fillRect(
            x + 50,
            y + 40,
            20,
            55
        );

    },

    /* ==================================================
       COURONNE
    ================================================== */

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
            "#d8ab32";

        ctx.beginPath();

        ctx.moveTo(
            -40,
            8
        );

        ctx.lineTo(
            -29,
            -30
        );

        ctx.lineTo(
            -10,
            -3
        );

        ctx.lineTo(
            0,
            -42
        );

        ctx.lineTo(
            13,
            -3
        );

        ctx.lineTo(
            34,
            -30
        );

        ctx.lineTo(
            40,
            8
        );

        ctx.closePath();

        ctx.fill();

        ctx.fillRect(
            -40,
            5,
            80,
            12
        );

        ctx.fillStyle =
            "#a62d3a";

        ctx.beginPath();

        ctx.arc(
            0,
            -25,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();

    },

    /* ==================================================
       TORCHE
    ================================================== */

    drawTorch(
        x,
        y
    ) {

        const ctx = Game.ctx;

        const flicker =
            Math.sin(
                this.visualTime * 8
            ) * 4;

        const glow =
            ctx.createRadialGradient(
                x,
                y - 15,
                5,
                x,
                y - 15,
                110
            );

        glow.addColorStop(
            0,
            "rgba(255,180,40,.35)"
        );

        glow.addColorStop(
            1,
            "rgba(255,120,20,0)"
        );

        ctx.fillStyle =
            glow;

        ctx.fillRect(
            x - 110,
            y - 125,
            220,
            220
        );

        ctx.fillStyle =
            "#573622";

        ctx.fillRect(
            x - 4,
            y - 5,
            8,
            55
        );

        ctx.fillStyle =
            "#ef9f25";

        ctx.beginPath();

        ctx.arc(
            x,
            y - 15 + flicker,
            14,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle =
            "#ffe6a3";

        ctx.beginPath();

        ctx.arc(
            x,
            y - 17 + flicker,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();

    },

    /* ==================================================
       MONTAGNES
    ================================================== */

    drawMountains() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        ctx.fillStyle =
            "#07101b";

        ctx.beginPath();

        ctx.moveTo(
            0,
            h * .69
        );

        ctx.lineTo(
            w * .14,
            h * .40
        );

        ctx.lineTo(
            w * .29,
            h * .69
        );

        ctx.lineTo(
            w * .48,
            h * .34
        );

        ctx.lineTo(
            w * .67,
            h * .69
        );

        ctx.lineTo(
            w * .85,
            h * .43
        );

        ctx.lineTo(
            w,
            h * .69
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

    /* ==================================================
       FORÊT
    ================================================== */

    drawForest(
        base
    ) {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        ctx.fillStyle =
            "#070c11";

        for (
            let i = 0;
            i < 35;
            i++
        ) {

            const x =
                i *
                (w / 34);

            const h =
                45 +
                (i % 5) * 18;

            ctx.beginPath();

            ctx.moveTo(
                x,
                base
            );

            ctx.lineTo(
                x + 20,
                base - h
            );

            ctx.lineTo(
                x + 40,
                base
            );

            ctx.closePath();

            ctx.fill();

        }

    },

    /* ==================================================
       MURS
    ================================================== */

    drawStoneWall() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        ctx.strokeStyle =
            "rgba(72,76,85,.48)";

        ctx.lineWidth = 2;

        for (
            let row = 0;
            row < 10;
            row++
        ) {

            const y =
                row * 65;

            const offset =
                row % 2
                    ? 35
                    : 0;

            for (
                let x = -70 + offset;
                x < w + 70;
                x += 70
            ) {

                ctx.strokeRect(
                    x,
                    y,
                    70,
                    65
                );

            }

        }

    },

    /* ==================================================
       COLONNES
    ================================================== */

    drawColumns() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        const positions = [
            w * .08,
            w * .28,
            w * .72,
            w * .92
        ];

        positions.forEach(
            x => {

                ctx.fillStyle =
                    "#11141a";

                ctx.fillRect(
                    x - 22,
                    h * .10,
                    44,
                    h * .64
                );

                ctx.fillRect(
                    x - 35,
                    h * .10,
                    70,
                    22
                );

            }
        );

    },

    /* ==================================================
       VITRAUX
    ================================================== */

    drawStainedGlass(
        x,
        y,
        size
    ) {

        const ctx = Game.ctx;

        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.fillStyle =
            "#17191e";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            size / 2,
            Math.PI,
            0
        );

        ctx.fill();

        ctx.strokeStyle =
            "#6b5938";

        ctx.lineWidth = 5;

        ctx.stroke();

        ctx.fillStyle =
            "rgba(95,40,55,.65)";

        ctx.fillRect(
            -size * .22,
            -size * .22,
            size * .22,
            size * .44
        );

        ctx.fillStyle =
            "rgba(48,66,105,.65)";

        ctx.fillRect(
            0,
            -size * .22,
            size * .22,
            size * .44
        );

        ctx.restore();

    },

    /* ==================================================
       NUAGES
    ================================================== */

    drawClouds() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        ctx.fillStyle =
            "rgba(9,17,30,.80)";

        const x =
            (
                this.visualTime * 12
            ) %
            (w + 500) -
            250;

        ctx.beginPath();

        ctx.ellipse(
            x,
            130,
            120,
            35,
            0,
            0,
            Math.PI * 2
        );

        ctx.ellipse(
            x + 90,
            115,
            90,
            35,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.beginPath();

        ctx.ellipse(
            x - 400,
            210,
            100,
            30,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

    },

    /* ==================================================
       BROUILLARD
    ================================================== */

    drawFog(
        x,
        y,
        scale = 1
    ) {

        const ctx = Game.ctx;

        ctx.save();

        ctx.globalAlpha =
            .15;

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const offset =
                Math.sin(
                    this.visualTime * .4 +
                    i
                ) * 35;

            ctx.fillStyle =
                "#a0a2a5";

            ctx.beginPath();

            ctx.ellipse(
                x +
                offset +
                i * 45 * scale,
                y - i * 6,
                150 * scale,
                35 * scale,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

        ctx.restore();

    },

    /* ==================================================
       POUSSIÈRE
    ================================================== */

    drawDust(
        count
    ) {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                (
                    i * 83 +
                    this.visualTime * 7
                ) % w;

            const y =
                (
                    i * 47 +
                    this.visualTime * 5
                ) % h;

            ctx.globalAlpha =
                .15 +
                Math.abs(
                    Math.sin(
                        this.visualTime +
                        i
                    )
                ) * .35;

            ctx.fillStyle =
                "#c4b99b";

            ctx.fillRect(
                x,
                y,
                1 + i % 3,
                1 + i % 3
            );

        }

        ctx.globalAlpha = 1;

    },

    /* ==================================================
       VENT
    ================================================== */

    drawWind(
        count
    ) {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        ctx.strokeStyle =
            "rgba(170,180,190,.20)";

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
                    i * 53 +
                    this.visualTime * 10
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

    /* ==================================================
       FUMÉE
    ================================================== */

    drawSmoke(
        x,
        y,
        scale = 1
    ) {

        const ctx = Game.ctx;

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const offset =
                Math.sin(
                    this.visualTime * .6 +
                    i
                ) * 18;

            const rise =
                (
                    this.visualTime * 18 +
                    i * 35
                ) % 170;

            ctx.fillStyle =
                "rgba(65,60,60,.09)";

            ctx.beginPath();

            ctx.arc(
                x + offset,
                y - rise,
                (25 + i * 4) * scale,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

    },

    /* ==================================================
       BRAISES
    ================================================== */

    drawEmbers(
        count
    ) {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                (
                    i * 79 +
                    this.visualTime * 18
                ) % w;

            const y =
                h -
                (
                    (
                        i * 43 +
                        this.visualTime * 22
                    ) %
                    (h * .65)
                );

            ctx.globalAlpha =
                .25 +
                Math.abs(
                    Math.sin(
                        this.visualTime * 3 +
                        i
                    )
                ) * .65;

            ctx.fillStyle =
                i % 3 === 0
                    ? "#ffb53d"
                    : "#c94627";

            ctx.fillRect(
                x,
                y,
                2 + i % 3,
                2 + i % 3
            );

        }

        ctx.globalAlpha = 1;

    },

    /* ==================================================
       NETHER
    ================================================== */

    drawNether() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

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
            .50,
            "#3b090e"
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

        /* MONTAGNES DU NETHER */

        ctx.fillStyle =
            "#170509";

        for (
            let i = 0;
            i < 9;
            i++
        ) {

            ctx.beginPath();

            ctx.moveTo(
                i * 170,
                h * .80
            );

            ctx.lineTo(
                i * 170 + 85,
                h * (.25 + (i % 3) * .06)
            );

            ctx.lineTo(
                i * 170 + 170,
                h * .80
            );

            ctx.closePath();

            ctx.fill();

        }

        /* SOL */

        ctx.fillStyle =
            "#6e160f";

        ctx.fillRect(
            0,
            h * .80,
            w,
            h * .20
        );

        /* LAVE */

        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const x =
                i * 130;

            const offset =
                Math.sin(
                    this.visualTime * 2 +
                    i
                ) * 15;

            ctx.fillStyle =
                "#e3471d";

            ctx.fillRect(
                x + offset,
                h * .84,
                65,
                7
            );

        }

        this.drawEmbers(
            100
        );

        this.drawSmoke(
            w * .15,
            h * .75,
            1
        );

        this.drawSmoke(
            w * .78,
            h * .70,
            1.3
        );

    },

    /* ==================================================
       PORTAIL
    ================================================== */

    drawPortal(
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

        /* AURA */

        const glow =
            ctx.createRadialGradient(
                0,
                0,
                20,
                0,
                0,
                240
            );

        glow.addColorStop(
            0,
            "rgba(55,90,255,.40)"
        );

        glow.addColorStop(
            .55,
            "rgba(55,40,180,.14)"
        );

        glow.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        ctx.fillStyle =
            glow;

        ctx.fillRect(
            -250,
            -250,
            500,
            500
        );

        /* ANNEAU */

        ctx.shadowBlur =
            30;

        ctx.shadowColor =
            "#345cff";

        ctx.strokeStyle =
            "#526eff";

        ctx.lineWidth =
            15;

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            120,
            185,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        /* INTÉRIEUR */

        const inside =
            ctx.createRadialGradient(
                0,
                0,
                10,
                0,
                0,
                180
            );

        inside.addColorStop(
            0,
            "rgba(20,35,100,.90)"
        );

        inside.addColorStop(
            .55,
            "rgba(10,5,40,.94)"
        );

        inside.addColorStop(
            1,
            "#000"
        );

        ctx.fillStyle =
            inside;

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            100,
            163,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /* ÉCLAIRS */

        ctx.strokeStyle =
            "#8ba2ff";

        ctx.lineWidth = 2;

        for (
            let i = 0;
            i < 10;
            i++
        ) {

            const a =
                i *
                Math.PI / 5 +
                this.visualTime * .6;

            ctx.beginPath();

            ctx.moveTo(
                Math.cos(a) * 120,
                Math.sin(a) * 185
            );

            ctx.lineTo(
                Math.cos(a) * 155,
                Math.sin(a) * 215
            );

            ctx.stroke();

        }

        ctx.restore();

    },

    /* ==================================================
       PARTICULES PORTAIL
    ================================================== */

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
                i * .77 +
                this.visualTime * .7;

            const radius =
                115 +
                (i % 5) * 15;

            const px =
                x +
                Math.cos(angle) *
                radius;

            const py =
                y +
                Math.sin(angle) *
                radius *
                1.45;

            ctx.globalAlpha =
                .20 +
                Math.abs(
                    Math.sin(
                        this.visualTime * 2 +
                        i
                    )
                ) * .60;

            ctx.fillStyle =
                i % 3 === 0
                    ? "#b4c1ff"
                    : "#536dff";

            ctx.fillRect(
                px,
                py,
                2,
                2
            );

        }

        ctx.globalAlpha = 1;

    }

};


/* ==========================================================
   CONTRÔLES CINÉMATIQUE
========================================================== */

window.addEventListener(
    "keydown",
    event => {

        if (!Prologue.active)
            return;

        if (
            event.code === "Space" ||
            event.key === "Enter"
        ) {

            event.preventDefault();

            Prologue.skipText();

        }

    }
);
