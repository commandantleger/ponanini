const quests = {

    /*
    =====================================================
    QUÊTE 1
    =====================================================
    */

    intro: {

        name: "Un monde étranger",

        description:
            "Trouver quelqu'un capable de t'expliquer où tu es.",

        completed: false
    },


    /*
    =====================================================
    QUÊTE 2
    =====================================================
    */

    village: {

        name: "Le royaume de Ponan",

        description:
            "Enquêter sur le royaume et découvrir ce qui s'est passé.",

        objectives: {

            oldman: false,

            mila: false,

            guard: false

        },

        completed: false
    },


    /*
    =====================================================
    QUÊTE 3
    =====================================================
    */

    king: {

        name: "Le roi",

        description:
            "Rencontrer Ponanini IV et découvrir qui dirige réellement Ponan.",

        completed: false
    },


    /*
    =====================================================
    QUÊTE 4
    =====================================================
    */

    secrets: {

        name: "Les secrets de Ponan",

        description:
            "Quelque chose ne semble pas normal dans l'histoire du royaume.",

        completed: false
    }

};


let questStage = 0;


/*
=========================================================
MISE À JOUR DE LA QUÊTE
=========================================================
*/

function updateQuest() {

    const quest =
        document.getElementById("quest");

    if (!quest)
        return;


    /*
    =====================================================
    QUÊTE 1
    =====================================================
    */

    if (questStage === 0) {

        quest.innerHTML =
            "📜 " +
            quests.intro.name +
            "<br><small>" +
            quests.intro.description +
            "</small>";

        return;
    }


    /*
    =====================================================
    QUÊTE 2
    =====================================================
    */

    if (questStage === 1) {

        const objectives =
            quests.village.objectives;


        let text =
            "📜 " +
            quests.village.name +
            "<br><br>";


        text +=
            objectives.mila
                ? "✓ Parler à Mila"
                : "□ Parler à Mila";


        text += "<br>";


        text +=
            objectives.guard
                ? "✓ Interroger le garde royal"
                : "□ Interroger le garde royal";


        text += "<br>";


        text +=
            objectives.oldman
                ? "✓ Découvrir ce que sait l'Ancien"
                : "□ Découvrir ce que sait l'Ancien";


        quest.innerHTML =
            text;

        return;
    }


    /*
    =====================================================
    QUÊTE 3
    =====================================================
    */

    if (questStage === 2) {

        quest.innerHTML =
            "👑 " +
            quests.king.name +
            "<br><small>" +
            quests.king.description +
            "</small>";

        return;
    }


    /*
    =====================================================
    QUÊTE 4
    =====================================================
    */

    if (questStage >= 3) {

        quest.innerHTML =
            "❓ " +
            quests.secrets.name +
            "<br><small>" +
            quests.secrets.description +
            "</small>";
    }
}


/*
=========================================================
VALIDATION D'UN OBJECTIF
=========================================================
*/

function completeObjective(
    objective
) {

    if (questStage !== 1)
        return;


    if (
        !quests.village.objectives
            .hasOwnProperty(objective)
    )
        return;


    quests.village.objectives[
        objective
    ] = true;


    checkVillageQuest();

    updateQuest();
}


/*
=========================================================
VÉRIFIER LA QUÊTE DU VILLAGE
=========================================================
*/

function checkVillageQuest() {

    const objectives =
        quests.village.objectives;


    if (
        objectives.oldman &&
        objectives.mila &&
        objectives.guard
    ) {

        quests.village.completed =
            true;


        questStage = 2;

        updateQuest();
    }
}


/*
=========================================================
AVANCER DANS LA QUÊTE
=========================================================
*/

function advanceQuest(stage) {

    if (
        stage <= questStage
    )
        return;


    questStage =
        stage;


    updateQuest();
}


/*
=========================================================
RÉINITIALISER LA QUÊTE
=========================================================
*/

function resetQuests() {

    questStage = 0;


    quests.intro.completed =
        false;

    quests.village.completed =
        false;

    quests.king.completed =
        false;

    quests.secrets.completed =
        false;


    quests.village.objectives.oldman =
        false;

    quests.village.objectives.mila =
        false;

    quests.village.objectives.guard =
        false;


    updateQuest();
}
