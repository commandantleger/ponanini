const Prologue = {

    active: false,

    scene: 0,

    timer: 0,

    textIndex: 0,

    finishedText: false,

    fade: 1,

    fadeDirection: -1,

    visualTime: 0,

    textSpeed: 50,


    /* =====================================================
       HISTOIRE
    ===================================================== */

    scenes: [

        {
            title: "IL ÉTAIT UNE FOIS...",
            text:
                "Dans une vallée oubliée des hommes, " +
                "un ancien royaume survivait derrière " +
                "ses murailles de pierre. " +
                "Ponan dormait encore sous la brume, " +
                "ignorant que son histoire touchait à sa fin.",
            duration: 15000,
            speed: 52
        },

        {
            title: "LE ROYAUME DE PONAN",
            text:
                "Au centre du village s'élevait le palais royal. " +
                "Autour de ses tours vivaient marchands, soldats, " +
                "artisans et familles. " +
                "Pendant des générations, tous avaient cru " +
                "que la couronne protégerait le royaume.",
            duration: 17000,
            speed: 50
        },

        {
            title: "PONANINI III",
            text:
                "Ponanini III n'était pas un roi aimé parce qu'il " +
                "était puissant. Il était aimé parce qu'il écoutait. " +
                "Il connaissait les visages de son peuple. " +
                "Et il croyait encore qu'un royaume pouvait être juste.",
            duration: 18000,
            speed: 49
        },

        {
            title: "DANS L'OMBRE",
            text:
                "Mais dans les profondeurs du palais, " +
                "une autre ambition grandissait. " +
                "Un regard attendait. " +
                "Deux yeux rouges observaient le trône " +
                "depuis une obscurité où personne n'osait regarder.",
            duration: 16000,
            speed: 48
        },

        {
            title: "LE FRÈRE",
            text:
                "Ponanini IV était son frère. " +
                "Il ne voulait pas servir la couronne. " +
                "Il voulait la posséder. " +
                "Et lorsqu'une couronne devient le désir d'un homme, " +
                "la vérité devient souvent son premier sacrifice.",
            duration: 17500,
            speed: 48
        },

        {
            title: "LE MENSONGE",
            text:
                "Alors les accusations commencèrent. " +
                "Des témoignages furent achetés. " +
                "Des preuves furent fabriquées. " +
                "Et bientôt, celui qui avait protégé Ponan " +
                "fut présenté comme celui qui l'avait trahi.",
            duration: 18000,
            speed: 47
        },

        {
            title: "LE BANNISSEMENT",
            text:
                "Devant les portes du palais, la foule se rassembla. " +
                "Des gardes encerclèrent le roi déchu. " +
                "Personne ne comprenait encore ce qui se jouait. " +
                "Puis le portail s'ouvrit. " +
                "Un passage vers un monde dont aucun homme ne revenait.",
            duration: 19000,
            speed: 46
        },

        {
            title: "LE NETHER",
            text:
                "Ponanini III tomba dans un monde sans ciel. " +
                "Ses pieds rencontrèrent une terre noire et brûlée. " +
                "Derrière lui, le portail disparut. " +
                "Devant lui, il n'y avait rien. " +
                "Rien, sinon les ténèbres.",
            duration: 18000,
            speed: 47
        },

        {
            title: "LES TROIS FRAGMENTS",
            text:
                "Des années passèrent. " +
                "Puis Ponanini III découvrit une ancienne légende. " +
                "Trois fragments dormaient quelque part entre les mondes. " +
                "Réunis, ils pourraient rouvrir le passage. " +
                "Il ne lui fallait plus qu'une chose : quelqu'un pour les trouver.",
            duration: 19000,
            speed: 46
        },

        {
            title: "L'HISTOIRE COMMENCE",
            text:
                "Un soir, une lumière apparut dans le Nether. " +
                "Un portail. " +
                "De l'autre côté se tenait quelqu'un qui ignorait encore " +
                "qu'il venait d'entrer dans une histoire de vengeance. " +
                "Toi.",
            duration: 19000,
            speed: 45
        }

    ],


    /* =====================================================
       START
    ===================================================== */

    start() {

        this.active = true;

        this.scene = 0;

        this.timer = 0;

        this.textIndex = 0;

        this.finishedText = false;

        this.fade = 1;

        this.fadeDirection = -1;

        this.visualTime = 0;

        this.hideGameplayUI();
    },


    /* =====================================================
       UI
    ===================================================== */

    hideGameplayUI() {

        const ids = [
            "hud",
            "life",
            "quest",
            "pieces",
            "inventory",
            "dialogue"
        ];

        ids.forEach(id => {

            const element =
                document.getElementById(id);

            if (element)
                element.style.display = "none";

        });
    },


    showGameplayUI() {

        const hud =
            document.getElementById("hud");

        if (hud)
            hud.style.display = "flex";
    },


    /* =====================================================
       UPDATE
    ===================================================== */

    update(dt) {

        if (!this.active)
            return;


        const current =
            this.scenes[this.scene];


        if (!current)
            return;


        this.timer += dt;

        this.visualTime += dt;


        /*
         * Texte progressif
         */

        if (!this.finishedText) {

            const speed =
                current.speed ||
                this.textSpeed;


            this.textIndex =
                Math.floor(
                    this.timer * 1000 / speed
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


        /*
         * Fade d'entrée
         */

        if (
            this.fadeDirection === -1
        ) {

            this.fade -= dt * 1.2;

            if (this.fade <= 0) {

                this.fade = 0;

                this.fadeDirection = 0;
            }
        }


        /*
         * Passage automatique
         */

        if (
            this.finishedText &&
            this.timer >=
            current.duration / 1000
        ) {

            this.nextScene();
        }
    },


    /* =====================================================
       SCÈNE SUIVANTE
    ===================================================== */

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


    /* =====================================================
       ESPACE / ENTER
    ===================================================== */

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


    /* =====================================================
       FIN
    ===================================================== */

    finish() {

        this.active = false;

        this.scene = 0;

        this.timer = 0;

        this.textIndex = 0;

        this.finishedText = false;

        this.fade = 0;

        this.showGameplayUI();


        if (
            typeof finishPrologue ===
            "function"
        ) {

            finishPrologue();

        } else {

            Game.running = true;
        }
    },


    /* =====================================================
       DRAW PRINCIPAL
    ===================================================== */

    draw() {

        const ctx = Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


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


        /*
         * Vignette
         */

        const vignette =
            ctx.createRadialGradient(
                width / 2,
                height / 2,
                height * .15,
                width / 2,
                height / 2,
                height * .80
            );


        vignette.addColorStop(
            0,
            "rgba(0,0,0,0)"
        );


        vignette.addColorStop(
            1,
            "rgba(0,0,0,.78)"
        );


        ctx.fillStyle = vignette;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * Titre
         */

        const current =
            this.scenes[this.scene];


        ctx.textAlign = "center";

        ctx.font =
            "bold 30px Georgia";


        ctx.fillStyle =
            "#d9b441";


        ctx.shadowBlur = 12;

        ctx.shadowColor =
            "rgba(0,0,0,.8)";


        ctx.fillText(
            current.title,
            width / 2,
            70
        );


        ctx.shadowBlur = 0;


        this.drawNarration(
            current
        );


        /*
         * Fade
         */

        if (this.fade > 0) {

            ctx.fillStyle =
                `rgba(0,0,0,${this.fade})`;

            ctx.fillRect(
                0,
                0,
                width,
                height
            );
        }


        ctx.font =
            "16px Arial";

        ctx.fillStyle =
            "rgba(255,255,255,.55)";


        ctx.fillText(
            "ESPACE : continuer",
            width / 2,
            height - 25
        );
    },


    /* =====================================================
       NARRATEUR
    ===================================================== */

    drawNarration(scene) {

        const ctx = Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        const boxWidth =
            Math.min(
                900,
                width * .82
            );


        const boxHeight = 175;


        const x =
            (width - boxWidth) / 2;


        const y =
            height - 235;


        ctx.fillStyle =
            "rgba(0,0,0,.55)";


        ctx.fillRect(
            x - 8,
            y + 8,
            boxWidth + 16,
            boxHeight + 16
        );


        ctx.fillStyle =
            "rgba(5,7,10,.92)";


        ctx.fillRect(
            x,
            y,
            boxWidth,
            boxHeight
        );


        ctx.strokeStyle =
            "#b9973e";


        ctx.lineWidth = 2;


        ctx.strokeRect(
            x,
            y,
            boxWidth,
            boxHeight
        );


        ctx.textAlign = "left";


        ctx.font =
            "bold 18px Georgia";


        ctx.fillStyle =
            "#d9b441";


        ctx.fillText(
            "NARRATEUR",
            x + 25,
            y + 32
        );


        const visibleText =
            scene.text.substring(
                0,
                this.textIndex
            );


        ctx.font =
            "21px Georgia";


        ctx.fillStyle =
            "#eee9dc";


        this.drawWrappedText(
            visibleText,
            x + 25,
            y + 73,
            boxWidth - 50,
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
    },


    /* =====================================================
       SCÈNE 1
       ROYAUME + VILLAGE
    ===================================================== */

    drawScene1() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        const sky =
            ctx.createLinearGradient(
                0,
                0,
                0,
                h
            );


        sky.addColorStop(
            0,
            "#080b14"
        );


        sky.addColorStop(
            .55,
            "#172033"
        );


        sky.addColorStop(
            1,
            "#05070b"
        );


        ctx.fillStyle = sky;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        /*
         * Lune
         */

        ctx.fillStyle =
            "#d8c995";


        ctx.beginPath();

        ctx.arc(
            w * .78,
            h * .18,
            48,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * Montagnes
         */

        ctx.fillStyle =
            "#0b111c";


        ctx.beginPath();

        ctx.moveTo(
            0,
            h * .58
        );

        ctx.lineTo(
            w * .14,
            h * .38
        );

        ctx.lineTo(
            w * .27,
            h * .58
        );

        ctx.lineTo(
            w * .43,
            h * .32
        );

        ctx.lineTo(
            w * .59,
            h * .58
        );

        ctx.lineTo(
            w * .76,
            h * .40
        );

        ctx.lineTo(
            w,
            h * .58
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


        /*
         * Village
         */

        this.drawVillage(
            w / 2,
            h * .70
        );


        /*
         * Palais
         */

        const zoom =
            0.75 +
            Math.min(
                .10,
                this.visualTime * .003
            );


        this.drawCastleSilhouette(
            w / 2,
            h * .76,
            zoom
        );


        this.drawFog(
            w * .50,
            h * .80,
            1.5
        );


        this.drawMovingClouds();

        this.drawWindParticles(50);

        this.drawDust(30);
    },


    /* =====================================================
       SCÈNE 2
       APPROCHE DU PALAIS
    ===================================================== */

    drawScene2() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        ctx.fillStyle =
            "#06080d";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        /*
         * Travelling très lent
         */

        const progress =
            Math.min(
                1,
                this.visualTime / 14
            );


        const eased =
            progress *
            progress *
            (3 - 2 * progress);


        const scale =
            .62 +
            eased * .35;


        const drift =
            Math.sin(
                this.visualTime * .18
            ) * 8;


        this.drawCastleSilhouette(
            w / 2 + drift,
            h * .82,
            scale
        );


        /*
         * Route
         */

        ctx.fillStyle =
            "#111319";


        ctx.beginPath();

        ctx.moveTo(
            w * .42,
            h
        );

        ctx.lineTo(
            w * .58,
            h
        );

        ctx.lineTo(
            w * .52,
            h * .63
        );

        ctx.lineTo(
            w * .48,
            h * .63
        );

        ctx.closePath();

        ctx.fill();


        /*
         * Torches
         */

        this.drawTorch(
            w * .47,
            h * .67
        );

        this.drawTorch(
            w * .53,
            h * .67
        );


        this.drawMovingClouds();

        this.drawWindParticles(55);

        this.drawFog(
            w / 2,
            h * .84,
            1.1
        );
    },


    /* =====================================================
       SCÈNE 3
       PONANINI III
    ===================================================== */

    drawScene3() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        ctx.fillStyle =
            "#101217";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        this.drawStoneWall();

        this.drawGothicColumns();


        this.drawStainedGlass(
            w * .17,
            h * .30,
            120
        );


        this.drawStainedGlass(
            w * .83,
            h * .30,
            120
        );


        /*
         * Tapis
         */

        ctx.fillStyle =
            "#571d2c";


        ctx.beginPath();

        ctx.moveTo(
            w * .42,
            h * .54
        );

        ctx.lineTo(
            w * .58,
            h * .54
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


        /*
         * Trône
         */

        this.drawThrone(
            w / 2,
            h * .60
        );


        /*
         * Le roi est assis SUR le trône,
         * pas au-dessus.
         */

        const breathe =
            Math.sin(
                this.visualTime * 1.3
            ) * 2;


        this.drawDuckKing(
            w / 2,
            h * .47 + breathe,
            .82
        );


        this.drawGuard(
            w * .18,
            h * .59
        );


        this.drawGuard(
            w * .82,
            h * .59
        );


        this.drawTorch(
            w * .08,
            h * .50
        );


        this.drawTorch(
            w * .92,
            h * .50
        );


        this.drawDust(70);
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


        ctx.fillStyle =
            "#07090e";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        this.drawStoneWall();

        this.drawGothicColumns();


        this.drawThrone(
            w / 2,
            h * .58
        );


        /*
         * Lumière faible
         */

        this.drawTorch(
            w * .10,
            h * .52
        );


        this.drawTorch(
            w * .90,
            h * .52
        );


        /*
         * Ponanini IV :
         * seulement les yeux.
         */

        const eyeX =
            w * .82 +
            Math.sin(
                this.visualTime * .25
            ) * 5;


        this.drawDuckVillain(
            eyeX,
            h * .28,
            1
        );


        /*
         * Ombre progressive
         */

        const darkness =
            Math.min(
                .78,
                .30 +
                this.visualTime * .045
            );


        ctx.fillStyle =
            `rgba(0,0,4,${darkness})`;


        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        /*
         * Les yeux doivent rester visibles
         */

        this.drawDuckVillain(
            eyeX,
            h * .28,
            1
        );


        this.drawDust(55);
    },


    /* =====================================================
       SCÈNE 5
       COMPLOT
    ===================================================== */

    drawScene5() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        ctx.fillStyle =
            "#080a0f";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        this.drawStoneWall();


        /*
         * Grande table
         */

        ctx.fillStyle =
            "#38251c";


        ctx.fillRect(
            w * .27,
            h * .65,
            w * .46,
            28
        );


        ctx.fillStyle =
            "#211612";


        ctx.fillRect(
            w * .30,
            h * .68,
            22,
            100
        );


        ctx.fillRect(
            w * .68,
            h * .68,
            22,
            100
        );


        /*
         * Documents
         */

        ctx.fillStyle =
            "#d6c7a4";


        ctx.save();

        ctx.translate(
            w * .50,
            h * .59
        );

        ctx.rotate(-.06);

        ctx.fillRect(
            -105,
            -25,
            210,
            80
        );

        ctx.restore();


        /*
         * Sceau
         */

        ctx.fillStyle =
            "#8d2632";


        ctx.beginPath();

        ctx.arc(
            w * .55,
            h * .63,
            16,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * IV dans l'ombre
         */

        this.drawDuckVillain(
            w * .82,
            h * .23,
            .90
        );


        this.drawTorch(
            w * .12,
            h * .43
        );


        this.drawTorch(
            w * .88,
            h * .43
        );


        this.drawSmoke(
            w * .18,
            h * .75,
            .7
        );


        this.drawDust(70);
    },


    /* =====================================================
       SCÈNE 6
       ACCUSATION
    ===================================================== */

    drawScene6() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        ctx.fillStyle =
            "#06080c";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        this.drawStoneWall();

        this.drawGothicColumns();


        /*
         * Roi au centre
         */

        this.drawDuckKing(
            w * .32,
            h * .57,
            .78
        );


        /*
         * Gardes
         */

        this.drawGuard(
            w * .16,
            h * .57
        );


        this.drawGuard(
            w * .48,
            h * .57
        );


        this.drawGuard(
            w * .84,
            h * .57
        );


        /*
         * Couronne :
         * elle est posée sur la tête du roi,
         * pas flottante.
         */

        this.drawCrown(
            w * .32,
            h * .57 - 78,
            .62
        );


        /*
         * IV dans l'obscurité
         */

        this.drawDuckVillain(
            w * .77,
            h * .26,
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


        this.drawDust(80);
    },


    /* =====================================================
       SCÈNE 7
       BANNISSEMENT
    ===================================================== */

    drawScene7() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        /*
         * Cour du palais
         */

        const sky =
            ctx.createLinearGradient(
                0,
                0,
                0,
                h
            );


        sky.addColorStop(
            0,
            "#080b13"
        );


        sky.addColorStop(
            .70,
            "#151922"
        );


        sky.addColorStop(
            1,
            "#07090d"
        );


        ctx.fillStyle = sky;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        /*
         * Palais au fond
         */

        this.drawCastleSilhouette(
            w / 2,
            h * .62,
            .58
        );


        /*
         * Cour
         */

        ctx.fillStyle =
            "#15171c";


        ctx.fillRect(
            0,
            h * .67,
            w,
            h * .33
        );


        /*
         * Foule
         */

        this.drawCrowd(
            w / 2,
            h * .67
        );


        /*
         * Gardes qui entourent III
         */

        this.drawGuard(
            w * .28,
            h * .57
        );


        this.drawGuard(
            w * .72,
            h * .57
        );


        this.drawGuard(
            w * .40,
            h * .61
        );


        this.drawGuard(
            w * .60,
            h * .61
        );


        /*
         * PORTAIL
         *
         * ouverture rapide,
         * fermeture très rapide.
         */

        const opening =
            Math.min(
                1,
                this.visualTime / 2.0
            );


        const closeStart = 9.0;

        const closeDuration = 1.8;


        let portalAlpha = 1;


        if (
            this.visualTime >
            closeStart
        ) {

            portalAlpha =
                1 -
                Math.min(
                    1,
                    (
                        this.visualTime -
                        closeStart
                    ) /
                    closeDuration
                );
        }


        const portalScale =
            .75 +
            opening * .25;


        ctx.save();

        ctx.globalAlpha =
            opening *
            portalAlpha;


        this.drawPortal(
            w * .50,
            h * .49,
            portalScale
        );


        ctx.restore();


        /*
         * Ponanini III avance
         */

        const movement =
            Math.min(
                1,
                this.visualTime / 6
            );


        const eased =
            movement *
            movement *
            (3 - 2 * movement);


        const kingX =
            w * .35 +
            eased * w * .15;


        /*
         * Disparition
         */

        const vanishStart = 6.4;

        const vanishDuration = 2.5;


        let alpha = 1;


        if (
            this.visualTime >
            vanishStart
        ) {

            alpha =
                1 -
                Math.min(
                    1,
                    (
                        this.visualTime -
                        vanishStart
                    ) /
                    vanishDuration
                );
        }


        if (alpha > 0) {

            ctx.save();

            ctx.globalAlpha =
                alpha;

            this.drawDuckKing(
                kingX,
                h * .55,
                .84
            );

            ctx.restore();
        }


        /*
         * La couronne tombe avec le roi.
         */

        if (
            this.visualTime > 5.3 &&
            this.visualTime < 9
        ) {

            const p =
                Math.min(
                    1,
                    (
                        this.visualTime -
                        5.3
                    ) / 3.7
                );


            ctx.save();

            ctx.globalAlpha =
                1 - p;


            this.drawCrown(
                kingX + p * 65,
                h * .47 +
                p * p * 100,
                .45
            );


            ctx.restore();
        }


        /*
         * IV :
         * uniquement les yeux,
         * loin derrière.
         */

        this.drawDuckVillain(
            w * .17,
            h * .29,
            .85
        );


        this.drawPortalParticles(
            w * .50,
            h * .49,
            110
        );


        this.drawWindParticles(
            80
        );


        this.drawEmbers(
            25
        );
    },


    /* =====================================================
       SCÈNE 8
       NETHER
    ===================================================== */

    drawScene8() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        this.drawNetherBackground();


        /*
         * SOL NOIR
         */

        ctx.fillStyle =
            "#050506";


        ctx.beginPath();

        ctx.moveTo(
            0,
            h * .70
        );

        ctx.lineTo(
            w,
            h * .70
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


        /*
         * Craquelures
         */

        ctx.strokeStyle =
            "#321114";


        ctx.lineWidth = 2;


        for (
            let i = 0;
            i < 18;
            i++
        ) {

            const x =
                (i * 97) % w;


            const y =
                h * .73 +
                (i % 5) * 35;


            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x + 35,
                y - 12
            );

            ctx.lineTo(
                x + 70,
                y + 10
            );

            ctx.stroke();
        }


        /*
         * UN SEUL PONANINI III
         */

        const walk =
            Math.sin(
                this.visualTime * 2
            ) * 2;


        this.drawDuckKing(
            w * .50,
            h * .58 + walk,
            .82
        );


        /*
         * Ombre au sol
         */

        ctx.fillStyle =
            "rgba(0,0,0,.55)";


        ctx.beginPath();

        ctx.ellipse(
            w * .50,
            h * .77,
            75,
            18,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        this.drawSmoke(
            w * .18,
            h * .70,
            1
        );


        this.drawSmoke(
            w * .80,
            h * .66,
            1.2
        );


        this.drawEmbers(
            110
        );
    },


    /* =====================================================
       SCÈNE 9
       FRAGMENTS
    ===================================================== */

    drawScene9() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        this.drawNetherBackground();


        /*
         * Sol noir
         */

        ctx.fillStyle =
            "#050506";


        ctx.fillRect(
            0,
            h * .70,
            w,
            h * .30
        );


        /*
         * Ponanini III
         */

        this.drawDuckKing(
            w * .50,
            h * .62,
            .75
        );


        /*
         * Autel
         */

        ctx.fillStyle =
            "#1b1718";


        ctx.fillRect(
            w * .30,
            h * .69,
            w * .40,
            35
        );


        ctx.strokeStyle =
            "#806944";


        ctx.lineWidth = 3;


        ctx.strokeRect(
            w * .30,
            h * .69,
            w * .40,
            35
        );


        /*
         * Cercle magique
         */

        ctx.save();

        ctx.translate(
            w / 2,
            h * .48
        );


        ctx.rotate(
            this.visualTime * .12
        );


        ctx.strokeStyle =
            "#536dff";


        ctx.lineWidth = 3;


        ctx.beginPath();

        ctx.arc(
            0,
            0,
            160,
            0,
            Math.PI * 2
        );

        ctx.stroke();


        ctx.beginPath();

        ctx.arc(
            0,
            0,
            105,
            0,
            Math.PI * 2
        );

        ctx.stroke();


        ctx.restore();


        const fragments = [

            {
                x: w / 2,
                y: h * .26,
                color: "#dcb943"
            },

            {
                x: w * .37,
                y: h * .49,
                color: "#416fd0"
            },

            {
                x: w * .63,
                y: h * .49,
                color: "#7650c4"
            }

        ];


        fragments.forEach(
            (fragment, i) => {

                const y =
                    fragment.y +
                    Math.sin(
                        this.visualTime * 2 +
                        i
                    ) * 9;


                ctx.save();

                ctx.translate(
                    fragment.x,
                    y
                );


                ctx.rotate(
                    this.visualTime *
                    (.2 + i * .07)
                );


                const glow =
                    ctx.createRadialGradient(
                        0,
                        0,
                        4,
                        0,
                        0,
                        75
                    );


                glow.addColorStop(
                    0,
                    fragment.color
                );


                glow.addColorStop(
                    1,
                    "rgba(0,0,0,0)"
                );


                ctx.fillStyle =
                    glow;


                ctx.fillRect(
                    -80,
                    -80,
                    160,
                    160
                );


                ctx.fillStyle =
                    fragment.color;


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
                    "#eee8d5";


                ctx.stroke();


                ctx.restore();
            }
        );


        this.drawEmbers(
            100
        );
    },


    /* =====================================================
       SCÈNE 10
       L'AVENTURE COMMENCE
    ===================================================== */

    drawScene10() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        this.drawNetherBackground();


        /*
         * Sol noir
         */

        ctx.fillStyle =
            "#050506";


        ctx.fillRect(
            0,
            h * .70,
            w,
            h * .30
        );


        /*
         * Portail
         */

        const portalX =
            w * .70;


        const portalY =
            h * .48;


        const pulse =
            1 +
            Math.sin(
                this.visualTime * 2.5
            ) * .035;


        this.drawPortal(
            portalX,
            portalY,
            pulse
        );


        /*
         * Aventurier
         */

        const playerX =
            portalX;


        const playerY =
            h * .67;


        ctx.fillStyle =
            "#020205";


        ctx.beginPath();

        ctx.arc(
            playerX,
            playerY - 45,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillRect(
            playerX - 27,
            playerY - 20,
            54,
            115
        );


        /*
         * UN SEUL Ponanini III
         */

        this.drawDuckKing(
            w * .39,
            h * .57,
            .78
        );


        /*
         * Regard vers le joueur
         */

        ctx.strokeStyle =
            "rgba(214,181,68,.30)";


        ctx.lineWidth = 2;


        ctx.beginPath();

        ctx.moveTo(
            w * .46,
            h * .50
        );

        ctx.lineTo(
            playerX - 30,
            playerY - 35
        );

        ctx.stroke();


        this.drawPortalParticles(
            portalX,
            portalY,
            110
        );


        this.drawSmoke(
            w * .20,
            h * .70,
            .9
        );


        this.drawEmbers(
            80
        );
    },


    /* =====================================================
       VILLAGE
    ===================================================== */

    drawVillage(
        centerX,
        baseY
    ) {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;


        /*
         * Maisons
         */

        for (
            let i = -6;
            i <= 6;
            i++
        ) {

            if (i === 0)
                continue;


            const x =
                centerX +
                i * 95;


            const height =
                70 +
                Math.abs(i % 3) * 18;


            ctx.fillStyle =
                "#16191f";


            ctx.fillRect(
                x - 38,
                baseY - height,
                76,
                height
            );


            /*
             * Toit
             */

            ctx.fillStyle =
                "#0b0d12";


            ctx.beginPath();

            ctx.moveTo(
                x - 52,
                baseY - height
            );

            ctx.lineTo(
                x,
                baseY - height - 45
            );

            ctx.lineTo(
                x + 52,
                baseY - height
            );

            ctx.closePath();

            ctx.fill();


            /*
             * Fenêtre
             */

            ctx.fillStyle =
                "#c69d3b";


            ctx.fillRect(
                x - 7,
                baseY - height + 28,
                14,
                22
            );
        }


        /*
         * Route
         */

        ctx.fillStyle =
            "#111319";


        ctx.beginPath();

        ctx.moveTo(
            centerX - 85,
            baseY
        );

        ctx.lineTo(
            centerX + 85,
            baseY
        );

        ctx.lineTo(
            centerX + 190,
            Game.canvas.height
        );

        ctx.lineTo(
            centerX - 190,
            Game.canvas.height
        );

        ctx.closePath();

        ctx.fill();
    },


    /* =====================================================
       CHÂTEAU
    ===================================================== */

    drawCastleSilhouette(
        x,
        y,
        scale
    ) {

        const ctx = Game.ctx;

        const w =
            420 * scale;

        const h =
            260 * scale;


        ctx.fillStyle =
            "#171d29";


        ctx.fillRect(
            x - w / 2,
            y - h,
            w,
            h
        );


        /*
         * Tours
         */

        const towerW =
            90 * scale;


        ctx.fillRect(
            x - w / 2 - 45 * scale,
            y - h - 30 * scale,
            towerW,
            h + 30 * scale
        );


        ctx.fillRect(
            x + w / 2 - 45 * scale,
            y - h - 30 * scale,
            towerW,
            h + 30 * scale
        );


        /*
         * Toits
         */

        ctx.fillStyle =
            "#080b11";


        this.drawRoof(
            x - w / 2 - 45 * scale,
            y - h - 30 * scale,
            towerW
        );


        this.drawRoof(
            x + w / 2 - 45 * scale,
            y - h - 30 * scale,
            towerW
        );


        /*
         * Tour centrale
         */

        ctx.fillStyle =
            "#202530";


        ctx.fillRect(
            x - 75 * scale,
            y - h - 60 * scale,
            150 * scale,
            h + 60 * scale
        );


        ctx.fillStyle =
            "#08090d";


        ctx.beginPath();

        ctx.moveTo(
            x - 100 * scale,
            y - h - 60 * scale
        );

        ctx.lineTo(
            x,
            y - h - 185 * scale
        );

        ctx.lineTo(
            x + 100 * scale,
            y - h - 60 * scale
        );

        ctx.closePath();

        ctx.fill();


        /*
         * Fenêtres
         */

        ctx.fillStyle =
            "#d5a82e";


        for (
            let i = -2;
            i <= 2;
            i++
        ) {

            ctx.fillRect(
                x +
                i * 55 * scale -
                6,
                y -
                h * .55,
                12,
                24
            );
        }


        /*
         * Porte
         */

        ctx.fillStyle =
            "#06080c";


        ctx.fillRect(
            x - 30 * scale,
            y - 90 * scale,
            60 * scale,
            90 * scale
        );


        /*
         * Drapeaux
         */

        this.drawFlag(
            x - 115 * scale,
            y - h - 220 * scale,
            "#7d2632"
        );


        this.drawFlag(
            x + 115 * scale,
            y - h - 220 * scale,
            "#7d2632"
        );
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
            y - 65
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
            y + 75
        );

        ctx.stroke();


        const wave =
            Math.sin(
                this.visualTime * 2 +
                x * .01
            ) * 5;


        ctx.fillStyle =
            color;


        ctx.beginPath();

        ctx.moveTo(
            x + 3,
            y + 5
        );

        ctx.quadraticCurveTo(
            x + 25,
            y + 12 + wave,
            x + 48,
            y + 5
        );

        ctx.lineTo(
            x + 40,
            y + 35
        );

        ctx.quadraticCurveTo(
            x + 20,
            y + 25 + wave,
            x + 3,
            y + 32
        );

        ctx.closePath();

        ctx.fill();
    },


    /* =====================================================
       MURS
    ===================================================== */

    drawStoneWall() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        ctx.strokeStyle =
            "rgba(65,69,78,.55)";


        ctx.lineWidth = 2;


        for (
            let row = 0;
            row < 9;
            row++
        ) {

            const y =
                row * 65;


            const offset =
                row % 2 === 0 ?
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
                    65
                );
            }
        }
    },


    /* =====================================================
       COLONNES
    ===================================================== */

    drawGothicColumns() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        ctx.fillStyle =
            "#101218";


        [
            w * .08,
            w * .28,
            w * .72,
            w * .92
        ].forEach(x => {

            ctx.fillRect(
                x - 22,
                h * .10,
                44,
                h * .67
            );


            ctx.fillRect(
                x - 35,
                h * .10,
                70,
                22
            );


            ctx.fillRect(
                x - 35,
                h * .73,
                70,
                22
            );
        });
    },


    /* =====================================================
       VITRAUX
    ===================================================== */

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
            "#14151b";


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
            "#5d5036";


        ctx.lineWidth = 5;

        ctx.stroke();


        ctx.fillStyle =
            "rgba(83,47,55,.65)";


        ctx.fillRect(
            -size * .22,
            -size * .22,
            size * .22,
            size * .44
        );


        ctx.fillStyle =
            "rgba(57,74,105,.65)";


        ctx.fillRect(
            0,
            -size * .22,
            size * .22,
            size * .44
        );


        ctx.restore();
    },


    /* =====================================================
       TRÔNE
    ===================================================== */

    drawThrone(
        x,
        y
    ) {

        const ctx = Game.ctx;


        /*
         * Structure haute
         */

        ctx.fillStyle =
            "#806129";


        ctx.fillRect(
            x - 82,
            y - 120,
            164,
            155
        );


        /*
         * Dossier
         */

        ctx.fillStyle =
            "#5a1e29";


        ctx.fillRect(
            x - 62,
            y - 102,
            124,
            110
        );


        /*
         * Accoudoirs
         */

        ctx.fillStyle =
            "#b9973e";


        ctx.fillRect(
            x - 104,
            y + 10,
            34,
            25
        );


        ctx.fillRect(
            x + 70,
            y + 10,
            34,
            25
        );


        /*
         * Pieds
         */

        ctx.fillStyle =
            "#5b4423";


        ctx.fillRect(
            x - 65,
            y + 35,
            18,
            55
        );


        ctx.fillRect(
            x + 47,
            y + 35,
            18,
            55
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
         * Cape
         */

        ctx.fillStyle =
            "#17131b";


        ctx.beginPath();

        ctx.moveTo(
            -55,
            30
        );

        ctx.quadraticCurveTo(
            -78,
            90,
            -86,
            145
        );

        ctx.lineTo(
            86,
            145
        );

        ctx.quadraticCurveTo(
            78,
            90,
            55,
            30
        );

        ctx.closePath();

        ctx.fill();


        ctx.strokeStyle =
            "#7d6331";


        ctx.lineWidth = 3;

        ctx.stroke();


        /*
         * Armure
         */

        ctx.fillStyle =
            "#29313b";


        ctx.fillRect(
            -42,
            35,
            84,
            92
        );


        ctx.strokeStyle =
            "#756744";


        ctx.strokeRect(
            -42,
            35,
            84,
            92
        );


        /*
         * Épaules
         */

        ctx.fillStyle =
            "#454c55";


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


        /*
         * Tête
         */

        ctx.fillStyle =
            "#d8ba4b";


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


        /*
         * Plumage supérieur
         */

        ctx.fillStyle =
            "#27282d";


        ctx.beginPath();

        ctx.arc(
            0,
            -11,
            40,
            Math.PI,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * Yeux
         */

        ctx.fillStyle =
            "#f4e9b4";


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
            "#16171b";


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
         * Bec
         */

        ctx.fillStyle =
            "#d58927";


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


        /*
         * Couronne directement
         * au sommet de la tête.
         */

        this.drawCrown(
            0,
            -42,
            1
        );


        ctx.restore();
    },


    /* =====================================================
       PONANINI IV
       YEUX UNIQUEMENT
    ===================================================== */

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
                    this.visualTime * 2.2
                )
            ) * .35;


        const eyeWidth =
            17 * scale;


        const eyeHeight =
            6 * scale;


        ctx.save();


        ctx.shadowBlur =
            18 * scale;


        ctx.shadowColor =
            `rgba(190,20,30,${pulse})`;


        ctx.fillStyle =
            `rgba(225,35,42,${pulse})`;


        ctx.fillRect(
            x - 27 * scale,
            y,
            eyeWidth,
            eyeHeight
        );


        ctx.fillRect(
            x + 10 * scale,
            y,
            eyeWidth,
            eyeHeight
        );


        ctx.restore();
    },


    /* =====================================================
       GARDES
    ===================================================== */

    drawGuard(
        x,
        y
    ) {

        const ctx = Game.ctx;


        /*
         * Corps
         */

        ctx.fillStyle =
            "#080b10";


        ctx.fillRect(
            x - 20,
            y,
            40,
            90
        );


        /*
         * Casque
         */

        ctx.fillStyle =
            "#303847";


        ctx.beginPath();

        ctx.arc(
            x,
            y - 10,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * Visage caché
         */

        ctx.fillStyle =
            "#08090c";


        ctx.fillRect(
            x - 20,
            y - 5,
            40,
            10
        );


        /*
         * Lance
         */

        ctx.strokeStyle =
            "#554d43";


        ctx.lineWidth = 3;


        ctx.beginPath();

        ctx.moveTo(
            x + 30,
            y - 45
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
        centerX,
        baseY
    ) {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;


        for (
            let i = -8;
            i <= 8;
            i++
        ) {

            const x =
                centerX +
                i * 55;


            const bob =
                Math.sin(
                    this.visualTime * 1.5 +
                    i
                ) * 2;


            ctx.fillStyle =
                "#111319";


            ctx.beginPath();

            ctx.arc(
                x,
                baseY - 35 + bob,
                13,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillRect(
                x - 16,
                baseY - 20 + bob,
                32,
                50
            );
        }
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
            "#d9ac30";


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


        /*
         * Gemmes
         */

        ctx.fillStyle =
            "#a82f3b";


        ctx.beginPath();

        ctx.arc(
            0,
            -25,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#4675b7";


        ctx.beginPath();

        ctx.arc(
            -24,
            -14,
            4,
            0,
            Math.PI * 2
        );


        ctx.arc(
            24,
            -14,
            4,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.restore();
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
            "rgba(255,180,40,.30)"
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
            "#5a3823";


        ctx.fillRect(
            x - 4,
            y - 5,
            8,
            55
        );


        ctx.fillStyle =
            "#f0a42a";


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
            "#ffe5a0";


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
            30 * scale,
            0,
            0,
            Math.PI * 2
        );


        ctx.ellipse(
            x + 80 * scale,
            y - 12,
            80 * scale,
            35 * scale,
            0,
            0,
            Math.PI * 2
        );


        ctx.fill();
    },


    drawMovingClouds() {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;


        ctx.fillStyle =
            "rgba(10,18,32,.82)";


        const x =
            (
                this.visualTime * 12
            ) %
            (w + 600) -
            300;


        this.drawCloud(
            x,
            130,
            1
        );


        this.drawCloud(
            x - 500,
            210,
            .7
        );


        this.drawCloud(
            x + 650,
            95,
            .55
        );
    },


    /* =====================================================
       BROUILLARD
    ===================================================== */

    drawFog(
        x,
        y,
        scale = 1
    ) {

        const ctx = Game.ctx;


        ctx.save();

        ctx.globalAlpha = .15;


        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const offset =
                Math.sin(
                    this.visualTime * .35 +
                    i
                ) * 40;


            ctx.fillStyle =
                "#8c9094";


            ctx.beginPath();


            ctx.ellipse(
                x +
                offset +
                i * 45 * scale,

                y -
                i * 7,

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
                    i * 83 +
                    this.visualTime * 7
                ) % w;


            const y =
                (
                    i * 47 +
                    this.visualTime * 5
                ) % h;


            const size =
                1 +
                (i % 3);


            ctx.globalAlpha =
                .15 +
                Math.abs(
                    Math.sin(
                        this.visualTime +
                        i
                    )
                ) * .30;


            ctx.fillStyle =
                "#c4bda7";


            ctx.fillRect(
                x,
                y,
                size,
                size
            );
        }


        ctx.globalAlpha = 1;
    },


    /* =====================================================
       VENT
    ===================================================== */

    drawWindParticles(
        count
    ) {

        const ctx = Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        ctx.strokeStyle =
            "rgba(170,180,190,.20)";


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
                ) % w;


            const y =
                (
                    i * 53 +
                    this.visualTime * 11
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

            const offset =
                Math.sin(
                    this.visualTime * .6 +
                    i
                ) * 18;


            const rise =
                (
                    this.visualTime * 18 +
                    i * 35
                ) % 150;


            ctx.fillStyle =
                `rgba(70,65,65,${.06 + i * .01})`;


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


            ctx.fillStyle =
                i % 3 === 0 ?
                "#ffb33b" :
                "#c94325";


            ctx.globalAlpha =
                .25 +
                Math.abs(
                    Math.sin(
                        this.visualTime * 3 +
                        i
                    )
                ) * .65;


            ctx.fillRect(
                x,
                y,
                2 + i % 3,
                2 + i % 3
            );
        }


        ctx.globalAlpha = 1;
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
         * Aura
         */

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
            "rgba(55,90,255,.35)"
        );


        glow.addColorStop(
            .55,
            "rgba(55,40,180,.12)"
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


        /*
         * Anneau
         */

        ctx.shadowBlur = 28;

        ctx.shadowColor =
            "#345cff";


        ctx.strokeStyle =
            "#536dff";


        ctx.lineWidth = 15;


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


        /*
         * Anneau interne
         */

        ctx.shadowBlur = 10;

        ctx.strokeStyle =
            "#9eb5ff";


        ctx.lineWidth = 4;


        ctx.beginPath();


        ctx.ellipse(
            0,
            0,
            100,
            162,
            0,
            0,
            Math.PI * 2
        );


        ctx.stroke();


        /*
         * Intérieur
         */

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
            "rgba(15,25,80,.85)"
        );


        inside.addColorStop(
            .55,
            "rgba(10,5,35,.92)"
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
            99,
            160,
            0,
            0,
            Math.PI * 2
        );


        ctx.fill();


        /*
         * Rayons
         */

        ctx.shadowBlur = 12;

        ctx.strokeStyle =
            "#6d8cff";


        ctx.lineWidth = 2;


        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const angle =
                i *
                Math.PI /
                4 +
                this.visualTime *
                .5;


            const x1 =
                Math.cos(angle) *
                125;


            const y1 =
                Math.sin(angle) *
                185;


            const x2 =
                Math.cos(angle) *
                150;


            const y2 =
                Math.sin(angle) *
                210;


            ctx.beginPath();


            ctx.moveTo(
                x1,
                y1
            );


            ctx.lineTo(
                x2,
                y2
            );


            ctx.stroke();
        }


        ctx.restore();
    },


    /* =====================================================
       PARTICULES DU PORTAIL
    ===================================================== */

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


            ctx.fillStyle =
                i % 3 === 0 ?
                "#a8b8ff" :
                "#536dff";


            ctx.globalAlpha =
                .20 +
                Math.abs(
                    Math.sin(
                        this.visualTime * 2 +
                        i
                    )
                ) * .60;


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
       NETHER
    ===================================================== */

    drawNetherBackground() {

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
            "#0d0207"
        );


        gradient.addColorStop(
            .45,
            "#30070c"
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
         * Montagnes
         */

        ctx.fillStyle =
            "#16050a";


        for (
            let i = 0;
            i < 9;
            i++
        ) {

            ctx.beginPath();


            ctx.moveTo(
                i * 170,
                h * .78
            );


            ctx.lineTo(
                i * 170 + 85,
                h *
                (
                    .25 +
                    (i % 3) * .06
                )
            );


            ctx.lineTo(
                i * 170 + 170,
                h * .78
            );


            ctx.closePath();


            ctx.fill();
        }


        /*
         * Fissures rouges
         */

        ctx.strokeStyle =
            "#7c1810";


        ctx.lineWidth = 3;


        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const x =
                i * 130 +
                Math.sin(
                    this.visualTime +
                    i
                ) * 10;


            ctx.beginPath();


            ctx.moveTo(
                x,
                h * .82
            );


            ctx.lineTo(
                x + 40,
                h * .79
            );


            ctx.lineTo(
                x + 75,
                h * .83
            );


            ctx.stroke();
        }
    }

};


/* ==========================================================
   CONTRÔLES
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
