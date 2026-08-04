/*=====================================================
 Alex CARIBOU Karaoké V2.1
 app.js
 PACK A
 Initialisation + gestion catalogue
======================================================*/


/*
--------------------------------------------------
 Variables globales
--------------------------------------------------
*/

let allSongs = [];
let filteredSongs = [];
let currentPage = 1;
let favorites = [];


/*
--------------------------------------------------
 Configuration
--------------------------------------------------
*/

const APP_CONFIG = {

    songsPerPage: 50,

    storageKey: "alex_caribou_favorites"

};


/*
--------------------------------------------------
 Chargement des favoris
--------------------------------------------------
*/

function loadFavorites(){

    const saved = localStorage.getItem(
        APP_CONFIG.storageKey
    );

    if(saved){

        favorites = JSON.parse(saved);

    }else{

        favorites = [];

    }

}


/*
--------------------------------------------------
 Sauvegarde favoris
--------------------------------------------------
*/

function saveFavorites(){

    localStorage.setItem(

        APP_CONFIG.storageKey,

        JSON.stringify(favorites)

    );

}


/*
--------------------------------------------------
 Vérifie favori
--------------------------------------------------
*/

function isFavorite(id){

    return favorites.includes(id);

}


/*
--------------------------------------------------
 Ajoute / retire favori
--------------------------------------------------
*/

function toggleFavorite(id){

    if(isFavorite(id)){

        favorites = favorites.filter(
            item => item !== id
        );

    }else{

        favorites.push(id);

    }


    saveFavorites();

}



/*
--------------------------------------------------
 Préparation d'une chanson
 Compatible CSV Karaoké
--------------------------------------------------
*/

function prepareSong(song,index){


    return {


        id:
            song.id ||
            index + 1,


        title:
            song.Title ||
            song.title ||
            "",


        artist:
            song.Artist ||
            song.artist ||
            "",



        languages:
            splitValues(
                song.Languages ||
                song.languages
            ),



        styles:
            splitValues(
                song.Styles ||
                song.styles
            ),



        /*
        Gardé pour search.js
        */

        style:
            (
                song.Styles ||
                song.styles ||
                ""
            ),



        year:
            Number(
                song.Year ||
                song.year ||
                0
            ),



        duo:
            convertBoolean(
                song.Duo
            ),



        explicit:
            convertBoolean(
                song.Explicit
            ),



        favorite:
            isFavorite(
                song.id || index + 1
            )


    };


}



/*
--------------------------------------------------
 Séparation valeurs multiples
 Exemple :
 "Pop;Rock"
 devient :
 ["Pop","Rock"]
--------------------------------------------------
*/

function splitValues(value){


    if(!value)

        return [];


    return value

        .toString()

        .split(/[;,|]/)

        .map(item =>
            item.trim()
        )

        .filter(item =>
            item.length
        );


}




/*
--------------------------------------------------
 Conversion oui/non
--------------------------------------------------
*/

function convertBoolean(value){


    if(
        value === true ||
        value === 1
    )

        return true;


    if(!value)

        return false;


    return [

        "yes",
        "oui",
        "true",
        "1",
        "x"

    ]

    .includes(

        value
        .toString()
        .toLowerCase()
        .trim()

    );


}




/*
--------------------------------------------------
 Chargement du catalogue
--------------------------------------------------
*/

function loadSongs(){


    if(
        typeof songs === "undefined"
    ){

        console.error(
            "songs.js introuvable"
        );

        return;

    }



    loadFavorites();



    allSongs = songs.map(

        (song,index)=>

            prepareSong(
                song,
                index
            )

    );



    filteredSongs = [...allSongs];


    console.log(

        "Catalogue chargé :",

        allSongs.length,

        "chansons"

    );


}



/*
--------------------------------------------------
 Retourne le catalogue complet
--------------------------------------------------
*/

function getAllSongs(){

    return allSongs;

}



/*
--------------------------------------------------
 Retourne les langues disponibles
--------------------------------------------------
*/

function getLanguages(){


    let result=[];


    allSongs.forEach(song=>{


        song.languages.forEach(lang=>{


            if(!result.includes(lang))

                result.push(lang);


        });


    });



    return result.sort();


}




/*
--------------------------------------------------
 Retourne les styles disponibles
--------------------------------------------------
*/

function getStyles(){


    let result=[];


    allSongs.forEach(song=>{


        song.styles.forEach(style=>{


            if(!result.includes(style))

                result.push(style);


        });


    });



    return result.sort();


}




/*=====================================================
 Alex CARIBOU Karaoké V2.1
 app.js
 PACK B
 Recherche + filtres
======================================================*/


/*
--------------------------------------------------
 Recherche principale
 Utilise search.js
--------------------------------------------------
*/

function performSearch(query){


    filteredSongs = searchSongs(

        allSongs,

        query

    );


    currentPage = 1;


    return filteredSongs;


}




/*
--------------------------------------------------
 Suggestions recherche
--------------------------------------------------
*/

function getSearchSuggestions(query){


    return getSuggestions(

        allSongs,

        query,

        8

    );


}





/*
--------------------------------------------------
 Filtre général
--------------------------------------------------
*/

function filterSongs(filters = {}){


    let result = [...allSongs];



    /*
    -----------------------------
    Langue
    -----------------------------
    */

    if(filters.language){


        result = result.filter(song =>


            song.languages.some(lang =>

                normalizeText(lang)

                ===

                normalizeText(filters.language)

            )


        );


    }



    /*
    -----------------------------
    Style
    -----------------------------
    */

    if(filters.style){


        result = result.filter(song =>


            song.styles.some(style =>

                normalizeText(style)

                ===

                normalizeText(filters.style)

            )


        );


    }



    /*
    -----------------------------
    Plusieurs styles sélectionnés
    -----------------------------
    */

    if(filters.styles && filters.styles.length){


        result = result.filter(song =>


            filters.styles.some(selected =>


                song.styles.some(style =>


                    normalizeText(style)

                    ===

                    normalizeText(selected)

                )


            )


        );


    }





    /*
    -----------------------------
    Année minimum
    -----------------------------
    */

    if(filters.yearMin){


        result = result.filter(song =>

            song.year >= filters.yearMin

        );


    }



    /*
    -----------------------------
    Année maximum
    -----------------------------
    */

    if(filters.yearMax){


        result = result.filter(song =>

            song.year <= filters.yearMax

        );


    }





    /*
    -----------------------------
    Duo
    -----------------------------
    */

    if(filters.duo === true){


        result = result.filter(song =>

            song.duo === true

        );


    }





    /*
    -----------------------------
    Explicit
    -----------------------------
    */

    if(filters.explicit === true){


        result = result.filter(song =>

            song.explicit === true

        );


    }




    /*
    -----------------------------
    Favoris uniquement
    -----------------------------
    */

    if(filters.favorites === true){


        result = result.filter(song =>

            isFavorite(song.id)

        );


    }





    filteredSongs = result;


    currentPage = 1;


    return filteredSongs;


}




/*
--------------------------------------------------
 Recherche + filtres combinés
--------------------------------------------------
*/

function searchWithFilters(query,filters={}){


    let result;



    if(query && query.trim() !== ""){


        result = searchSongs(

            allSongs,

            query

        );


    }else{


        result = [...allSongs];


    }





    /*
    Applique les filtres
    sur le résultat
    */


    if(filters.language){


        result = result.filter(song =>


            song.languages.some(lang =>

                normalizeText(lang)

                ===

                normalizeText(filters.language)

            )


        );


    }





    if(filters.styles && filters.styles.length){


        result = result.filter(song =>


            filters.styles.some(selected =>


                song.styles.some(style =>

                    normalizeText(style)

                    ===

                    normalizeText(selected)

                )


            )


        );


    }





    if(filters.duo){


        result = result.filter(song =>

            song.duo

        );


    }





    if(filters.explicit){


        result = result.filter(song =>

            song.explicit

        );


    }





    if(filters.favorites){


        result = result.filter(song =>

            isFavorite(song.id)

        );


    }




    filteredSongs = result;


    currentPage = 1;


    return filteredSongs;


}




/*
--------------------------------------------------
 Recherche rapide par ID
--------------------------------------------------
*/

function getSongById(id){


    return allSongs.find(song =>

        song.id === id

    );


}




/*
--------------------------------------------------
 Compteur résultats
--------------------------------------------------
*/

function getResultCount(){


    return filteredSongs.length;


}

/*=====================================================
 Alex CARIBOU Karaoké V2.1
 app.js
 PACK C
 Affichage interface
======================================================*/


/*
--------------------------------------------------
 Élément principal d'affichage
--------------------------------------------------
*/

function getResultsContainer(){


    return document.getElementById(

        "results"

    );


}





/*
--------------------------------------------------
 Affichage catalogue
--------------------------------------------------
*/

function renderSongs(list = filteredSongs){


    const container = getResultsContainer();



    if(!container){

        console.error(

            "Zone #results introuvable dans index.html"

        );

        return;

    }





    container.innerHTML = "";





    if(list.length === 0){


        container.innerHTML = `

            <div class="no-result">

                Aucun titre trouvé

            </div>

        `;


        return;

    }





    list.forEach(song =>{


        container.appendChild(

            createSongCard(song)

        );


    });


}





/*
--------------------------------------------------
 Création carte chanson
--------------------------------------------------
*/

function createSongCard(song){


    const card = document.createElement(

        "div"

    );


    card.className = "song-card";





    const languages = song.languages

        .map(lang =>

            createLanguageBadge(lang)

        )

        .join("");





    const styles = song.styles

        .map(style =>

            `<span class="style">

                ${style}

             </span>`

        )

        .join("");





    card.innerHTML = `


        <div class="song-header">


            <h3>

                ${song.title}

            </h3>



            <button

                class="favorite-btn"

                data-id="${song.id}"

            >

                ${

                    isFavorite(song.id)

                    ? "❤️"

                    : "🤍"

                }

            </button>


        </div>





        <div class="artist">

            ${song.artist}

        </div>





        <div class="infos">


            <span>

                📅 ${song.year || ""}

            </span>



            ${

                song.duo

                ?

                `<span>

                    🎤 Duo

                 </span>`

                :

                ""

            }





            ${

                song.explicit

                ?

                `<span>

                    🔞 Explicit

                 </span>`

                :

                ""

            }


        </div>





        <div class="languages">

            ${languages}

        </div>





        <div class="styles">

            ${styles}

        </div>


    `;





    /*
    Bouton favoris
    */


    const button = card.querySelector(

        ".favorite-btn"

    );



    button.addEventListener(

        "click",

        ()=>{


            toggleFavorite(song.id);


            renderSongs(filteredSongs);


        }

    );




    return card;


}





/*
--------------------------------------------------
 Badge langue
--------------------------------------------------
*/

function createLanguageBadge(language){


    let flag = "🌐";



    if(window.CONFIG && CONFIG.flags){


        flag =

            CONFIG.flags[language]

            ||

            flag;


    }




    return `

        <span class="language">

            ${flag}

            ${language}

        </span>

    `;


}




/*
--------------------------------------------------
 Affichage compteur
--------------------------------------------------
*/

function renderCount(){


    const counter = document.getElementById(

        "result-count"

    );



    if(counter){


        counter.textContent =

            filteredSongs.length

            +

            " titres";


    }


}




/*
--------------------------------------------------
 Rafraîchissement complet
--------------------------------------------------
*/

function refreshDisplay(){


    renderSongs();


    renderCount();


}

/*=====================================================
 Alex CARIBOU Karaoké V2.1
 app.js
 PACK D
 Pagination + tri + initialisation
======================================================*/


/*
--------------------------------------------------
 Pagination
--------------------------------------------------
*/

function getTotalPages(){


    return Math.ceil(

        filteredSongs.length /

        APP_CONFIG.songsPerPage

    );


}




function getPageSongs(page=currentPage){


    const start =

        (page - 1)

        *

        APP_CONFIG.songsPerPage;



    return filteredSongs.slice(

        start,

        start + APP_CONFIG.songsPerPage

    );


}




function changePage(page){


    const total = getTotalPages();



    if(page < 1)

        page = 1;



    if(page > total)

        page = total;



    currentPage = page;



    renderSongs(

        getPageSongs()

    );


    renderPagination();


}





/*
--------------------------------------------------
 Affichage pagination
--------------------------------------------------
*/

function renderPagination(){


    const container = document.getElementById(

        "pagination"

    );



    if(!container)

        return;



    const total = getTotalPages();



    container.innerHTML = "";



    if(total <= 1)

        return;





    for(let i=1;i<=total;i++){


        const button = document.createElement(

            "button"

        );



        button.textContent = i;



        button.className =

            i === currentPage

            ?

            "active"

            :

            "";



        button.onclick = ()=>{


            changePage(i);


        };



        container.appendChild(button);


    }


}





/*
--------------------------------------------------
 Tri catalogue
--------------------------------------------------
*/

function sortCatalogue(mode){


    filteredSongs = sortSongs(

        filteredSongs,

        mode

    );



    currentPage = 1;



    renderSongs(

        getPageSongs()

    );


    renderPagination();


}





/*
--------------------------------------------------
 Recherche depuis champ HTML
--------------------------------------------------
*/

function connectSearch(){


    const input = document.getElementById(

        "search"

    );



    if(!input)

        return;



    input.addEventListener(

        "input",

        ()=>{


            performSearch(

                input.value

            );



            renderSongs(

                getPageSongs()

            );



            renderPagination();


        }

    );


}





/*
--------------------------------------------------
 Connexion tri HTML
--------------------------------------------------
*/

function connectSort(){


    const select = document.getElementById(

        "sort"

    );



    if(!select)

        return;



    select.addEventListener(

        "change",

        ()=>{


            sortCatalogue(

                select.value

            );


        }

    );


}





/*
--------------------------------------------------
 Initialisation application
--------------------------------------------------
*/

function initApp(){


    console.log(

        "🎤 Alex CARIBOU Karaoké V2.1"

    );



    loadSongs();



    filteredSongs = [

        ...allSongs

    ];



    connectSearch();


    connectSort();



    renderSongs(

        getPageSongs()

    );


    renderCount();


    renderPagination();



}





/*
--------------------------------------------------
 Lancement automatique
--------------------------------------------------
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{


        initApp();


    }

);
