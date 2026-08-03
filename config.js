/* =====================================================
   Alex Karaoke V2.1
   config.js

   Configuration générale de l'application
===================================================== */


const CONFIG = {


    /* =========================
       APPLICATION
    ========================= */


    appName: "Alex Karaoke V2.1",


    version: "2.1",



    /* Nombre de chansons affichées
       par page */

    songsPerPage: 24,



    /* =========================
       LANGUES
    ========================= */


    /*
       Langues conservées dans le catalogue

       Tu peux en ajouter ou retirer
       simplement ici.
    */


    allowedLanguages: [

        "Français",

        "French",

        "English",

        "Anglais",

        "Español",

        "Spanish",

        "Italiano",

        "Italian",

        "Deutsch",

        "German",

        "日本語",

        "Japanese",

        "한국어",

        "Korean",

        "中文",

        "Chinese"

    ],



    /*
       Langues interdites

       Elles ne seront jamais affichées.
    */


    hiddenLanguages: [

        "Arabic",

        "Arabe",

        "Romanian",

        "Roumain",

        "Turkish",

        "Turc",

        "Finnish",

        "Finnois"

    ],




    /* =========================
       DRAPEAUX AUTOMATIQUES
    ========================= */


    flags:{


        "Français":"🇫🇷",

        "French":"🇫🇷",


        "English":"🇬🇧",

        "Anglais":"🇬🇧",


        "Español":"🇪🇸",

        "Spanish":"🇪🇸",


        "Italiano":"🇮🇹",

        "Italian":"🇮🇹",


        "Deutsch":"🇩🇪",

        "German":"🇩🇪",


        "日本語":"🇯🇵",

        "Japanese":"🇯🇵",


        "한국어":"🇰🇷",

        "Korean":"🇰🇷",


        "中文":"🇨🇳",

        "Chinese":"🇨🇳"


    },




    /* =========================
       RECHERCHE
    ========================= */


    search:{


        // ignore accents :
        // été = ete

        ignoreAccents:true,


        // accepte petites fautes
        // beatl = Beatles

        fuzzySearch:true,


        // nombre de caractères
        // minimum avant recherche

        minimumCharacters:1


    },




    /* =========================
       AFFICHAGE
    ========================= */


    display:{


        showYear:true,


        showLanguage:true,


        showStyle:true,


        showArtist:true,


        showDuo:true,


        showExplicit:false


    },




    /* =========================
       TRI PAR DEFAUT
    ========================= */


    defaultSort:"titleAsc"



};