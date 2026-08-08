const Prologue = {

    active: false,

    scene: 0,

    timer: 0,

    textTimer: 0,

    waiting: false,

    scenes: [

        {
            duration: 5000,

            title: "IL ÉTAIT UNE FOIS...",

            text:
                "Il existe des royaumes dont l'histoire " +
                "est écrite par les vainqueurs."
        },

        {

            duration: 5000,

            title: "LE ROYAUME DE PONAN",

            text:
                "Pendant des générations, le royaume " +
                "des canards connut la paix sous la " +
                "dynastie des Plumes Dorées."
        },

        {

            duration: 5000,

            title: "PONANINI III",

            text:
                "Ponanini III était alors le roi légitime. " +
                "Aimé de son peuple, il semblait destiné " +
                "à régner pendant de longues années."
        },

        {

            duration: 5000,

            title: "LA TRAHISON",

            text:
                "Mais un jour, il fut accusé d'un crime " +
                "qu'il n'avait pas commis."
        },

        {

            duration: 5000,

            title: "PONANINI IV",

            text:
                "Son propre héritier, Ponanini IV, " +
                "prit alors sa place sur le trône."
        },

        {

            duration: 5000,

            title: "L'EXIL",

            text:
                "Ponanini III fut condamné à un destin " +
                "dont personne ne devait revenir."
        },

        {

            duration: 5000,

            title: "LE NETHER",

            text:
                "Il fut envoyé dans une dimension oubliée " +
                "des hommes et des canards."
        },

        {

            duration: 5000,

            title: "...DES ANNÉES PASSÈRENT.",

            text:
                "Mais dans les ténèbres, l'ancien roi " +
                "n'avait pas oublié."
        },

        {

            duration: 5000,

            title: "LES TROIS FRAGMENTS",

            text:
                "Il découvrit l'existence de trois fragments " +
                "capables d'ouvrir la porte entre les mondes."
        },

        {

            duration: 5000,

            title: "LA VENGEANCE",

            text:
                "Il lui fallait seulement quelqu'un capable " +
                "de les retrouver."
        },

        {

            duration: 5000,

            title: "ET QUELQU'UN ARRIVA.",

            text:
                "Quelqu'un qui ignorait encore qu'il était " +
                "déjà devenu une pièce de son plan."
        },

        {

            duration: 5000,

            title: "PONAN'S LEGACY",

            text:
                "L'histoire commence maintenant."
        }

    ],

    start() {

        this.active = true;

        this.scene = 0;

        this.timer = 0;

        this.textTimer = 0;

        this.waiting = false;

    },

    update(dt) {

        if (!this.active)
            return;

        this.timer += dt * 1000;

        const current = this.scenes[this.scene];

        if (!current)
            return;

        if (this.timer >= current.duration) {

            this.next();

        }

    },

    next() {

        this.scene++;

        this.timer = 0;

        this.textTimer = 0;

        if (this.scene >= this.scenes.length) {

            this.finish();

        }

    },

    skip() {

        if (!this.active)
            return;

        this.next();

    },

    finish() {

        this.active = false;

        this.scene = 0;

        Game.running = true;

    },

    draw() {

        if (!this.active)
            return;

        const ctx = Game.ctx;

        const width = Game.canvas.width;
        const height = Game.canvas.height;

        /*
         * Fond noir / bleu très sombre
         */

        ctx.fillStyle = "#05070d";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );

        /*
         * Lumière centrale
         */

        const gradient =
            ctx.createRadialGradient(
                width / 2,
                height / 2,
                50,
                width / 2,
                height / 2,
                width * 0.7
            );

        gradient.addColorStop(
            0,
            "rgba(20,35,65,0.45)"
        );

        gradient.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );

        const scene = this.scenes[this.scene];

        if (!scene)
            return;

        /*
         * Titre
         */

        ctx.textAlign = "center";

        ctx.fillStyle = "#d9a441";

        ctx.font =
            "bold 42px Georgia";

        ctx.fillText(
            scene.title,
            width / 2,
            height / 2 - 80
        );

        /*
         * Texte
         */

        ctx.fillStyle = "#eeeeee";

        ctx.font =
            "24px Georgia";

        const lines =
            this.wrapText(
                ctx,
                scene.text,
                width * 0.65
            );

        lines.forEach((line, index) => {

            ctx.fillText(
                line,
                width / 2,
                height / 2 +
                index * 36
            );

        });

        /*
         * Indication
         */

        ctx.fillStyle =
            "rgba(255,255,255,0.6)";

        ctx.font =
            "16px Arial";

        ctx.fillText(
            "ESPACE  •  Passer",
            width / 2,
            height - 40
        );

    },

    wrapText(ctx, text, maxWidth) {

        const words = text.split(" ");

        const lines = [];

        let line = "";

        words.forEach(word => {

            const test =
                line +
                (line ? " " : "") +
                word;

            if (
                ctx.measureText(test).width >
                maxWidth
            ) {

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

window.addEventListener(
    "keydown",
    event => {

        if (
            event.code === "Space" &&
            Prologue.active
        ) {

            event.preventDefault();

            Prologue.skip();

        }

    }
);
