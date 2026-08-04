/*=====================================================
 Alex CARIBOU Karaoké V2.1
 Configuration générale
======================================================*/

const CONFIG = {

    /* ******************************
       APPLICATION
    ****************************** */

    appName: "Alex CARIBOU Karaoké",

    version: "2.1",

    theme: "dark",

    songsPerPage: 24,

    language: "fr",

    /* ******************************
       OPTIONS
    ****************************** */

    enableFavorites: true,

    enableSuggestions: true,

    enableFuzzySearch: true,

    enablePagination: true,

    enableAnimations: true,

    /* ******************************
       LANGUES
    ****************************** */

    allowedLanguages: [

        "French",
        "English",
        "Spanish",
        "Italian",
        "German",
        "Japanese",
        "Chinese",
        "Korean",
        "Portuguese",
        "Dutch"

    ],

    hiddenLanguages: [

        "Arabic",
        "Romanian",
        "Turkish",
        "Finnish"

    ],

    /* ******************************
       DRAPEAUX
    ****************************** */

    flags: {

        "French":"🇫🇷",
        "English":"🇬🇧",
        "Spanish":"🇪🇸",
        "Italian":"🇮🇹",
        "German":"🇩🇪",
        "Portuguese":"🇵🇹",
        "Dutch":"🇳🇱",
        "Japanese":"🇯🇵",
        "Chinese":"🇨🇳",
        "Korean":"🇰🇷"

    },

    /* ******************************
       TRI
    ****************************** */

    defaultSort:"titleAsc",

    sortModes:{

        titleAsc:"Titre A → Z",

        titleDesc:"Titre Z → A",

        artistAsc:"Artiste A → Z",

        artistDesc:"Artiste Z → A",

        yearAsc:"Année ↑",

        yearDesc:"Année ↓"

    },

    /* ******************************
       BADGES
    ****************************** */

    badges:{

        duo:"👥 Duo",

        explicit:"🔞 Explicit",

        favorite:"❤️",

        year:"📅",

        style:"🎵"

    },

    /* ******************************
       COULEURS
    ****************************** */

    colors:{

        primary:"#ff2d55",

        background:"#111111",

        card:"#1b1b1b",

        text:"#ffffff"

    }

};

/*=====================================================
 Fonctions utilitaires
======================================================*/

function getFlag(language){

    return CONFIG.flags[language] || "🌍";

}

function languageAllowed(language){

    return CONFIG.allowedLanguages.includes(language);

}

function languageHidden(language){

    return CONFIG.hiddenLanguages.includes(language);

}

function pageSize(){

    return CONFIG.songsPerPage;

}
