/*=====================================================
 Alex CARIBOU Karaoké V3.0
 sw.js
 Service Worker
======================================================*/


const CACHE_NAME =

    "alex-caribou-karaoke-v3";





const FILES_TO_CACHE = [


    "./",


    "./index.html",


    "./style.css",


    "./config.js",


    "./songs.js",


    "./search.js",


    "./app.js",


    "./manifest.json"


];







/*
=====================================================
 INSTALLATION
=====================================================
*/


self.addEventListener(

    "install",

    event => {


        event.waitUntil(


            caches.open(

                CACHE_NAME

            )

            .then(cache=>{


                return cache.addAll(

                    FILES_TO_CACHE

                );


            })


        );


        self.skipWaiting();


    }

);







/*
=====================================================
 ACTIVATION
=====================================================
*/


self.addEventListener(

    "activate",

    event=>{


        event.waitUntil(


            caches.keys()

            .then(keys=>{


                return Promise.all(


                    keys.map(key=>{


                        if(

                            key !== CACHE_NAME

                        ){


                            return caches.delete(

                                key

                            );


                        }


                    })


                );


            })


        );



        self.clients.claim();


    }

);







/*
=====================================================
 REQUETES
=====================================================
*/


self.addEventListener(

    "fetch",

    event=>{


        event.respondWith(


            caches.match(

                event.request

            )

            .then(response=>{


                return response

                ||

                fetch(

                    event.request

                )

                .then(networkResponse=>{


                    return caches.open(

                        CACHE_NAME

                    )

                    .then(cache=>{


                        cache.put(

                            event.request,

                            networkResponse.clone()

                        );



                        return networkResponse;


                    });


                });



            })


        );


    }

);
