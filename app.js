/*=====================================================
 Alex CARIBOU Karaoké V2.2
 app.js

 PACK A
 Base application + catalogue + données
======================================================*/


"use strict";


/*
=====================================================
 VARIABLES GLOBALES
=====================================================
*/


let songsDatabase = [];

let displayedSongs = [];

let currentPage = 1;

let totalPages = 1;

let favorites = [];



const APP_SETTINGS = {

    songsPerPage: 50,

    favoriteStorage:
        "alex_caribou_favorites"

};




/*
=====================================================
 CACHE DES ELEMENTS HTML
 Compatible index.html fourni
=====================================================
*/


const DOM = {


    search:
        null,


    songs:
        null,


    songCount:
        null,


    languageFilter:
        null,


    styleFilter:
        null,


    artistFilter:
        null,


    sortSelect:
        null,


    duoOnly:
        null,


    hideExplicit:
        null,


    favoritesOnly:
        null,


    suggestions:
        null,


    prevPage:
        null,


    nextPage:
        null,


    pageNumber:
        null

};




/*
=====================================================
 INITIALISATION DOM
=====================================================
*/


function cacheDOM(){


    DOM.search =
        document.getElementById("search");


    DOM.songs =
        document.getElementById("songs");


    DOM.songCount =
        document.getElementById("songCount");


    DOM.languageFilter =
        document.getElementById("languageFilter");


    DOM.styleFilter =
        document.getElementById("styleFilter");


    DOM.artistFilter =
        document.getElementById("artistFilter");


    DOM.sortSelect =
        document.getElementById("sortSelect");


    DOM.duoOnly =
        document.getElementById("duoOnly");


    DOM.hideExplicit =
        document.getElementById("hideExplicit");


    DOM.favoritesOnly =
        document.getElementById("favoritesOnly");


    DOM.suggestions =
        document.getElementById("suggestions");


    DOM.prevPage =
        document.getElementById("prevPage");


    DOM.nextPage =
        document.getElementById("nextPage");


    DOM.pageNumber =
        document.getElementById("pageNumber");


}




/*
=====================================================
 NORMALISATION TEXTE
=====================================================
*/


function cleanText(value){


    if(!value)

        return "";


    return value

        .toString()

        .trim();


}




/*
=====================================================
 NORMALISATION RECHERCHE
=====================================================
*/


function normalize(value){


    if(!value)

        return "";


    return value

        .toString()

        .toLowerCase()

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .trim();


}




/*
=====================================================
 TRANSFORMATION VALEURS MULTIPLES CSV
=====================================================
*/


function parseMultipleValues(value){


    if(!value)

        return [];



    return value

        .toString()

        .split(
            /[,;|]/
        )

        .map(item =>

            item.trim()

        )

        .filter(item =>

            item.length > 0

        );


}





/*
=====================================================
 CONVERSION BOOLEAN CSV
=====================================================
*/


function parseBoolean(value){


    if(value === true)

        return true;



    if(!value)

        return false;



    const test =

        normalize(value);



    return [

        "1",

        "true",

        "yes",

        "oui",

        "x"

    ]

    .includes(test);


}




/*
=====================================================
 CHARGEMENT FAVORIS
=====================================================
*/


function loadFavorites(){


    try{


        const data =

            localStorage.getItem(

                APP_SETTINGS.favoriteStorage

            );



        favorites =

            data

            ?

            JSON.parse(data)

            :

            [];


    }

    catch(error){


        favorites = [];


    }


}





/*
=====================================================
 SAUVEGARDE FAVORIS
=====================================================
*/


function saveFavorites(){


    localStorage.setItem(

        APP_SETTINGS.favoriteStorage,

        JSON.stringify(
            favorites
        )

    );


}




/*
=====================================================
 FAVORIS
=====================================================
*/


function isFavorite(id){


    return favorites.includes(id);


}




function toggleFavorite(id){


    if(isFavorite(id)){


        favorites =

            favorites.filter(

                fav => fav !== id

            );


    }

    else{


        favorites.push(id);


    }



    saveFavorites();


}




/*
=====================================================
 PREPARATION D'UNE CHANSON
=====================================================
*/


function prepareSong(raw,index){


    return {


        id:

            raw.id

            ||

            index + 1,



        title:

            cleanText(

                raw.Title

                ||

                raw.title

            ),



        artist:

            cleanText(

                raw.Artist

                ||

                raw.artist

            ),



        languages:

            parseMultipleValues(

                raw.Languages

                ||

                raw.languages

            ),



        styles:

            parseMultipleValues(

                raw.Styles

                ||

                raw.styles

            ),



        year:

            Number(

                raw.Year

                ||

                raw.year

                ||

                0

            ),



        duo:

            parseBoolean(

                raw.Duo

            ),



        explicit:

            parseBoolean(

                raw.Explicit

            )



    };


}





/*
=====================================================
 CHARGEMENT CATALOGUE
=====================================================
*/


function loadCatalogue(){


    loadFavorites();



    if(typeof songs === "undefined"){


        console.error(

            "songs.js absent"

        );


        return;


    }




    songsDatabase =

        songs.map(

            (song,index)=>

                prepareSong(

                    song,

                    index

                )

        );




    displayedSongs =

        [

            ...songsDatabase

        ];



    updateCounter();



    console.log(

        "Catalogue chargé :",

        songsDatabase.length,

        "titres"

    );


}




/*
=====================================================
 COMPTEUR
=====================================================
*/


function updateCounter(){


    if(!DOM.songCount)

        return;



    DOM.songCount.textContent =

        displayedSongs.length

        +

        " chansons disponibles";


}
/*=====================================================
 Alex CARIBOU Karaoké V2.2
 app.js

 PACK B
 Recherche + filtres + tri
======================================================*/


/*
=====================================================
 RECHERCHE PRINCIPALE
=====================================================
*/


function searchCatalogue(query){


    let result = [

        ...songsDatabase

    ];



    if(query && query.trim() !== ""){


        if(typeof searchSongs === "function"){


            result = searchSongs(

                songsDatabase,

                query

            );


        }

        else{


            const search = normalize(query);



            result = songsDatabase.filter(song =>{


                return (

                    normalize(song.title)

                    .includes(search)

                    ||

                    normalize(song.artist)

                    .includes(search)

                );


            });


        }


    }



    displayedSongs = result;



    currentPage = 1;


    updateCounter();


    return displayedSongs;


}





/*
=====================================================
 SUGGESTIONS
=====================================================
*/


function showSuggestions(query){


    if(!DOM.suggestions)

        return;



    DOM.suggestions.innerHTML = "";



    if(!query || query.length < 2)

        return;




    let suggestions = [];



    if(typeof getSuggestions === "function"){


        suggestions = getSuggestions(

            songsDatabase,

            query,

            8

        );


    }

    else{


        suggestions =

            searchCatalogue(query)

            .slice(

                0,

                8

            );


    }




    suggestions.forEach(song=>{


        const item =

            document.createElement(

                "div"

            );



        item.className =

            "suggestion-item";



        item.textContent =

            song.title

            +

            " - "

            +

            song.artist;



        item.onclick = ()=>{


            DOM.search.value =

                song.title;



            DOM.suggestions.innerHTML = "";



            searchCatalogue(

                song.title

            );



            renderApplication();


        };



        DOM.suggestions.appendChild(

            item

        );


    });


}





/*
=====================================================
 FILTRES
=====================================================
*/


function applyFilters(){


    let result = [

        ...songsDatabase

    ];





    /*
    Recherche texte
    */


    const query =

        DOM.search

        ?

        DOM.search.value

        :

        "";



    if(query.trim()){


        if(typeof searchSongs === "function"){


            result = searchSongs(

                result,

                query

            );


        }

    }





    /*
    Langue
    */


    if(

        DOM.languageFilter

        &&

        DOM.languageFilter.value

    ){


        const language =

            normalize(

                DOM.languageFilter.value

            );



        result = result.filter(song =>


            song.languages.some(lang =>


                normalize(lang)

                ===

                language


            )


        );


    }





    /*
    Style
    */


    if(

        DOM.styleFilter

        &&

        DOM.styleFilter.value

    ){


        const style =

            normalize(

                DOM.styleFilter.value

            );



        result = result.filter(song =>


            song.styles.some(item =>


                normalize(item)

                ===

                style


            )


        );


    }






    /*
    Artiste
    */


    if(

        DOM.artistFilter

        &&

        DOM.artistFilter.value

    ){


        const artist =

            normalize(

                DOM.artistFilter.value

            );



        result = result.filter(song =>


            normalize(song.artist)

            ===

            artist


        );


    }





    /*
    Duo
    */


    if(

        DOM.duoOnly

        &&

        DOM.duoOnly.checked

    ){


        result = result.filter(song =>

            song.duo === true

        );


    }





    /*
    Explicit
    */


if(
    DOM.hideExplicit
    &&
    DOM.hideExplicit.checked
){

    result = result.filter(song =>

        !song.explicit

    );

}





    /*
    Favoris
    */


    if(

        DOM.favoritesOnly

        &&

        DOM.favoritesOnly.checked

    ){


        result = result.filter(song =>


            isFavorite(song.id)


        );


    }





    displayedSongs = result;



    currentPage = 1;



    updateCounter();



    return displayedSongs;


}





/*
=====================================================
 LISTES DES FILTRES
=====================================================
*/


function fillFilters(){



    if(DOM.languageFilter){


        const languages = [];



        songsDatabase.forEach(song=>{


            song.languages.forEach(lang=>{


                if(!languages.includes(lang))

                    languages.push(lang);


            });


        });



        languages.sort();



        languages.forEach(lang=>{


            DOM.languageFilter.innerHTML +=

            `

            <option value="${lang}">

                ${lang}

            </option>

            `;


        });


    }






    if(DOM.styleFilter){


        const styles=[];



        songsDatabase.forEach(song=>{


            song.styles.forEach(style=>{


                if(!styles.includes(style))

                    styles.push(style);


            });


        });



        styles.sort();



        styles.forEach(style=>{


            DOM.styleFilter.innerHTML +=

            `

            <option value="${style}">

                ${style}

            </option>

            `;


        });


    }






    if(DOM.artistFilter){


        const artists=[];



        songsDatabase.forEach(song=>{


            if(

                song.artist

                &&

                !artists.includes(song.artist)

            )

                artists.push(song.artist);


        });



        artists.sort();



        artists.forEach(artist=>{


            DOM.artistFilter.innerHTML +=

            `

            <option value="${artist}">

                ${artist}

            </option>

            `;


        });


    }


}





/*
=====================================================
 TRI
=====================================================
*/


function sortCatalogue(mode){



    switch(mode){


        case "titleAsc":


            displayedSongs.sort((a,b)=>

                a.title.localeCompare(

                    b.title

                )

            );

        break;



        case "titleDesc":


            displayedSongs.sort((a,b)=>

                b.title.localeCompare(

                    a.title

                )

            );

        break;




        case "artistAsc":


            displayedSongs.sort((a,b)=>

                a.artist.localeCompare(

                    b.artist

                )

            );


        break;




        case "artistDesc":


            displayedSongs.sort((a,b)=>

                b.artist.localeCompare(

                    a.artist

                )

            );


        break;




        case "yearAsc":


            displayedSongs.sort((a,b)=>

                a.year-b.year

            );


        break;




        case "yearDesc":


            displayedSongs.sort((a,b)=>

                b.year-a.year

            );


        break;


    }



    currentPage = 1;



    renderApplication();


}

/*=====================================================
 Alex CARIBOU Karaoké V2.2
 app.js

 PACK C
 Affichage + cartes + pagination
======================================================*/


/*
=====================================================
 CREATION D'UNE CARTE CHANSON
=====================================================
*/


function createSongCard(song){


    const card = document.createElement(

        "article"

    );


    card.className =

        "song-card";





    const languages =

        song.languages

        .map(lang =>

            `

            <span class="language">

                ${getFlag(lang)}

                ${lang}

            </span>

            `

        )

        .join("");





    const styles =

        song.styles

        .map(style =>

            `

            <span class="style">

                ${style}

            </span>

            `

        )

        .join("");






    card.innerHTML = `


        <div class="song-top">


            <h3>

                ${escapeHTML(song.title)}

            </h3>



            <button

                class="favorite-button"

                data-id="${song.id}"

            >

                ${

                    isFavorite(song.id)

                    ?

                    "❤️"

                    :

                    "🤍"

                }

            </button>


        </div>





        <div class="artist-name">

            ${escapeHTML(song.artist)}

        </div>





        <div class="song-info">


            ${

                song.year

                ?

                `<span>

                    📅 ${song.year}

                 </span>`

                :

                ""

            }



            ${

                song.duo

                ?

                `<span>

                    👥 Duo

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




    const button =

        card.querySelector(

            ".favorite-button"

        );




    button.addEventListener(

        "click",

        ()=>{


            toggleFavorite(

                song.id

            );



            renderApplication();


        }

    );



    return card;


}





/*
=====================================================
 SECURISATION TEXTE HTML
=====================================================
*/


function escapeHTML(text){


    if(!text)

        return "";



    return text

        .toString()

        .replace(

            /[&<>"']/g,

            function(char){


                const map={

                    "&":"&amp;",

                    "<":"&lt;",

                    ">":"&gt;",

                    '"':"&quot;",

                    "'":"&#039;"

                };



                return map[char];


            }

        );


}





/*
=====================================================
 DRAPEAUX LANGUES
=====================================================
*/


function getFlag(language){



    if(

        typeof CONFIG !== "undefined"

        &&

        CONFIG.flags

    ){


        return CONFIG.flags[language]

        ||

        "🌍";


    }



    const flags={


        "French":"🇫🇷",

        "Français":"🇫🇷",

        "English":"🇬🇧",

        "Español":"🇪🇸",

        "Spanish":"🇪🇸",

        "Italian":"🇮🇹",

        "Deutsch":"🇩🇪"

    };



    return flags[language]

    ||

    "🌍";


}





/*
=====================================================
 AFFICHAGE DES CHANSONS
=====================================================
*/


function renderSongs(){


    if(!DOM.songs)

        return;




    DOM.songs.innerHTML = "";



    const pageSongs =

        getCurrentPageSongs();





    if(pageSongs.length === 0){


        DOM.songs.innerHTML = `

            <div class="empty">

                Aucun titre trouvé

            </div>

        `;


        return;


    }





    pageSongs.forEach(song=>{


        DOM.songs.appendChild(

            createSongCard(song)

        );


    });



}





/*
=====================================================
 PAGINATION
=====================================================
*/


function calculatePages(){


    totalPages = Math.ceil(

        displayedSongs.length /

        APP_SETTINGS.songsPerPage

    );



    if(totalPages < 1)

        totalPages = 1;


}





function getCurrentPageSongs(){


    calculatePages();



    const start =

        (

            currentPage - 1

        )

        *

        APP_SETTINGS.songsPerPage;




    return displayedSongs.slice(

        start,

        start +

        APP_SETTINGS.songsPerPage

    );


}





function updatePagination(){



    calculatePages();



    if(DOM.pageNumber){


        DOM.pageNumber.textContent =

            "Page "

            +

            currentPage

            +

            " / "

            +

            totalPages;


    }





    if(DOM.prevPage){


        DOM.prevPage.disabled =

            currentPage <= 1;


    }





    if(DOM.nextPage){


        DOM.nextPage.disabled =

            currentPage >= totalPages;


    }


}





function nextPage(){


    if(currentPage < totalPages){


        currentPage++;


        renderApplication();


    }


}




function previousPage(){


    if(currentPage > 1){


        currentPage--;


        renderApplication();


    }


}





/*
=====================================================
 RENDU GLOBAL
=====================================================
*/


function renderApplication(){


    renderSongs();


    updatePagination();


    updateCounter();


}

/*=====================================================
 Alex CARIBOU Karaoké V2.2
 app.js

 PACK D
 Connexions + Initialisation finale
======================================================*/


/*
=====================================================
 EVENEMENTS RECHERCHE
=====================================================
*/


function connectSearchEvents(){


    if(!DOM.search)

        return;



    DOM.search.addEventListener(

        "input",

        ()=>{


            searchCatalogue(

                DOM.search.value

            );


            showSuggestions(

                DOM.search.value

            );


            renderApplication();


        }

    );


}




/*
=====================================================
 EVENEMENTS FILTRES
=====================================================
*/


function connectFilterEvents(){


    const filters=[


        DOM.languageFilter,

        DOM.styleFilter,

        DOM.artistFilter,

        DOM.duoOnly,

        DOM.hideExplicit,

        DOM.favoritesOnly


    ];



    filters.forEach(filter=>{


        if(filter){


            filter.addEventListener(

                "change",

                ()=>{


                    applyFilters();


                    renderApplication();


                }

            );


        }


    });


}




/*
=====================================================
 EVENEMENT TRI
=====================================================
*/


function connectSortEvent(){


    if(!DOM.sortSelect)

        return;



    DOM.sortSelect.addEventListener(

        "change",

        ()=>{


            sortCatalogue(

                DOM.sortSelect.value

            );


        }

    );


}





/*
=====================================================
 EVENEMENTS PAGINATION
=====================================================
*/


function connectPagination(){



    if(DOM.nextPage){


        DOM.nextPage.addEventListener(

            "click",

            ()=>{


                nextPage();


            }

        );


    }





    if(DOM.prevPage){


        DOM.prevPage.addEventListener(

            "click",

            ()=>{


                previousPage();


            }

        );


    }


}





/*
=====================================================
 FERMETURE SUGGESTIONS
=====================================================
*/


function connectSuggestionClose(){


    document.addEventListener(

        "click",

        (event)=>{


            if(

                DOM.suggestions

                &&

                !event.target.closest(

                    ".search-section"

                )

            ){


                DOM.suggestions.innerHTML="";


            }


        }

    );


}




/*
=====================================================
 INITIALISATION COMPLETE
=====================================================
*/


function initAlexCaribou(){


    console.log(

        "🎤 Alex CARIBOU Karaoké V2.2 démarrage"

    );



    cacheDOM();



    loadCatalogue();



    fillFilters();



    connectSearchEvents();



    connectFilterEvents();



    connectSortEvent();



    connectPagination();



    connectSuggestionClose();



    renderApplication();



}





/*
=====================================================
 LANCEMENT APPLICATION
=====================================================
*/


document.addEventListener(

    "DOMContentLoaded",

    ()=>{


        initAlexCaribou();


    }

);
