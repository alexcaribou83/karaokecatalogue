/* =====================================================
   Alex Karaoke V2.1
   app.js

   Application principale
===================================================== */

"use strict";


/* =====================================================
   VARIABLES
===================================================== */


let allSongs = [];

let filteredSongs = [];

let currentPage = 1;


const ITEMS_PER_PAGE = CONFIG.songsPerPage;



const favorites = new Set(

    JSON.parse(
        localStorage.getItem("alexKaraokeFavorites") || "[]"
    )

);



/* =====================================================
   ELEMENTS HTML
===================================================== */


const searchInput =
document.getElementById("search");


const languageFilter =
document.getElementById("languageFilter");


const styleFilter =
document.getElementById("styleFilter");


const artistFilter =
document.getElementById("artistFilter");


const duoOnly =
document.getElementById("duoOnly");


const hideExplicit =
document.getElementById("hideExplicit");


const sortSelect =
document.getElementById("sortSelect");


const songsContainer =
document.getElementById("songs");


const pagination =
document.getElementById("pagination");


const songCount =
document.getElementById("songCount");




/* =====================================================
   OUTILS
===================================================== */


function getFlag(language){

    return CONFIG.flags[language] || "🌍";

}



function songId(song){

    return song.artist + "|" + song.title;

}





/* =====================================================
   FAVORIS
===================================================== */


function isFavorite(song){

    return favorites.has(
        songId(song)
    );

}



function toggleFavorite(song){


    const id =
    songId(song);



    if(favorites.has(id)){

        favorites.delete(id);

    }

    else{

        favorites.add(id);

    }



    localStorage.setItem(

        "alexKaraokeFavorites",

        JSON.stringify(
            [...favorites]
        )

    );


    render();

}





/* =====================================================
   INITIALISATION
===================================================== */


function init(){



    allSongs = songs.filter(song=>{


        return (

            !CONFIG.hiddenLanguages.includes(
                song.language
            )

        );


    });



    filteredSongs =
    [...allSongs];



    populateFilters();


    render();



}





/* =====================================================
   FILTRES
===================================================== */


function unique(field){


    return [

        ...new Set(

            allSongs

            .map(song=>song[field])

            .filter(Boolean)

        )

    ].sort();


}





function populateFilters(){



    unique("language")

    .forEach(language=>{


        let option =
        document.createElement("option");


        option.value =
        language;


        option.textContent =
        getFlag(language)
        +" "
        +language;


        languageFilter.appendChild(option);


    });





    unique("style")

    .forEach(style=>{


        let option =
        document.createElement("option");


        option.value =
        style;


        option.textContent =
        style;


        styleFilter.appendChild(option);


    });





    unique("artist")

    .forEach(artist=>{


        let option =
        document.createElement("option");


        option.value =
        artist;


        option.textContent =
        artist;


        artistFilter.appendChild(option);


    });



}





/* =====================================================
   APPLICATION DES FILTRES
===================================================== */


function applyFilters(){



    let result =
    [...allSongs];



    if(
        searchInput.value.trim()
    ){

        result =
        intelligentSearch(

            result,

            searchInput.value

        );

    }





    if(languageFilter.value){


        result =
        result.filter(song=>

            song.language ===
            languageFilter.value

        );


    }





    if(styleFilter.value){


        result =
        result.filter(song=>

            song.style ===
            styleFilter.value

        );


    }





    if(artistFilter.value){


        result =
        result.filter(song=>

            song.artist ===
            artistFilter.value

        );


    }





    if(duoOnly.checked){


        result =
        result.filter(song=>

            song.duo === true

        );


    }





    if(hideExplicit.checked){


        result =
        result.filter(song=>

            !song.explicit

        );


    }





    filteredSongs =
    sortSongs(result);



    currentPage=1;


    render();



}





/* =====================================================
   TRI
===================================================== */


function sortSongs(list){


    let sorted =
    [...list];



    switch(sortSelect.value){



        case "titleDesc":


            sorted.sort((a,b)=>

                b.title.localeCompare(
                    a.title
                )

            );

            break;




        case "artist":


            sorted.sort((a,b)=>

                a.artist.localeCompare(
                    b.artist
                )

            );

            break;




        case "yearAsc":


            sorted.sort((a,b)=>

                a.year-b.year

            );

            break;




        case "yearDesc":


            sorted.sort((a,b)=>

                b.year-a.year

            );

            break;




        default:


            sorted.sort((a,b)=>

                a.title.localeCompare(
                    b.title
                )

            );


    }



    return sorted;


}





/* =====================================================
   AFFICHAGE
===================================================== */


function render(){


    songsContainer.innerHTML="";



    songCount.textContent =

        filteredSongs.length
        +" chanson(s)";





    const start =
    (currentPage-1)
    *
    ITEMS_PER_PAGE;



    const pageSongs =

    filteredSongs.slice(

        start,

        start + ITEMS_PER_PAGE

    );





    pageSongs.forEach(song=>{


        const card =
        document.createElement("article");



        card.className =
        "song-card";



        card.innerHTML = `


        <span class="favorite 
        ${isFavorite(song)?"active":""}">

            ${isFavorite(song)?"❤️":"🤍"}

        </span>


        <h2>
            🎵 ${song.title}
        </h2>


        <div class="artist">

            👤 ${song.artist}

        </div>



        <div class="badge">

            ${getFlag(song.language)}
            ${song.language}

        </div>



        <div class="badge">

            🎶 ${song.style || ""}

        </div>



        ${
            song.year
            ?
            `
            <div class="badge">
            📅 ${song.year}
            </div>
            `
            :
            ""
        }



        ${
            song.duo
            ?
            `
            <div class="badge">
            👥 Duo
            </div>
            `
            :
            ""
        }



        `;



        card
        .querySelector(".favorite")
        .onclick=()=>toggleFavorite(song);



        songsContainer.appendChild(card);



    });



    renderPagination();


}





/* =====================================================
   PAGINATION
===================================================== */


function renderPagination(){


    pagination.innerHTML="";



    const pages =

    Math.ceil(

        filteredSongs.length
        /
        ITEMS_PER_PAGE

    );



    for(
        let i=1;
        i<=pages;
        i++
    ){


        let button =
        document.createElement("button");



        button.textContent=i;



        if(i===currentPage){

            button.classList.add("active");

        }



        button.onclick=()=>{


            currentPage=i;


            render();


            window.scrollTo({

                top:0,

                behavior:"smooth"

            });


        };



        pagination.appendChild(button);


    }


}





/* =====================================================
   EVENEMENTS
===================================================== */


searchInput.addEventListener(
"input",
applyFilters
);


languageFilter.addEventListener(
"change",
applyFilters
);


styleFilter.addEventListener(
"change",
applyFilters
);


artistFilter.addEventListener(
"change",
applyFilters
);


duoOnly.addEventListener(
"change",
applyFilters
);


hideExplicit.addEventListener(
"change",
applyFilters
);


sortSelect.addEventListener(
"change",
applyFilters
);





/* =====================================================
   DEMARRAGE
===================================================== */


init();
