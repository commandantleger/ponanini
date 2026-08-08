const Prologue = {

    active: false,

    scene: 0,

    timer: 0,

    scenes: [

        {
            title: "PONAN'S LEGACY",

            text:
                "Il était une fois un royaume " +
                "où les canards régnaient sur les canards."
        },

        {
            title: "PONANINI III",

            text:
                "Ponanini III était le roi légitime " +
                "du royaume de Ponan."
        },

        {
            title: "LA TRAHISON",

            text:
                "Mais il fut accusé d'un crime " +
                "qu'il n'avait jamais commis."
        },

        {
            title: "PONANINI IV",

            text:
                "Son successeur prit alors le trône " +
                "et fit condamner son prédécesseur."
        },

        {
            title: "LE NETHER",

            text:
                "Ponanini III fut envoyé dans une " +
                "dimension dont personne ne revenait."
        },

        {
            title: "DES ANNÉES PASSÈRENT",

            text:
                "Mais dans les ténèbres, l'ancien roi " +
                "n'oublia jamais ce qui lui avait été fait."
        },

        {
            title: "LES TROIS FRAGMENTS",

            text:
                "Il découvrit trois fragments capables " +
                "d'ouvrir la porte entre les mondes."
        },

        {
            title: "LA VENGEANCE",

            text:
                "Il avait besoin de quelqu'un dans le " +
                "monde réel pour les retrouver."
        },

        {
            title: "VOUS",

            text:
                "Et sans le savoir, vous êtes devenu " +
                "la pièce maîtresse de son plan."
        },

        {
            title: "PONAN'S LEGACY",

            text:
                "L'histoire commence maintenant."
        }

    ],


    start() {

        this.active = true;

        this.scene = 0;

        this.timer = 0;

    },


    update(dt) {

        if (!this.active)
            return;

        this.timer += dt * 1000;

        if (this.timer >= 4500) {

            this.next();

        }

    },


    next() {

        this.scene++;

        this.timer = 0;

        if (
            this.scene >=
            this.scenes.length
        ) {

            this.finish();

        }

    },


    finish() {

        this.active = false;

        this.scene = 0;

        this.timer = 0;

        Game.running = true;

    },


    draw() {

        const ctx = Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        /* Fond */

        ctx.fillStyle = "#03050a";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /* Lumière */

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


        const scene =
            this.scenes[this.scene];

        if (!scene)
            return;


        /* Titre */

        ctx.textAlign = "center";

        ctx.fillStyle = "#d8a72e";

        ctx.font =
            "bold 46px Georgia";

        ctx.fillText(
            scene.title,
            width / 2,
            height / 2 - 90
        );


        /* Texte */

        ctx.fillStyle = "#ffffff";

        ctx.font =
            "25px Georgia";

        const lines =
            this.wrapText(
                scene.text,
                width * .65
            );

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


        /* Progression */

        const progress =
            this.timer / 4500;

        ctx.fillStyle =
            "rgba(255,255,255,.15)";

        ctx.fillRect(
            width * .2,
            height - 55,
            width * .6,
            4
        );

        ctx.fillStyle = "#d8a72e";

        ctx.fillRect(
            width * .2,
            height - 55,
            width * .6 * progress,
            4
        );


        /* Instruction */

        ctx.fillStyle =
            "rgba(255,255,255,.5)";

        ctx.font =
            "16px Arial";

        ctx.fillText(
            "ESPACE  •  passer",
            width / 2,
            height - 25
        );

    },


    wrapText(text, maxWidth) {

        const ctx = Game.ctx;

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

            Prologue.next();

        }

    }
);
