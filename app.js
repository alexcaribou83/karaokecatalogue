/*=====================================================
 Alex CARIBOU Karaoké V3.0
 app.js
 PACK A
 Base application + données
======================================================*/
"use strict";
alert("app.js chargé");
/*
=====================================================
 VARIABLES PRINCIPALES
=====================================================
*/
let allSongs = [];
let filteredSongs = [];
let currentPage = 1;
let totalPages = 1;
const ITEMS_PER_PAGE = 50;
let favorites = [];
/*
=====================================================
 ELEMENTS HTML
=====================================================
*/
const DOM = {
    search:null,
    suggestions:null,
    songs:null,
    songCount:null,
    languageFilter:null,
    styleFilter:null,
    artistFilter:null,
    sortSelect:null,
    duoOnly:null,
    hideExplicit:null,
    favoritesOnly:null,
    prevPage:null,
    nextPage:null,
    pageNumber:null

};

/*
=====================================================
 INITIALISATION DOM
=====================================================
*/

function initDOM(){

    DOM.search =
        document.getElementById("search");

    DOM.suggestions =
        document.getElementById("suggestions");

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

function normalizeText(text){

    if(!text)

        return "";

    return text

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
 CHARGEMENT FAVORIS
=====================================================
*/


function loadFavorites(){


    const saved =

        localStorage.getItem(

            "alex_caribou_favorites"

        );


    if(saved){


        try{


            favorites = JSON.parse(saved);


        }

        catch{


            favorites = [];


        }


    }



}

/*
=====================================================
 SAUVEGARDE FAVORIS
=====================================================
*/

function saveFavorites(){


    localStorage.setItem(

        "alex_caribou_favorites",

        JSON.stringify(

            favorites

        )

    );

}


/*
=====================================================
 VERIFICATION FAVORI
=====================================================
*/

function isFavorite(id){

    return favorites.includes(id);


}


/*
=====================================================
 AJOUT / SUPPRESSION FAVORI
=====================================================
*/

function toggleFavorite(id){


    if(isFavorite(id)){


        favorites = favorites.filter(

            item => item !== id

        );


    }

    else{


        favorites.push(id);


    }


    saveFavorites();


}

/*
=====================================================
 PREPARATION CATALOGUE
=====================================================
*/

function prepareSongs(){



    if(typeof songs === "undefined"){


        console.error(

            "songs.js introuvable"

        );


        return;
    }

    allSongs = songs.map(song => ({
        id:
            song.id,
        title:
            song.title || "",
        artist:
            song.artist || "",
        year:
            song.year || 0,
        language:
            song.language || "",
        category:
            Array.isArray(song.category)
            ?
            song.category
            :
            [],
        duo:
            song.duo === true,
        explicit:
            song.explicit === true,
        favorite:
            isFavorite(song.id)

    }));

    filteredSongs = [...allSongs];
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

        filteredSongs.length

        +

        " chansons disponibles";
}
/*=====================================================
 Alex CARIBOU Karaoké V3.0

 PACK B
 Recherche + filtres + tri
======================================================*/

/*
=====================================================
 RECHERCHE SIMPLE
=====================================================
*/

function searchInSongs(list, query){

    if(!query || query.trim()==="")

        return list;

    const q = normalizeText(query);

    return list.filter(song=>{

        return (

            normalizeText(song.title)

            .includes(q)


            ||


            normalizeText(song.artist)

            .includes(q)


        );


    });


}

/*
=====================================================
 SUGGESTIONS
=====================================================
*/


function getSuggestions(query){


    if(!query || query.length < 2)

        return [];

    return searchInSongs(

        allSongs,

        query

    )

    .slice(0,8);

}


/*
=====================================================
 APPLICATION DES FILTRES
=====================================================
*/

function applyFilters(){


    let result = [...allSongs];


    /*
    Recherche
    */

    if(DOM.search && DOM.search.value){

        result = searchInSongs(

            result,

            DOM.search.value

        );


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

            normalizeText(

                DOM.languageFilter.value

            );



        result = result.filter(song=>


            normalizeText(song.language)

            ===

            language


        );


    }

    /*
    Style / catégorie
    */


    if(

        DOM.styleFilter

        &&

        DOM.styleFilter.value

    ){


        const style =

            normalizeText(

                DOM.styleFilter.value

            );



        result = result.filter(song=>{


            return song.category.some(cat=>


                normalizeText(cat)

                ===

                style

            );

        });


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

            normalizeText(

                DOM.artistFilter.value

            );


        result = result.filter(song=>


            normalizeText(song.artist)

            ===

            artist


        );


    }

    /*
    Duo uniquement
    */

    if(

        DOM.duoOnly

        &&

        DOM.duoOnly.checked

    ){


        result = result.filter(song=>


            song.duo === true


        );


    }

    /*
    Masquer Explicit
    */


    if(

        DOM.hideExplicit

        &&

        DOM.hideExplicit.checked

    ){

        result = result.filter(song=>


            song.explicit !== true


        );


    }


    /*
    Favoris uniquement
    */


    if(

        DOM.favoritesOnly

        &&

        DOM.favoritesOnly.checked

    ){


        result = result.filter(song=>


            isFavorite(song.id)


        );


    }

    filteredSongs = result;

    currentPage = 1;

    updateCounter();


}

/*
=====================================================
 CREATION DES LISTES DE FILTRES
=====================================================
*/

function fillFilters(){

    /*
    LANGUES
    */

    if(DOM.languageFilter){

        const languages =

            [...new Set(

                allSongs.map(song=>

                    song.language

                )

            )]

            .filter(Boolean)

            .sort();

        languages.forEach(language=>{

            DOM.languageFilter.innerHTML +=

            `

            <option value="${language}">

                ${language}

            </option>

            `;

        });


    }


    /*
    STYLES
    */

    if(DOM.styleFilter){

        const styles=[];

        allSongs.forEach(song=>{

            song.category.forEach(style=>{

                if(!styles.includes(style))

                    styles.push(style);

            });

        });


        styles.sort();


        styles.forEach(style=>{


            DOM.styleFilter.innerHTML +=
            `
            <option value="${style}">
                ${
                    typeof translateStyle === "function"

                    ?

                    translateStyle(style)

                    :

                    style

                }

            </option>

            `;

        });


    }

    /*
    ARTISTES
    */

    if(DOM.artistFilter){


        const artists =

            [...new Set(

                allSongs.map(song=>

                    song.artist

                )

            )]

            .filter(Boolean)

            .sort();


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

function sortSongs(mode){

    switch(mode){

        case "titleAsc":

            filteredSongs.sort((a,b)=>

                a.title.localeCompare(

                    b.title

                )

            );

        break;

        case "titleDesc":

            filteredSongs.sort((a,b)=>

                b.title.localeCompare(

                    a.title

                )

            );

        break;

        case "artistAsc":


            filteredSongs.sort((a,b)=>

                a.artist.localeCompare(

                    b.artist

                )

            );


        break;

        case "artistDesc":

            filteredSongs.sort((a,b)=>

                b.artist.localeCompare(

                    a.artist

                )

            );


        break;

        case "yearAsc":

            filteredSongs.sort((a,b)=>

                a.year-b.year

            );


        break;

        case "yearDesc":


            filteredSongs.sort((a,b)=>

                b.year-a.year

            );


        break;


    }

}
/*=====================================================
 Alex CARIBOU Karaoké V3.0

 PACK C
 Affichage + cartes + pagination
======================================================*/

/*
=====================================================
 ECHAPPEMENT HTML
=====================================================
*/

function escapeHTML(text){


    if(!text)

        return "";



    return text

        .toString()

        .replace(

            /[&<>"']/g,

            char => ({


                "&":"&amp;",

                "<":"&lt;",

                ">":"&gt;",

                '"':"&quot;",

                "'":"&#039;"


            })[char]


        );


}







/*
=====================================================
 CREATION CARTE CHANSON
=====================================================
*/


function createSongCard(song){



    const card = document.createElement(

        "article"

    );



    card.className =

        "song-card";





    const styles =

        song.category

        .map(style=>{


            const label =

                typeof translateStyle === "function"

                ?

                translateStyle(style)

                :

                style;



            return `

            <span class="style-tag">

                ${label}

            </span>

            `;


        })

        .join("");






    card.innerHTML = `



        <div class="song-header">


            <h3>

                ${escapeHTML(song.title)}

            </h3>



            <button

                class="favorite-button"

                data-id="${song.id}">


                ${

                    isFavorite(song.id)

                    ?

                    "❤️"

                    :

                    "🤍"

                }


            </button>


        </div>






        <div class="artist">


            ${escapeHTML(song.artist)}


        </div>






        <div class="details">


            ${

                song.year

                ?

                `📅 ${song.year}`

                :

                ""

            }



            ${

                song.language

                ?

                ` 🌍 ${escapeHTML(song.language)}`

                :

                ""

            }



            ${

                song.duo

                ?

                " 👥 Duo"

                :

                ""

            }



            ${

                song.explicit

                ?

                " 🔞 Explicit"

                :

                ""

            }



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



            song.favorite =

                isFavorite(song.id);



            renderSongs();


        }

    );




    return card;


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

        getPageSongs();






    if(pageSongs.length===0){



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


function updatePagination(){



    totalPages = Math.ceil(

        filteredSongs.length /

        ITEMS_PER_PAGE

    );



    if(totalPages < 1)

        totalPages = 1;




    if(currentPage > totalPages)

        currentPage = totalPages;







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







function getPageSongs(){



    const start =


        (

            currentPage - 1

        )

        *

        ITEMS_PER_PAGE;




    return filteredSongs.slice(


        start,


        start +

        ITEMS_PER_PAGE


    );


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
 RENDU GENERAL
=====================================================
*/


function renderApplication(){



    renderSongs();



    updatePagination();



    updateCounter();



}
/*=====================================================
 Alex CARIBOU Karaoké V3.0

 PACK D
 Connexions + Initialisation finale
======================================================*/





/*
=====================================================
 EVENEMENT RECHERCHE
=====================================================
*/


function connectSearch(){



    if(!DOM.search)

        return;





    DOM.search.addEventListener(

        "input",

        ()=>{



            applyFilters();



            showSuggestions(

                DOM.search.value

            );



            renderApplication();



        }

    );



}







/*
=====================================================
 AFFICHAGE SUGGESTIONS
=====================================================
*/


function showSuggestions(query){



    if(!DOM.suggestions)

        return;



    DOM.suggestions.innerHTML = "";




    if(!query || query.length < 2)

        return;






    const results =

        getSuggestions(query);






    results.forEach(song=>{


        const item = document.createElement(

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





        item.addEventListener(

            "click",

            ()=>{


                DOM.search.value =

                    song.title;



                DOM.suggestions.innerHTML="";



                applyFilters();


                renderApplication();


            }

        );



        DOM.suggestions.appendChild(

            item

        );


    });


}







/*
=====================================================
 EVENEMENTS FILTRES
=====================================================
*/


function connectFilters(){



    const elements = [


        DOM.languageFilter,

        DOM.styleFilter,

        DOM.artistFilter,

        DOM.duoOnly,

        DOM.hideExplicit,

        DOM.favoritesOnly


    ];





    elements.forEach(element=>{


        if(element){


            element.addEventListener(

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
 TRI
=====================================================
*/


function connectSort(){



    if(!DOM.sortSelect)

        return;





    DOM.sortSelect.addEventListener(

        "change",

        ()=>{


            sortSongs(

                DOM.sortSelect.value

            );



            renderApplication();



        }

    );


}







/*
=====================================================
 PAGINATION EVENTS
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


function closeSuggestions(){



    document.addEventListener(

        "click",

        event=>{



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
 INITIALISATION APPLICATION
=====================================================
*/


function initAlexCaribou(){



    console.log(

        "🎤 Alex CARIBOU Karaoké V3.0"

    );





    initDOM();





    loadFavorites();





    prepareSongs();





    fillFilters();





    applyFilters();





    connectSearch();





    connectFilters();





    connectSort();





    connectPagination();





    closeSuggestions();





    renderApplication();



}







/*
=====================================================
 LANCEMENT
=====================================================
*/


document.addEventListener(

    "DOMContentLoaded",

    ()=>{


        initAlexCaribou();


    }

);
