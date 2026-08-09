const Prologue = {

    narratorEnabled: true,
    narratorSpeaking: false,
    narratorVoice: null,

    active: false,
    scene: 0,
    timer: 0,
    textIndex: 0,
    finishedText: false,

    fade: 1,
    fadeDirection: -1,

    visualTime: 0,

    images: [],
    imagesLoaded: 0,
    loading: false,
    ready: false,


    /* =====================================================
       SCÈNES
    ===================================================== */

    scenes: [

        {
            title: "IL ÉTAIT UNE FOIS...",
            text:
                "Dans une vallée oubliée des hommes, " +
                "un ancien royaume vivait derrière ses murailles. " +
                "Ponan dormait sous la brume, protégé par ses montagnes. " +
                "Au centre du royaume s'élevait le palais royal.",
            duration: 11000,
            speed: 42,
            zoom: 1.00
        },

        {
            title: "LE ROYAUME DE PONAN",
            text:
                "Depuis des générations, la couronne appartenait " +
                "à la lignée des Ponanini. Mais derrière les murs " +
                "du palais, la paix n'était déjà plus qu'un souvenir.",
            duration: 11000,
            speed: 42,
            zoom: 1.08
        },

        {
            title: "PONANINI III, ROI JUSTE",
            text:
                "Ponanini III régnait avec justice. " +
                "Son peuple l'aimait. Son royaume prospérait. " +
                "Et pourtant, dans l'ombre, quelqu'un attendait son heure.",
            duration: 11000,
            speed: 42,
            zoom: 1.04
        },

        {
            title: "LE FRÈRE DANS L'OMBRE",
            text:
                "Son propre frère observait le trône. " +
                "Il ne voulait ni patience, ni héritage. " +
                "Il voulait le pouvoir. Et pour l'obtenir, " +
                "il était prêt à sacrifier son propre sang.",
            duration: 11000,
            speed: 42,
            zoom: 1.08
        },

        {
            title: "LE MENSONGE",
            text:
                "Les rumeurs commencèrent à courir dans les rues. " +
                "Puis vinrent les accusations. " +
                "Un mensonge répété assez longtemps finit toujours " +
                "par ressembler à la vérité.",
            duration: 11000,
            speed: 42,
            zoom: 1.06
        },

        {
            title: "LA PRISE DU POUVOIR",
            text:
                "Ponanini III fut accusé de trahison. " +
                "Des gardes furent achetés. " +
                "La foule se retourna contre lui. " +
                "Et son frère prit enfin la place qu'il convoitait.",
            duration: 12000,
            speed: 42,
            zoom: 1.08
        },

        {
            title: "LE BANNISSEMENT",
            text:
                "Dans la cour du palais, les gardes escortèrent " +
                "Ponanini III jusqu'au portail interdit. " +
                "Il fut jeté dans le Nether. " +
                "Le portail se referma presque aussitôt derrière lui.",
            duration: 12000,
            speed: 40,
            zoom: 1.10
        },

        {
            title: "LE SCEAU",
            text:
                "Mais le Nether ne fut pas sa seule prison. " +
                "Un ancien sceau fut gravé sur les portes du royaume. " +
                "Même si quelqu'un venait le libérer, " +
                "Ponanini III ne pourrait jamais sortir.",
            duration: 12000,
            speed: 40,
            zoom: 1.08
        },

        {
            title: "LES TROIS FRAGMENTS",
            text:
                "Trois fragments furent dispersés à travers les terres. " +
                "Ils sont les seuls capables de briser le sceau. " +
                "Sans eux, aucun chemin ne mène hors du Nether.",
            duration: 12000,
            speed: 40,
            zoom: 1.06
        },

        {
            title: "L'HÉRITAGE",
            text:
                "Alors Ponanini III attendit. " +
                "Il lui fallait quelqu'un du monde des vivants. " +
                "Quelqu'un capable de retrouver les trois fragments. " +
                "Et cette personne... c'est vous.",
            duration: 13000,
            speed: 38,
            zoom: 1.08
        }

    ],


    /* =====================================================
       LANCEMENT
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

        this.narratorSpeaking = false;

        this.hideHUD();

        window.speechSynthesis.cancel();

        this.loadImages();
    },


    /* =====================================================
       NARRATEUR
    ===================================================== */

    speakNarrator(text) {

        if (!this.narratorEnabled)
            return;

        if (!("speechSynthesis" in window))
            return;

        window.speechSynthesis.cancel();

        const voices =
            window.speechSynthesis.getVoices();

        let voice =
            voices.find(v =>
                v.lang &&
                v.lang.toLowerCase().startsWith("fr") &&
                /male|homme|thomas|henri|paul/i.test(v.name)
            );

        if (!voice) {

            voice =
                voices.find(v =>
                    v.lang &&
                    v.lang.toLowerCase().startsWith("fr")
                );
        }

        this.narratorVoice =
            voice || null;

        const utterance =
            new SpeechSynthesisUtterance(text);

        utterance.lang = "fr-FR";

        /*
         * Voix volontairement lente et grave.
         */

        utterance.rate = 0.78;
        utterance.pitch = 0.62;
        utterance.volume = 1;

        if (this.narratorVoice)
            utterance.voice = this.narratorVoice;

        this.narratorSpeaking = true;

        utterance.onend = () => {

            this.narratorSpeaking = false;

        };

        utterance.onerror = () => {

            this.narratorSpeaking = false;

        };

        window.speechSynthesis.speak(
            utterance
        );
    },


    /* =====================================================
       CHARGEMENT DES IMAGES
    ===================================================== */

    loadImages() {

        if (this.ready || this.loading)
            return;

        this.loading = true;

        this.images =
            new Array(this.scenes.length);

        this.imagesLoaded = 0;


        this.scenes.forEach((scene, i) => {

            const img =
                new Image();


            img.onload = () => {

                this.images[i] = img;

                this.imagesLoaded++;


                if (
                    this.imagesLoaded ===
                    this.scenes.length
                ) {

                    this.ready = true;

                    this.loading = false;


                    /*
                     * Toutes les images sont chargées.
                     * On peut lancer le narrateur.
                     */

                    setTimeout(() => {

                        if (
                            this.active &&
                            this.scene === 0
                        ) {

                            this.speakNarrator(
                                this.scenes[0].text
                            );

                        }

                    }, 800);
                }
            };


            img.onerror = () => {

                console.error(
                    "Erreur scene" +
                    (i + 1) +
                    ".png"
                );

            };


            img.src =
                "assets/prologue/scene" +
                (i + 1) +
                ".png";

        });
    },


    /* =====================================================
       HUD
    ===================================================== */

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


    /* =====================================================
       UPDATE
    ===================================================== */

    update(dt) {

        if (
            !this.active ||
            !this.ready
        )
            return;


        const current =
            this.scenes[this.scene];


        if (!current)
            return;


        this.timer += dt;

        this.visualTime += dt;


        /*
         * Texte progressif.
         */

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


        /*
         * Fade d'entrée.
         */

        if (
            this.fadeDirection === -1
        ) {

            this.fade -=
                dt * 1.8;


            if (this.fade <= 0) {

                this.fade = 0;

                this.fadeDirection = 0;

            }
        }


        /*
         * On ne change pas de scène
         * tant que le narrateur parle.
         */

        if (
            this.finishedText &&
            !this.narratorSpeaking &&
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


        window.speechSynthesis.cancel();

        this.narratorSpeaking = false;


        this.scene++;

        this.timer = 0;

        this.textIndex = 0;

        this.finishedText = false;

        this.fade = 1;

        this.fadeDirection = -1;

        this.visualTime = 0;


        /*
         * Petit silence avant la nouvelle narration.
         */

        setTimeout(() => {

            if (
                this.active &&
                this.scenes[this.scene]
            ) {

                this.speakNarrator(
                    this.scenes[this.scene].text
                );

            }

        }, 700);
    },


    /* =====================================================
       ESPACE / ENTRÉE
    ===================================================== */

    skipText() {

        if (
            !this.active ||
            !this.ready
        )
            return;


        const current =
            this.scenes[this.scene];


        /*
         * Premier appui :
         * termine le texte.
         */

        if (!this.finishedText) {

            this.textIndex =
                current.text.length;

            this.finishedText = true;

            return;
        }


        /*
         * Deuxième appui :
         * scène suivante.
         */

        this.nextScene();
    },


    /* =====================================================
       FIN DE LA PROLOGUE
    ===================================================== */

    finish() {

        window.speechSynthesis.cancel();

        this.narratorSpeaking = false;

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

        } else {

            Game.running = true;

        }
    },


    /* =====================================================
       DRAW
    ===================================================== */

    draw() {

        const ctx =
            Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        if (!this.ready) {

            this.drawLoading();

            return;
        }


        const current =
            this.scenes[this.scene];

        const image =
            this.images[this.scene];


        if (
            !current ||
            !image
        )
            return;


        this.drawImageScene(
            image,
            current
        );


        this.drawVignette();

        this.drawNarration(
            current
        );


        if (this.fade > 0) {

            ctx.fillStyle =
                "rgba(0,0,0," +
                this.fade +
                ")";

            ctx.fillRect(
                0,
                0,
                width,
                height
            );
        }
    },


    /* =====================================================
       ÉCRAN DE CHARGEMENT
    ===================================================== */

    drawLoading() {

        const ctx =
            Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        ctx.fillStyle =
            "#050609";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        ctx.textAlign =
            "center";


        ctx.fillStyle =
            "#d9b441";

        ctx.font =
            "bold 30px Georgia";

        ctx.fillText(
            "PONAN'S LEGACY",
            width / 2,
            height / 2 - 55
        );


        ctx.fillStyle =
            "#eee8d5";

        ctx.font =
            "20px Georgia";

        ctx.fillText(
            "Préparation du royaume...",
            width / 2,
            height / 2
        );


        const barWidth =
            Math.min(
                520,
                width * 0.65
            );

        const x =
            (width - barWidth) / 2;

        const y =
            height / 2 + 35;


        ctx.fillStyle =
            "#17191f";

        ctx.fillRect(
            x,
            y,
            barWidth,
            12
        );


        ctx.fillStyle =
            "#b9973e";

        ctx.fillRect(
            x,
            y,
            barWidth *
            (
                this.imagesLoaded /
                this.scenes.length
            ),
            12
        );


        ctx.font =
            "15px Arial";

        ctx.fillStyle =
            "rgba(255,255,255,.65)";

        ctx.fillText(
            this.imagesLoaded +
            " / " +
            this.scenes.length,
            width / 2,
            y + 42
        );
    },


    /* =====================================================
       IMAGE + CAMÉRA
    ===================================================== */

    drawImageScene(
        image,
        scene
    ) {

        const ctx =
            Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        const ratio =
            image.width /
            image.height;

        const screenRatio =
            width /
            height;


        let drawWidth;
        let drawHeight;


        if (
            ratio >
            screenRatio
        ) {

            drawHeight =
                height *
                scene.zoom;

            drawWidth =
                drawHeight *
                ratio;

        } else {

            drawWidth =
                width *
                scene.zoom;

            drawHeight =
                drawWidth /
                ratio;
        }


        const progress =
            Math.min(
                1,
                this.visualTime /
                Math.max(
                    1,
                    scene.duration / 1000
                )
            );


        const ease =
            progress *
            progress *
            (3 - 2 * progress);


        let moveX = 0;
        let moveY = 0;


        if (this.scene === 0) {

            moveY =
                ease * 35;

        } else if (this.scene === 1) {

            moveY =
                ease * -35;

        } else if (this.scene === 2) {

            moveY =
                Math.sin(
                    ease * Math.PI
                ) * -18;

        } else if (this.scene === 3) {

            moveX =
                Math.sin(
                    ease * Math.PI
                ) * 28;

        } else if (this.scene === 4) {

            moveX =
                ease * -28;

        } else if (this.scene === 5) {

            moveY =
                ease * 22;

        } else if (this.scene === 6) {

            moveX =
                ease * 22;

        } else if (this.scene === 7) {

            moveY =
                ease * -20;

        } else if (this.scene === 8) {

            moveX =
                Math.sin(
                    ease * Math.PI
                ) * 16;

        } else {

            moveX =
                ease * -25;

        }


        ctx.save();

        ctx.imageSmoothingEnabled =
            false;


        ctx.drawImage(
            image,
            (width - drawWidth) / 2 +
                moveX,
            (height - drawHeight) / 2 +
                moveY,
            drawWidth,
            drawHeight
        );


        ctx.restore();


        this.drawParticles();
    },


    /* =====================================================
       PARTICULES
    ===================================================== */

    drawParticles() {

        const ctx =
            Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        ctx.save();


        /*
         * Pluie / poussière médiévale.
         */

        if (
            [
                0,
                1,
                3,
                4
            ].includes(this.scene)
        ) {

            ctx.strokeStyle =
                "rgba(190,205,220,.16)";

            ctx.lineWidth = 1;


            for (
                let i = 0;
                i < 35;
                i++
            ) {

                const x =
                    (
                        i * 113 +
                        this.visualTime * 28
                    ) % width;


                const y =
                    (
                        i * 67 +
                        this.visualTime * 95
                    ) % height;


                ctx.beginPath();

                ctx.moveTo(
                    x,
                    y
                );

                ctx.lineTo(
                    x - 4,
                    y + 13
                );

                ctx.stroke();
            }
        }


        /*
         * Braises du Nether.
         */

        if (
            [
                6,
                7,
                8,
                9
            ].includes(this.scene)
        ) {

            for (
                let i = 0;
                i < 55;
                i++
            ) {

                const x =
                    (
                        i * 79 +
                        this.visualTime * 22
                    ) % width;


                const y =
                    height -
                    (
                        (
                            i * 43 +
                            this.visualTime * 25
                        ) %
                        (height * 0.75)
                    );


                ctx.fillStyle =
                    i % 3 === 0
                        ? "#ffb33b"
                        : "#c94325";


                ctx.globalAlpha =
                    0.20 +
                    Math.abs(
                        Math.sin(
                            this.visualTime * 3 +
                            i
                        )
                    ) * 0.55;


                ctx.fillRect(
                    x,
                    y,
                    2 + i % 3,
                    2 + i % 3
                );
            }
        }


        ctx.globalAlpha = 1;

        ctx.restore();
    },


    /* =====================================================
       VIGNETTE
    ===================================================== */

    drawVignette() {

        const ctx =
            Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        const vignette =
            ctx.createRadialGradient(
                width / 2,
                height / 2,
                height * 0.20,
                width / 2,
                height / 2,
                height * 0.78
            );


        vignette.addColorStop(
            0,
            "rgba(0,0,0,0)"
        );


        vignette.addColorStop(
            1,
            "rgba(0,0,0,.78)"
        );


        ctx.fillStyle =
            vignette;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );
    },


    /* =====================================================
       NARRATION À L'ÉCRAN
    ===================================================== */

    drawNarration(scene) {

        const ctx =
            Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        const boxWidth =
            Math.min(
                900,
                width * 0.82
            );

        const boxHeight =
            165;


        const x =
            (width - boxWidth) / 2;

        const y =
            height - 215;


        ctx.fillStyle =
            "rgba(0,0,0,.78)";

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


        ctx.textAlign =
            "left";


        ctx.font =
            "bold 18px Georgia";

        ctx.fillStyle =
            "#d9b441";


        ctx.fillText(
            scene.title,
            x + 24,
            y + 30
        );


        ctx.font =
            "22px Georgia";

        ctx.fillStyle =
            "#f1eee5";


        this.drawWrappedText(
            scene.text.substring(
                0,
                this.textIndex
            ),
            x + 24,
            y + 72,
            boxWidth - 48,
            31
        );


        ctx.textAlign =
            "center";

        ctx.font =
            "15px Arial";

        ctx.fillStyle =
            "rgba(255,255,255,.65)";


        ctx.fillText(
            "ESPACE / ENTRÉE : continuer",
            width / 2,
            height - 25
        );


        ctx.textAlign =
            "left";

        ctx.fillStyle =
            "rgba(255,255,255,.45)";


        ctx.fillText(
            "PROLOGUE " +
            (this.scene + 1) +
            " / " +
            this.scenes.length,
            22,
            28
        );
    },


    /* =====================================================
       TEXTE MULTI-LIGNES
    ===================================================== */

    drawWrappedText(
        text,
        x,
        y,
        maxWidth,
        lineHeight
    ) {

        const ctx =
            Game.ctx;

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
            event.key === "Enter"
        ) {

            event.preventDefault();

            Prologue.skipText();
        }
    }
);
