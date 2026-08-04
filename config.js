/*=====================================================
 Alex CARIBOU Karaoké V3.0
 config.js
======================================================*/

"use strict";

const CONFIG = {

    appName: "Alex CARIBOU Karaoké",

    version: "3.0",

    songsPerPage: 50,

    search:{

        minCharacters:2,

        maxSuggestions:8

    },

    storage:{

        favorites:"alex_caribou_favorites"

    },

    flags:{

        "French":"🇫🇷",
        "Français":"🇫🇷",

        "English":"🇬🇧",
        "Anglais":"🇬🇧",

        "Spanish":"🇪🇸",
        "Español":"🇪🇸",

        "Italian":"🇮🇹",
        "Italiano":"🇮🇹",

        "German":"🇩🇪",
        "Deutsch":"🇩🇪",

        "Portuguese":"🇵🇹",

        "Dutch":"🇳🇱",

        "Polish":"🇵🇱",

        "Swedish":"🇸🇪",

        "Norwegian":"🇳🇴",

        "Danish":"🇩🇰",

        "Japanese":"🇯🇵",

        "Russian":"🇷🇺"

    },

    styleTranslations:{

        "Alternative":"Alternative",

        "Blues":"Blues",

        "Christmas":"Noël",

        "Classical":"Classique",

        "Country":"Country",

        "Dance":"Dance",

        "Disco":"Disco",

        "Electro":"Électro",

        "Folk":"Folk",

        "French pop":"Pop française",

        "Funk":"Funk",

        "Gospel":"Gospel",

        "Hard Rock":"Hard Rock",

        "Hip-Hop":"Hip-Hop",

        "Humor":"Humour",

        "Jazz":"Jazz",

        "Kids":"Enfants",

        "Latin Music":"Musique latine",

        "Love":"Amour",

        "Metal":"Metal",

        "Musical":"Comédie musicale",

        "Pop":"Pop",

        "Punk":"Punk",

        "Grunge":"Grunge",

        "R&B":"R&B",

        "Rap":"Rap",

        "Reggae":"Reggae",

        "Rock":"Rock",

        "Rock 'n Roll":"Rock'n Roll",

        "Schlager":"Schlager",

        "Ska":"Ska",

        "Soft rock":"Soft rock",

        "Soul":"Soul",

        "Soundtrack":"Bande originale",

        "Spiritual Music":"Musique spirituelle",

        "Synthpop":"Synthpop",

        "Teen pop":"Pop adolescente",

        "Traditional":"Traditionnel",

        "World/Folk":"Musiques du monde",

        "Zouk":"Zouk",

        "Creole":"Créole",

        "Soca":"Soca",

        "Calypso":"Calypso"

    }

};


/*=====================================================
 Traduction d'un style
=====================================================*/

function translateStyle(style){

    if(!style)

        return "";

    return CONFIG.styleTranslations[style] || style;

}


/*=====================================================
 Drapeau d'une langue
=====================================================*/

function getLanguageFlag(language){

    return CONFIG.flags[language] || "🌍";

}
