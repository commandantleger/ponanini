const Prologue = {

    active: false,

    scene: 0,

    timer: 0,

    textIndex: 0,

    finishedText: false,

    fade: 0,

    fadeDirection: 0,

    muted: false,

        visualTime: 0,

    particles: [],

    clouds: [
        {
            x: 100,
            y: 120,
            speed: 8,
            size: 1
        },
        {
            x: 500,
            y: 180,
            speed: 5,
            size: 0.7
        },
        {
            x: 900,
            y: 100,
            speed: 10,
            size: 1.2
        }
    ],

    currentAudio: null,

    textSpeed: 45,

    scenes: [

        {
            title: "IL ÉTAIT UNE FOIS...",

            text:
                "Il existe des royaumes dont l'histoire " +
                "est écrite par les vainqueurs.",

            duration: 11000,

	    visual : "kingdom",

            audio: "assets/sounds/prologue/scene1.mp3"
        },

        {

            title: "LE ROYAUME DE PONAN",

            text:
                "Pendant des générations, le royaume " +
                "des canards connut la paix sous la " +
                "dynastie des Plumes Dorées.",

            duration: 9500,

            audio: "assets/sounds/prologue/scene2.mp3"
        },

        {

            title: "PONANINI III",

            text:
                "Ponanini III était le roi légitime " +
                "du royaume de Ponan. " +
                "Un roi aimé de son peuple.",

            duration: 12000,

	    visual: "throne",

            audio: "assets/sounds/prologue/scene3.mp3"
        },

        {

            title: "LA TRAHISON",

            text:
                "Mais un jour, tout bascula. " +
                "Ponanini III fut accusé d'un crime " +
                "qu'il n'avait jamais commis.",

            duration: 10000,

            audio: "assets/sounds/prologue/scene4.mp3"
        },

        {

            title: "PONANINI IV",

            text:
                "Son propre héritier prit alors sa place " +
                "sur le trône. " +
                "Ponanini IV devint roi.",

            duration: 9000,

            audio: "assets/sounds/prologue/scene5.mp3"
        },

        {

            title: "L'EXIL",

            text:
                "Ponanini III fut condamné à l'exil. " +
                "Mais pas n'importe quel exil.",

            duration: 8500,

            audio: "assets/sounds/prologue/scene6.mp3"
        },

        {

            title: "LE NETHER",

            text:
                "Il fut envoyé dans une dimension " +
                "oubliée du royaume. " +
                "Une terre dont personne ne revenait.",

            duration: 10000,

            audio: "assets/sounds/prologue/scene7.mp3"
        },

        {

            title: "DES ANNÉES PASSÈRENT",

            text:
                "Les années devinrent des décennies. " +
                "Mais dans les ténèbres, l'ancien roi " +
                "n'oublia jamais ce qui lui avait été fait.",

            duration: 10500,

            audio: "assets/sounds/prologue/scene8.mp3"
        },

        {

            title: "LES TROIS FRAGMENTS",

            text:
                "Puis il découvrit l'existence de trois " +
                "fragments capables d'ouvrir la porte " +
                "entre les deux mondes.",

            duration: 10500,

            audio: "assets/sounds/prologue/scene9.mp3"
        },

        {

            title: "LA VENGEANCE",

            text:
                "Il lui fallait seulement quelqu'un " +
                "dans le monde réel pour les retrouver.",

            duration: 9000,

            audio: "assets/sounds/prologue/scene10.mp3"
        },

        {

            title: "ET QUELQU'UN ARRIVA...",

            text:
                "Quelqu'un qui ignorait encore " +
                "qu'il était déjà devenu une pièce " +
                "maîtresse de son plan.",

            duration: 10500,

            audio: "assets/sounds/prologue/scene11.mp3"
        },

        {

            title: "PONAN'S LEGACY",

            text:
                "L'histoire commence maintenant.",

            duration: 8500,

            audio: "assets/sounds/prologue/scene12.mp3"
        }

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

	this.createParticles();

        this.stopAudio();

        this.playAudio();

    },


    update(dt) {

        if (!this.active)
            return;

	this.visualTime += dt;

	this.updateVisuals(dt);

        const current =
            this.scenes[this.scene];

        if (!current)
            return;


        /*
         * FADE
         */

        if (this.fadeDirection !== 0) {

            this.fade +=
                this.fadeDirection *
                dt *
                1.8;

            if (this.fade <= 0) {

                this.fade = 0;

                this.fadeDirection = 0;

            }

            if (this.fade >= 1) {

                this.fade = 1;

                this.fadeDirection = 0;

            }

        }


        /*
         * TEXTE PROGRESSIF
         */

        if (!this.finishedText) {

            this.timer += dt * 1000;

            const characters =
                Math.floor(
                    this.timer /
                    this.textSpeed
                );

            this.textIndex =
                Math.min(
                    characters,
                    current.text.length
                );

            if (
                this.textIndex >=
                current.text.length
            ) {

                this.finishedText = true;

                this.timer = 0;

            }

            return;

        }


        /*
         * TEMPS APRÈS LA FIN DU TEXTE
         */

        this.timer += dt * 1000;

        if (
            this.timer >=
            current.duration
        ) {

            this.next();

        }

    },


    next() {

        if (!this.active)
            return;


        /*
         * Si le texte n'est pas terminé,
         * Espace le termine.
         */

        if (!this.finishedText) {

            const current =
                this.scenes[this.scene];

            this.textIndex =
                current.text.length;

            this.finishedText = true;

            this.timer = 0;

            return;

        }


        /*
         * Scène suivante
         */

        this.scene++;

        this.timer = 0;

        this.textIndex = 0;

        this.finishedText = false;

        this.fade = 1;

        this.fadeDirection = -1;

        this.stopAudio();

        if (
            this.scene >=
            this.scenes.length
        ) {

            this.finish();

            return;

        }

        this.playAudio();

    },


    finish() {

        this.stopAudio();

        this.active = false;

        this.scene = 0;

        this.timer = 0;

        this.textIndex = 0;

        this.finishedText = false;

        this.fade = 0;

        /*
         * Retour au gameplay
         */

        Game.running = true;

    },


    /*
     * ================================
     * AUDIO / NARRATEUR
     * ================================
     */

    playAudio() {

        if (this.muted)
            return;

        const current =
            this.scenes[this.scene];

        if (
            !current ||
            !current.audio
        )
            return;

        const audio =
            new Audio(current.audio);

        audio.volume = 0.9;

        audio.play()
            .catch(() => {

                /*
                 * Le navigateur peut bloquer
                 * l'audio automatique.
                 *
                 * Ce n'est pas bloquant :
                 * la cinématique continue.
                 */

            });

        this.currentAudio = audio;

    },


    stopAudio() {

        if (!this.currentAudio)
            return;

        this.currentAudio.pause();

        this.currentAudio.currentTime = 0;

        this.currentAudio = null;

    },


    toggleMute() {

        this.muted = !this.muted;

        if (this.muted) {

            this.stopAudio();

        } else {

            this.playAudio();

        }

    },


    /*
     * ================================
     * AFFICHAGE
     * ================================
     */


createParticles() {

    this.particles = [];

    for (let i = 0; i < 80; i++) {

        this.particles.push({

            x: Math.random(),
            y: Math.random(),

            speed:
                0.01 +
                Math.random() * 0.03,

            size:
                1 +
                Math.random() * 2

        });

    }

},


updateVisuals(dt) {

    if (
        this.scenes[this.scene]?.visual !==
        "kingdom"
    )
        return;

    /*
     * Nuages
     */

    this.clouds.forEach(cloud => {

        cloud.x +=
            cloud.speed * dt;

        if (
            cloud.x >
            Game.canvas.width + 250
        ) {

            cloud.x = -300;

        }

    });


    /*
     * Particules
     */

    this.particles.forEach(particle => {

        particle.y +=
            particle.speed * dt;

        particle.x +=
            0.002 * dt;

        if (particle.y > 1)
            particle.y = 0;

        if (particle.x > 1)
            particle.x = 0;

    });

},


drawThroneRoom() {

    const ctx = Game.ctx;

    const width = Game.canvas.width;
    const height = Game.canvas.height;

    /*
     * ============================
     * CAMERA CINÉMATIQUE
     * ============================
     */

    const zoom = Math.min(
        1.12,
        1 + this.visualTime * 0.008
    );

    ctx.save();

    ctx.translate(
        width / 2,
        height / 2
    );

    ctx.scale(
        zoom,
        zoom
    );

    ctx.translate(
        -width / 2,
        -height / 2
    );


    /*
     * ============================
     * FOND
     * ============================
     */

    ctx.fillStyle = "#070b14";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
     * ============================
     * MURS
     * ============================
     */

    ctx.fillStyle = "#151c29";

    ctx.fillRect(
        0,
        0,
        width,
        height * 0.78
    );


    /*
     * PIERRES
     */

    ctx.strokeStyle =
        "rgba(60,75,95,.45)";

    ctx.lineWidth = 2;

    const stoneSize = 70;

    for (
        let y = 0;
        y < height * 0.78;
        y += stoneSize
    ) {

        for (
            let x = 0;
            x < width;
            x += stoneSize
        ) {

            const offset =
                (Math.floor(y / stoneSize) % 2)
                    * 35;

            ctx.strokeRect(
                x - offset,
                y,
                stoneSize,
                stoneSize
            );

        }

    }


    /*
     * ============================
     * GRANDES ARCHES
     * ============================
     */

    ctx.strokeStyle = "#303b4d";

    ctx.lineWidth = 12;

    const arches = [
        width * .15,
        width * .50,
        width * .85
    ];

    arches.forEach(x => {

        ctx.beginPath();

        ctx.moveTo(
            x - 110,
            height * .58
        );

        ctx.lineTo(
            x - 110,
            height * .20
        );

        ctx.quadraticCurveTo(
            x,
            height * .03,
            x + 110,
            height * .20
        );

        ctx.lineTo(
            x + 110,
            height * .58
        );

        ctx.stroke();

    });


    /*
     * ============================
     * FENÊTRES
     * ============================
     */

    this.drawThroneWindow(
        width * .18,
        height * .15
    );

    this.drawThroneWindow(
        width * .82,
        height * .15
    );


    /*
     * ============================
     * TAPIS
     * ============================
     */

    ctx.fillStyle = "#641d26";

    ctx.beginPath();

    ctx.moveTo(
        width * .42,
        height * .48
    );

    ctx.lineTo(
        width * .58,
        height * .48
    );

    ctx.lineTo(
        width * .75,
        height
    );

    ctx.lineTo(
        width * .25,
        height
    );

    ctx.closePath();

    ctx.fill();


    /*
     * BORDURE DU TAPIS
     */

    ctx.strokeStyle = "#c29a38";

    ctx.lineWidth = 5;

    ctx.stroke();


    /*
     * ============================
     * TRÔNE
     * ============================
     */

    this.drawThrone(
        width / 2,
        height * .42
    );


    /*
     * ============================
     * PONANINI III
     * ============================
     */

    this.drawDuckKing(
        width / 2,
        height * .36
    );


    /*
     * ============================
     * GARDES
     * ============================
     */

    this.drawGuard(
        width * .25,
        height * .58
    );

    this.drawGuard(
        width * .75,
        height * .58
    );


    /*
     * ============================
     * TORCHES
     * ============================
     */

    this.drawTorch(
        width * .08,
        height * .55
    );

    this.drawTorch(
        width * .92,
        height * .55
    );


    /*
     * ============================
     * LUMIÈRE
     * ============================
     */

    const light =
        ctx.createRadialGradient(
            width / 2,
            height * .35,
            30,
            width / 2,
            height * .35,
            width * .65
        );

    light.addColorStop(
        0,
        "rgba(220,175,70,.13)"
    );

    light.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle = light;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    ctx.restore();

},

drawThroneWindow(x, y) {

    const ctx = Game.ctx;

    ctx.fillStyle = "#050914";

    ctx.fillRect(
        x - 45,
        y,
        90,
        220
    );

    ctx.strokeStyle = "#9d7a32";

    ctx.lineWidth = 5;

    ctx.strokeRect(
        x - 45,
        y,
        90,
        220
    );

    /*
     * lumière extérieure
     */

    ctx.fillStyle =
        "rgba(50,100,180,.25)";

    ctx.fillRect(
        x - 38,
        y + 8,
        76,
        204
    );

    /*
     * vitraux
     */

    ctx.strokeStyle =
        "rgba(190,160,70,.5)";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 220);

    ctx.moveTo(
        x - 45,
        y + 75
    );

    ctx.lineTo(
        x + 45,
        y + 75
    );

    ctx.moveTo(
        x - 45,
        y + 150
    );

    ctx.lineTo(
        x + 45,
        y + 150
    );

    ctx.stroke();

},


drawThrone(x, y) {

    const ctx = Game.ctx;

    /*
     * dossier
     */

    ctx.fillStyle = "#5a4520";

    ctx.fillRect(
        x - 85,
        y - 100,
        170,
        150
    );

    /*
     * intérieur
     */

    ctx.fillStyle = "#571c27";

    ctx.fillRect(
        x - 65,
        y - 82,
        130,
        115
    );

    /*
     * accoudoirs
     */

    ctx.fillStyle = "#9d772b";

    ctx.fillRect(
        x - 100,
        y + 15,
        35,
        25
    );

    ctx.fillRect(
        x + 65,
        y + 15,
        35,
        25
    );

    /*
     * base
     */

    ctx.fillRect(
        x - 105,
        y + 35,
        210,
        25
    );

    /*
     * emblème du royaume
     */

    ctx.fillStyle = "#e1b83d";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 30,
        18,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#571c27";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 30,
        12,
        0,
        Math.PI * 2
    );

    ctx.fill();

},


drawDuckKing(x, y) {

    const ctx = Game.ctx;

    /*
     * CAPE
     */

    ctx.fillStyle = "#17131a";

    ctx.beginPath();

    ctx.moveTo(
        x - 58,
        y + 30
    );

    ctx.lineTo(
        x + 58,
        y + 30
    );

    ctx.lineTo(
        x + 75,
        y + 125
    );

    ctx.lineTo(
        x - 75,
        y + 125
    );

    ctx.closePath();

    ctx.fill();


    /*
     * CORPS
     */

    ctx.fillStyle = "#202936";

    ctx.fillRect(
        x - 42,
        y + 35,
        84,
        85
    );


    /*
     * TÊTE DU CANARD
     */

    ctx.fillStyle = "#d7b94b";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        43,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
     * PLUMAGE SOMBRE
     */

    ctx.fillStyle = "#1a1c22";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 8,
        39,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /*
     * YEUX
     */

    ctx.fillStyle = "#f4e7b1";

    ctx.fillRect(
        x - 22,
        y - 5,
        12,
        9
    );

    ctx.fillRect(
        x + 10,
        y - 5,
        12,
        9
    );


    /*
     * PUPILLES
     */

    ctx.fillStyle = "#090909";

    ctx.fillRect(
        x - 17,
        y - 3,
        5,
        7
    );

    ctx.fillRect(
        x + 15,
        y - 3,
        5,
        7
    );


    /*
     * BEC
     */

    ctx.fillStyle = "#d68b25";

    ctx.beginPath();

    ctx.moveTo(
        x - 25,
        y + 10
    );

    ctx.lineTo(
        x,
        y + 27
    );

    ctx.lineTo(
        x + 25,
        y + 10
    );

    ctx.closePath();

    ctx.fill();


    /*
     * COURONNE
     */

    ctx.fillStyle = "#d8aa2d";

    ctx.beginPath();

    ctx.moveTo(
        x - 40,
        y - 38
    );

    ctx.lineTo(
        x - 25,
        y - 75
    );

    ctx.lineTo(
        x - 8,
        y - 48
    );

    ctx.lineTo(
        x + 5,
        y - 78
    );

    ctx.lineTo(
        x + 20,
        y - 48
    );

    ctx.lineTo(
        x + 40,
        y - 70
    );

    ctx.lineTo(
        x + 38,
        y - 30
    );

    ctx.closePath();

    ctx.fill();


    /*
     * GEMME ROUGE
     */

    ctx.fillStyle = "#a83232";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 51,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
     * COLLIER
     */

    ctx.strokeStyle = "#d8aa2d";

    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.arc(
        x,
        y + 32,
        35,
        0,
        Math.PI
    );

    ctx.stroke();


    /*
     * GEMME DU COLLIER
     */

    ctx.fillStyle = "#9d2933";

    ctx.beginPath();

    ctx.moveTo(
        x,
        y + 35
    );

    ctx.lineTo(
        x + 9,
        y + 48
    );

    ctx.lineTo(
        x,
        y + 61
    );

    ctx.lineTo(
        x - 9,
        y + 48
    );

    ctx.closePath();

    ctx.fill();

},


drawGuard(x, y) {

    const ctx = Game.ctx;

    /*
     * silhouette
     */

    ctx.fillStyle = "#090c12";

    ctx.fillRect(
        x - 20,
        y,
        40,
        90
    );


    /*
     * casque
     */

    ctx.fillStyle = "#303949";

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
     * visière
     */

    ctx.fillStyle = "#080a0d";

    ctx.fillRect(
        x - 20,
        y - 5,
        40,
        10
    );


    /*
     * lance
     */

    ctx.strokeStyle = "#81785d";

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(
        x + 30,
        y + 90
    );

    ctx.lineTo(
        x + 30,
        y - 55
    );

    ctx.stroke();


    /*
     * pointe
     */

    ctx.fillStyle = "#c7b98b";

    ctx.beginPath();

    ctx.moveTo(
        x + 30,
        y - 70
    );

    ctx.lineTo(
        x + 23,
        y - 52
    );

    ctx.lineTo(
        x + 37,
        y - 52
    );

    ctx.closePath();

    ctx.fill();

},


drawTorch(x, y) {

    const ctx = Game.ctx;

    const flicker =
        Math.sin(
            Date.now() / 100
        ) * 4;


    /*
     * support
     */

    ctx.fillStyle = "#4b3320";

    ctx.fillRect(
        x - 6,
        y,
        12,
        70
    );


    /*
     * halo
     */

    const glow =
        ctx.createRadialGradient(
            x,
            y - 10,
            5,
            x,
            y - 10,
            100
        );

    glow.addColorStop(
        0,
        "rgba(255,180,40,.25)"
    );

    glow.addColorStop(
        1,
        "rgba(255,120,20,0)"
    );

    ctx.fillStyle = glow;

    ctx.fillRect(
        x - 100,
        y - 110,
        200,
        200
    );


    /*
     * flamme
     */

    ctx.fillStyle = "#f0a42a";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 12 + flicker,
        15,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#ffe28a";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 15 + flicker,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();

},

drawKingdom() {

    const ctx = Game.ctx;

    const width = Game.canvas.width;
    const height = Game.canvas.height;

    /*
     * ============================
     * CIEL
     * ============================
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
        "#02030a"
    );

    sky.addColorStop(
        0.55,
        "#07152b"
    );

    sky.addColorStop(
        1,
        "#10284a"
    );

    ctx.fillStyle = sky;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
     * ============================
     * LUNE
     * ============================
     */

    ctx.beginPath();

    ctx.arc(
        width * 0.78,
        height * 0.20,
        55,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(245,220,150,.95)";

    ctx.fill();


    /*
     * Halo lunaire
     */

    const moonGlow =
        ctx.createRadialGradient(
            width * 0.78,
            height * 0.20,
            30,
            width * 0.78,
            height * 0.20,
            180
        );

    moonGlow.addColorStop(
        0,
        "rgba(245,220,150,.18)"
    );

    moonGlow.addColorStop(
        1,
        "rgba(245,220,150,0)"
    );

    ctx.fillStyle =
        moonGlow;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
     * ============================
     * NUAGES
     * ============================
     */

    ctx.fillStyle =
        "rgba(10,20,35,.8)";

    this.clouds.forEach(cloud => {

        ctx.beginPath();

        ctx.ellipse(
            cloud.x,
            cloud.y,
            100 * cloud.size,
            30 * cloud.size,
            0,
            0,
            Math.PI * 2
        );

        ctx.ellipse(
            cloud.x + 70 * cloud.size,
            cloud.y - 15 * cloud.size,
            80 * cloud.size,
            35 * cloud.size,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

    });


    /*
     * ============================
     * MONTAGNES
     * ============================
     */

    ctx.fillStyle =
        "#081323";

    ctx.beginPath();

    ctx.moveTo(0, height * .62);

    ctx.lineTo(
        width * .18,
        height * .38
    );

    ctx.lineTo(
        width * .32,
        height * .62
    );

    ctx.lineTo(
        width * .50,
        height * .35
    );

    ctx.lineTo(
        width * .72,
        height * .62
    );

    ctx.lineTo(
        width * .88,
        height * .42
    );

    ctx.lineTo(
        width,
        height * .62
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
     * ============================
     * VILLAGE
     * ============================
     */

    const villageY =
        height * .67;

    ctx.fillStyle =
        "#101820";

    for (
        let i = 0;
        i < 13;
        i++
    ) {

        const x =
            i *
            (width / 12);

        const houseWidth =
            55 + (i % 3) * 15;

        const houseHeight =
            45 + (i % 2) * 25;

        ctx.fillRect(
            x,
            villageY - houseHeight,
            houseWidth,
            houseHeight
        );


        /*
         * Toit
         */

        ctx.beginPath();

        ctx.moveTo(
            x - 10,
            villageY - houseHeight
        );

        ctx.lineTo(
            x + houseWidth / 2,
            villageY - houseHeight - 35
        );

        ctx.lineTo(
            x + houseWidth + 10,
            villageY - houseHeight
        );

        ctx.closePath();

        ctx.fillStyle =
            "#080c12";

        ctx.fill();


        /*
         * Fenêtres
         */

        ctx.fillStyle =
            "rgba(231,181,65,.75)";

        ctx.fillRect(
            x + houseWidth * .3,
            villageY - houseHeight + 15,
            8,
            10
        );

    }


    /*
     * ============================
     * CHÂTEAU
     * ============================
     */

    const castleX =
        width * .50;

    const castleY =
        height * .66;

    /*
     * Corps
     */

    ctx.fillStyle =
        "#121923";

    ctx.fillRect(
        castleX - 150,
        castleY - 170,
        300,
        170
    );


    /*
     * Tours
     */

    const towers = [
        castleX - 155,
        castleX + 105
    ];

    towers.forEach(x => {

        ctx.fillRect(
            x,
            castleY - 230,
            50,
            230
        );

        /*
         * Toit
         */

        ctx.beginPath();

        ctx.moveTo(
            x - 10,
            castleY - 230
        );

        ctx.lineTo(
            x + 25,
            castleY - 275
        );

        ctx.lineTo(
            x + 60,
            castleY - 230
        );

        ctx.closePath();

        ctx.fillStyle =
            "#070b12";

        ctx.fill();

    });


    /*
     * Porte
     */

    ctx.fillStyle =
        "#05070a";

    ctx.fillRect(
        castleX - 30,
        castleY - 85,
        60,
        85
    );


    /*
     * Fenêtres du château
     */

    ctx.fillStyle =
        "#d8a72e";

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        ctx.fillRect(
            castleX - 105 + i * 52,
            castleY - 130,
            12,
            20
        );

    }


    /*
     * Lumière du château
     */

    const castleGlow =
        ctx.createRadialGradient(
            castleX,
            castleY - 100,
            20,
            castleX,
            castleY - 100,
            300
        );

    castleGlow.addColorStop(
        0,
        "rgba(216,167,46,.12)"
    );

    castleGlow.addColorStop(
        1,
        "rgba(216,167,46,0)"
    );

    ctx.fillStyle =
        castleGlow;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
     * ============================
     * PREMIER PLAN
     * ============================
     */

    ctx.fillStyle =
        "#030507";

    ctx.fillRect(
        0,
        height * .78,
        width,
        height * .22
    );


    /*
     * ============================
     * PARTICULES
     * ============================
     */

    ctx.fillStyle =
        "rgba(216,167,46,.35)";

    this.particles.forEach(particle => {

        ctx.beginPath();

        ctx.arc(
            particle.x * width,
            particle.y * height,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

    });

},

    draw() {

        const ctx =
            Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        /*
         * FOND
         */

        ctx.fillStyle =
            "#020307";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * HALO CENTRAL
         */

        const gradient =
            ctx.createRadialGradient(
                width / 2,
                height / 2,
                20,
                width / 2,
                height / 2,
                width * 0.7
            );

        gradient.addColorStop(
            0,
            "rgba(20,40,80,.35)"
        );

        gradient.addColorStop(
            0.5,
            "rgba(8,15,30,.15)"
        );

        gradient.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        const current =
            this.scenes[this.scene];

if (current.visual === "kingdom") {

    this.drawKingdom();

} else if (current.visual === "throne") {

    this.drawThroneRoom();

} else {

    ctx.fillStyle = "#020307";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );

}

        if (!current)
            return;


        /*
         * TITRE
         */

        ctx.textAlign =
            "center";

        ctx.fillStyle =
            "#d8a72e";

        ctx.font =
            "bold 44px Georgia";

        ctx.fillText(
            current.title,
            width / 2,
            height / 2 - 105
        );


        /*
         * LIGNE DÉCORATIVE
         */

        ctx.fillStyle =
            "rgba(216,167,46,.45)";

        ctx.fillRect(
            width / 2 - 120,
            height / 2 - 78,
            240,
            2
        );


        /*
         * TEXTE ACTUEL
         */

        const visibleText =
            current.text.substring(
                0,
                this.textIndex
            );


        const lines =
            this.wrapText(
                visibleText,
                width * 0.62
            );


        ctx.fillStyle =
            "#eeeeee";

        ctx.font =
            "25px Georgia";


        lines.forEach(
            (line, index) => {

                ctx.fillText(
                    line,
                    width / 2,
                    height / 2 +
                    index * 38
                );

            }
        );


        /*
         * CURSEUR DE TEXTE
         */

        if (
            !this.finishedText &&
            Math.floor(
                Date.now() / 400
            ) % 2 === 0
        ) {

            const lastLine =
                lines.length > 0
                    ? lines[lines.length - 1]
                    : "";

            const textWidth =
                ctx.measureText(
                    lastLine
                ).width;

            ctx.fillStyle =
                "#d8a72e";

            ctx.fillRect(
                width / 2 +
                textWidth / 2 +
                5,
                height / 2 +
                (lines.length - 1) * 38 -
                24,
                3,
                28
            );

        }


        /*
         * PROGRESSION
         */

        const progress =
            Math.min(
                this.timer /
                current.duration,
                1
            );


        ctx.fillStyle =
            "rgba(255,255,255,.12)";

        ctx.fillRect(
            width * .20,
            height - 60,
            width * .60,
            3
        );


        ctx.fillStyle =
            "#d8a72e";

        ctx.fillRect(
            width * .20,
            height - 60,
            width * .60 * progress,
            3
        );


        /*
         * INDICATION
         */

        ctx.fillStyle =
            "rgba(255,255,255,.45)";

        ctx.font =
            "15px Arial";


        if (this.finishedText) {

            ctx.fillText(
                "ESPACE  •  continuer",
                width / 2,
                height - 30
            );

        } else {

            ctx.fillText(
                "ESPACE  •  afficher le texte",
                width / 2,
                height - 30
            );

        }


        /*
         * SON
         */

        ctx.textAlign =
            "right";

        ctx.fillStyle =
            "rgba(255,255,255,.4)";

        ctx.font =
            "14px Arial";

        ctx.fillText(
            this.muted
                ? "🔇 M : son désactivé"
                : "🔊 M : couper le son",
            width - 25,
            30
        );


        /*
         * FADE
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

    },


    /*
     * ================================
     * RETOUR À LA LIGNE
     * ================================
     */

    wrapText(text, maxWidth) {

        const ctx =
            Game.ctx;

        const words =
            text.split(" ");

        const lines = [];

        let line = "";


        words.forEach(word => {

            const test =
                line === ""
                    ? word
                    : line + " " + word;


            if (
                ctx.measureText(test)
                    .width > maxWidth
            ) {

                if (line)
                    lines.push(line);

                line = word;

            } else {

                line = test;

            }

        });


        if (line)
            lines.push(line);


        return lines;

    }

};


/*
 * ==========================================
 * CONTRÔLES CINÉMATIQUE
 * ==========================================
 */

window.addEventListener(
    "keydown",
    event => {

        if (!Prologue.active)
            return;


        /*
         * ESPACE
         */

        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            Prologue.next();

        }


        /*
         * M = MUTE
         */

        if (
            event.key.toLowerCase() === "m"
        ) {

            Prologue.toggleMute();

        }

    }
);
