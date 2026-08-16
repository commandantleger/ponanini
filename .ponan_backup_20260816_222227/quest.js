const quests = {
    intro: {
        name: "Un monde étranger",
        description:
            "Trouver quelqu'un capable de t'expliquer où tu es.",
        completed: false,
        objective: false
    },

    village: {
        name: "Les portes de l'Entre-Lac",
        description:
            "Rejoindre Mila et découvrir ce que Ponan cache sur les portails.",
        completed: false,
        objective: false
    },

    king: {
        name: "L'ombre de Ponanini III",
        description:
            "Découvrir ce qui est réellement arrivé à l'ancien roi.",
        completed: false,
        objective: false
    }
};

let questStage = 0;

function updateQuest() {
    const quest =
        document.getElementById("quest");

    if (!quest)
        return;

    if (questStage === 0) {
        quest.innerHTML =
            "📜 <b>" +
            quests.intro.name +
            "</b><br>" +
            "□ Parler à Marek, l'ancien du lac";
        return;
    }

    if (questStage === 1) {
        quest.innerHTML =
            "📜 <b>" +
            quests.village.name +
            "</b><br>" +
            "□ Retrouver Mila dans le village";
        return;
    }

    if (questStage === 2) {
        quest.innerHTML =
            "📜 <b>" +
            quests.king.name +
            "</b><br>" +
            "□ Interroger le garde royal sur Ponanini III";
        return;
    }

    quest.innerHTML =
        "❓ <b>Les secrets de Ponan</b><br>" +
        "Une signature inconnue semble liée à ton arrivée.";
}

function completeObjective(objective) {

    if (
        questStage === 0 &&
        objective === "marek"
    ) {
        quests.intro.objective = true;
        quests.intro.completed = true;
        questStage = 1;

        showQuestMessage(
            "✓ <b>QUÊTE TERMINÉE</b><br>" +
            "Tu sais maintenant où tu es."
        );

        return;
    }

    if (
        questStage === 1 &&
        objective === "mila"
    ) {
        quests.village.objective = true;
        quests.village.completed = true;
        questStage = 2;

        showQuestMessage(
            "✓ <b>NOUVELLE PISTE</b><br>" +
            "Mila t'a parlé de Ponanini III."
        );

        return;
    }

    if (
        questStage === 2 &&
        objective === "guard"
    ) {
        quests.king.objective = true;
        quests.king.completed = true;
        questStage = 3;

        showQuestMessage(
            "✓ <b>INFORMATION OBTENUE</b><br>" +
            "La forêt pourrait contenir la réponse."
        );
    }
}

function showQuestMessage(message) {
    const quest =
        document.getElementById("quest");

    if (!quest)
        return;

    quest.innerHTML = message;

    setTimeout(
        updateQuest,
        2200
    );
}

function advanceQuest(stage) {
    if (stage <= questStage)
        return;

    questStage = stage;
    updateQuest();
}

function resetQuests() {
    questStage = 0;

    quests.intro.completed = false;
    quests.intro.objective = false;

    quests.village.completed = false;
    quests.village.objective = false;

    quests.king.completed = false;
    quests.king.objective = false;

    updateQuest();
}

updateQuest();
