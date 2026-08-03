/* =====================================================
   Alex Karaoke V2.1
   search.js

   Moteur de recherche intelligent
===================================================== */

"use strict";



/* =====================================================
   NORMALISATION TEXTE
===================================================== */


function normalizeSearch(text){

    if(!text) return "";

    return text

        .toString()

        .toLowerCase()

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g,"")

        .replace(/[^a-z0-9\s]/g,"")

        .trim();

}



/* =====================================================
   DISTANCE ENTRE DEUX TEXTES
   (Levenshtein)
===================================================== */


function levenshtein(a,b){

    const matrix=[];


    for(let i=0;i<=b.length;i++){

        matrix[i]=[i];

    }


    for(let j=0;j<=a.length;j++){

        matrix[0][j]=j;

    }



    for(let i=1;i<=b.length;i++){

        for(let j=1;j<=a.length;j++){


            if(
                b.charAt(i-1)
                ===
                a.charAt(j-1)
            ){

                matrix[i][j]=
                matrix[i-1][j-1];

            }

            else{


                matrix[i][j]=Math.min(

                    matrix[i-1][j-1]+1,

                    matrix[i][j-1]+1,

                    matrix[i-1][j]+1

                );

            }

        }

    }


    return matrix[b.length][a.length];

}





/* =====================================================
   SCORE DE PERTINENCE
===================================================== */


function searchScore(song, query){


    const q =
    normalizeSearch(query);



    if(!q)

        return 0;



    const title =
    normalizeSearch(song.title);



    const artist =
    normalizeSearch(song.artist);



    let score=0;



    // correspondance exacte titre

    if(title===q)

        score+=100;



    // début du titre

    if(title.startsWith(q))

        score+=60;



    // mot présent dans titre

    if(title.includes(q))

        score+=40;



    // artiste

    if(artist===q)

        score+=80;



    if(artist.includes(q))

        score+=30;




    /*
       Recherche approximative

       Exemple :

       beatl

       Beatles
    */


    if(CONFIG.search.fuzzySearch){


        const words =

        title.split(" ");



        words.forEach(word=>{


            const distance=

            levenshtein(
                q,
                word
            );


            if(distance<=2){

                score+=25;

            }


        });


    }



    return score;

}





/* =====================================================
   RECHERCHE PRINCIPALE
===================================================== */


function intelligentSearch(list, query){


    const search =
    normalizeSearch(query);



    if(
        !search ||
        search.length <
        CONFIG.search.minimumCharacters
    ){

        return [...list];

    }



    return list

        .map(song=>({

            song:song,

            score:
            searchScore(
                song,
                search
            )

        }))


        .filter(item=>

            item.score>0

        )


        .sort((a,b)=>

            b.score-a.score

        )


        .map(item=>

            item.song

        );


}
