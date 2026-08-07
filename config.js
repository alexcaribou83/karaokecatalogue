/* =====================================================
   Alex CARIBOU Karaoké
   config.js
===================================================== */

"use strict";


/* ================================
   Configuration générale
================================ */

const KARAOKE_CONFIG = {


    appName:
        "Alex CARIBOU Karaoké",


    version:
        "2.1",


    songsPerPage:
        50,


    defaultLanguage:
        "all",


    defaultStyle:
        "all"


};



/* ================================
   Langues + drapeaux
================================ */


const LANGUAGES = {

    "French": "Français",
    "English": "Anglais",
    "German": "Allemand",
    "Spanish": "Espagnol",
    "Italian": "Italien",
    "Portuguese": "Portugais",
    "Dutch": "Néerlandais",
    "Japanese": "Japonais",
    "Korean": "Coréen",
    "Chinese": "Chinois",
    "Polish": "Polonais",
    "Russian": "Russe",
    "Czech": "Tchèque",
    "Slovak": "Slovaque",
    "Hungarian": "Hongrois",
    "Romanian": "Roumain",
    "Croatian": "Croate",
    "Serbian": "Serbe",
    "Bosnian": "Bosniaque",
    "Slovenian": "Slovène",
    "Danish": "Danois",
    "Swedish": "Suédois",
    "Norwegian": "Norvégien",
    "Finnish": "Finnois",
    "Greek": "Grec",
    "Turkish": "Turc",
    "Arabic": "Arabe",
    "Hebrew": "Hébreu",
    "Thai": "Thaï",
    "Vietnamese": "Vietnamien",
    "Indonesian": "Indonésien",
    "Malay": "Malais",
    "Hindi": "Hindi"
};


/* ================================
   Création filtres langues
================================ */

function loadLanguageFilter() {


    const select =
        document.getElementById(
            "languageFilter"
        );


    if (!select || typeof songs === "undefined") {

        return;

    }



    const languages =
        [
            ...new Set(
                songs
                .map(song => song.language)
                .filter(Boolean)

.filter(language => {

    const forbidden = [

        "Arab",
        "Arabic",
        "Turkish",
        "Finnish",
        "Greek"

    ];

    return !forbidden.includes(language);

})
            )
        ]
        .sort();



    languages.forEach(language => {


        const option =
            document.createElement(
                "option"
            );


        option.value =
            language;


option.textContent =
    LANGUAGES[language] || language;



        select.appendChild(option);


    });


}




/* ================================
   Création filtres styles
================================ */

function loadStyleFilter() {


    const select =
        document.getElementById(
            "styleFilter"
        );


    if (!select || typeof songs === "undefined") {

        return;

    }



    let styles = [];



    songs.forEach(song => {


        if (Array.isArray(song.category)) {


            styles.push(
                ...song.category
            );


        }

        else if(song.category) {


            styles.push(
                song.category
            );


        }


    });



    styles =
        [
            ...new Set(styles)
        ]
        .sort();




    styles.forEach(style => {


        const option =
            document.createElement(
                "option"
            );


        option.value =
            style;


        option.textContent =
            style;



        select.appendChild(option);


    });



}



/* ================================
   Initialisation configuration
================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        loadLanguageFilter();


        loadStyleFilter();


    }
);
