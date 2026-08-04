/*=====================================================
 Alex CARIBOU Karaoké V3.0
 search.js

 Recherche intelligente compatible songs.js V3
======================================================*/


"use strict";



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
 DISTANCE LEVENSHTEIN
 Tolérance fautes de frappe
=====================================================
*/


function levenshtein(a,b){



    a = normalizeText(a);

    b = normalizeText(b);




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

                b[i-1] === a[j-1]

            ){


                matrix[i][j] =

                    matrix[i-1][j-1];


            }

            else{


                matrix[i][j] = Math.min(


                    matrix[i-1][j]+1,


                    matrix[i][j-1]+1,


                    matrix[i-1][j-1]+1


                );


            }


        }


    }



    return matrix[b.length][a.length];


}







/*
=====================================================
 SCORE DE RECHERCHE
=====================================================
*/


function searchScore(query,song){



    const q = normalizeText(query);



    const title =

        normalizeText(song.title);



    const artist =

        normalizeText(song.artist);



    const language =

        normalizeText(song.language);





    const styles =

        song.category

        .join(" ")

        .toLowerCase();





    let score = 0;





    if(title === q)

        score += 1000;



    if(artist === q)

        score += 900;





    if(title.startsWith(q))

        score += 700;



    if(artist.startsWith(q))

        score += 600;





    if(title.includes(q))

        score += 400;



    if(artist.includes(q))

        score += 350;





    if(language.includes(q))

        score += 150;




    if(styles.includes(q))

        score += 150;







    const distanceTitle =

        levenshtein(

            q,

            title

        );



    const distanceArtist =

        levenshtein(

            q,

            artist

        );





    const bestDistance =

        Math.min(

            distanceTitle,

            distanceArtist

        );





    score += Math.max(

        0,

        200 -

        (

            bestDistance * 25

        )

    );




    return score;


}







/*
=====================================================
 RECHERCHE PRINCIPALE
=====================================================
*/


function intelligentSearch(list,query){



    if(

        !query

        ||

        query.trim()===""

    ){


        return [...list];


    }





    return list

        .map(song=>({


            song,


            score:

                searchScore(

                    query,

                    song

                )


        }))


        .filter(item=>

            item.score > 0

        )


        .sort((a,b)=>

            b.score -

            a.score

        )


        .map(item=>

            item.song

        );


}







/*
=====================================================
 SUGGESTIONS
=====================================================
*/


function searchSuggestions(list,query,max=8){



    if(

        !query

        ||

        query.length < 2

    )

        return [];





    return intelligentSearch(

        list,

        query

    )

    .slice(

        0,

        max

    );


}
