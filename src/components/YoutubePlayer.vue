<template>
  <div style="position: relative;">
    <div id="background">
        <div class="loaderLogo" id="logoPlayer" style="display: block;"></div>
    </div>
    <button id="btn-agrandir" style="visibility: hidden;" @click="$emit('agrandir')">⛶</button>
    <div id="youtube-player" style="z-index: 2; position: absolute;"></div>
  </div>
</template>

<script>
import { getSimilarTrack } from '@/api';

export default {
    name: "YoutubePlayer",
    props: ["device"],
    data() {
        return {
            videoName: "",
            player: null, // L'instance du lecteur YouTube
            isAPIReady: false, // Flag pour savoir si l'API YouTube est prête
            playListCursor: 0,
            playList: [],
            videoIdCurrentlyPlayed: "",
            isTransitioning: false,
            watchdogTimer: null,
            watchdogDelay: 6000, // 6 secondes max pour démarrer
            hasStarted: false
        };
    },
    mounted() {
        // On expose l'instance Vue sur `window` pour y accéder depuis l'API YouTube
        window.vueInstance = this;
        this.loadYouTubeAPI();
    },
    methods: {
        // Charge l'API YouTube
        loadYouTubeAPI() {
            if (window.YT) {
                // Si l'API est déjà présente, on appelle directement la méthode de Vue
                this.onYouTubeIframeAPIReady();
            } else {
                // Si l'API n'est pas encore disponible, on charge le script
                const script = document.createElement('script');
                script.src = 'https://www.youtube.com/iframe_api';
                script.onload = () => {
                // Une fois le script chargé, on appelle la fonction `onYouTubeIframeAPIReady`
                this.onYouTubeIframeAPIReady();
                };
                document.body.appendChild(script);
            }
        },
        // Fonction appelée par YouTube lorsque l'API est prête
        onYouTubeIframeAPIReady() {
            if (window.YT && window.YT.Player) {
                this.isAPIReady = true;
                this.createPlayer();
            } else {
                console.error("L'API YouTube n'est pas encore prête.");
            }
        },
        startWatchdog(videoId) {

            clearTimeout(this.watchdogTimer);

            this.watchdogTimer = setTimeout(() => {

                if (!this.hasStarted) {
                    console.warn("⚠️ Vidéo bloquée (probable 403) :", videoId);
                    this.skipToNext();
                }

            }, this.watchdogDelay);
        },
        onPlayerError(event) {

            console.warn("Erreur YouTube :", event.data);

            clearTimeout(this.watchdogTimer);

            this.skipToNext();
        },
        // Crée l'instance du lecteur YouTube
        createPlayer() {
            if (this.isAPIReady) {
                this.player = new window.YT.Player('youtube-player', {
                videoId: 'dQw4w9WgXcQ', // ID de la vidéo initiale
                events: {
                    'onStateChange': this.onPlayerStateChange
                }
                });
            } else {
                console.error("L'API YouTube n'est pas encore prête.");
            }
        },
        handleVideoEnd() {
            return new Promise((resolve) => {
                this.$emit("playvideo", {
                    from: "automatic",
                    done: resolve   // 👈 callback pour débloquer
                })
            })
        },
        async loadAndWatch(videoId) {
            this.player.loadVideoById(videoId);

            const timeout = 5000; // 5 secondes max pour démarrer

            const started = await new Promise((resolve) => {

                const checkPlaying = (event) => {
                    if (event.data === window.YT.PlayerState.PLAYING) {
                        this.player.removeEventListener("onStateChange", checkPlaying);
                        resolve(true);
                    }
                };

                this.player.addEventListener("onStateChange", checkPlaying);

                setTimeout(() => {
                    this.player.removeEventListener("onStateChange", checkPlaying);
                    resolve(false);
                }, timeout);
            });

            if (!started) {
                console.log("Vidéo bloquée (probable 403)");
                this.skipToNext();
            }
        },
        async loadVideoWithWatchdog(videoId) {
            if (this.isTransitioning) return;
            this.isTransitioning = true;
            this.hasStarted = false;

            console.log("Chargement vidéo :", videoId);

            this.player.loadVideoById(videoId);

            this.startWatchdog(videoId);
        },
        skipToNext() {
            this.isTransitioning = false;
            clearTimeout(this.watchdogTimer);

            if (this.playList.length > 0) {
                this.playNewVideo(this.playListCursor + 1, "", "playlist");
            } else {
                this.$emit("playvideo", { from: "automatic" });
            }
        },
        // Gère les changements d'état du lecteur
        async onPlayerStateChange(event) {
            switch (event.data) {
                case window.YT.PlayerState.PLAYING:
                    console.log("Lecture démarrée");
                    this.hasStarted = true;
                    this.isTransitioning = false;
                    clearTimeout(this.watchdogTimer);
                    break;

                case window.YT.PlayerState.ENDED:
                    console.log("Vidéo terminée");
                    setTimeout(() => this.handleVideoEnd(), 3000);
                    break;

                case window.YT.PlayerState.BUFFERING:
                    console.log("Buffering...");
                    break;
                case window.YT.PlayerState.CUED:
                    console.log("Vidéo prête");
                    break;
            }
        },
        setPlayList(playList){
            this.playList = playList
            console.log("playList set to :", this.playList)
        },
        getVideoName(){
            return this.videoName
        },
        setVideoName(videoName){
            this.videoName = videoName
        },
        // Change la vidéo avec un nouvel ID
        playNewVideo(videoId, videoName="", from, title = "", artist = "") {
            if (this.player) {
                console.log("id", videoId)
                if (from !== "playlist") this.playList = []
                if (this.playList.length == 0) {
                    if (videoId == ""){
                        console.log("aa", this.videoName)                       
                        getSimilarTrack(this.videoName)
                        .then(async (response) => {
                            console.log("resp", response.data)
                            title = response.data["Title"]
                            artist = response.data["Artist"]
                            this.videoName = response.data["Title"] + " " + response.data["Artist"]
                            this.videoIdCurrentlyPlayed = response.data["yt_id"]
                            this.player.mute()
                            this.player.loadVideoById({
                                videoId: response.data["yt_id"],
                                playerVars: {
                                    rel: 0,          // 👈 clé importante
                                    modestbranding: 1,
                                    controls: 0
                                }
                            });
                            this.player.unMute()
                            this.$emit('descriptionUpdate', {"title": title, "artist": artist})
                        })
                    } else {
                        this.videoIdCurrentlyPlayed = videoId
                        this.player.mute()
                        this.player.loadVideoById({
                                videoId: videoId,
                                playerVars: {
                                    rel: 0,          // 👈 clé importante
                                    modestbranding: 1,
                                    controls: 0
                                }
                            }) // Charge une nouvelle vidéo
                        this.player.unMute()
                        this.videoName = videoName
                        this.$emit('descriptionUpdate', {"title": title, "artist": artist})
                    }
                } else {
                    console.log("playlist : ", this.playList)
                    this.playListCursor += 1
                    let music = this.playList[this.playListCursor]
                    console.log("id : ", music)
                    title = music["Title"]
                    artist = "no Data"
                    this.videoIdCurrentlyPlayed = music["id"]
                    this.player.loadVideoById({
                                videoId: music["id"],
                                playerVars: {
                                    rel: 0,          // 👈 clé importante
                                    modestbranding: 1,
                                    controls: 0
                                }
                            })
                    this.videoName = videoName
                    this.$emit('descriptionUpdate', {"title": title, "artist": artist})
                }
            } else {
                console.error("Le lecteur YouTube n'est pas encore prêt.");
            }
        }
    }
    };

    // Fonction globale fournie par YouTube qui est appelée quand l'API est prête
    window.onYouTubeIframeAPIReady = function() {
    if (window.vueInstance) {
        window.vueInstance.onYouTubeIframeAPIReady(); // Appelle la méthode de l'instance Vue
    }
    };
</script>

<style>

    #background{
        background-color: grey;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    #youtube-player{
        display: block;
        width: 100%;
        height: 100%;
    }

    #buttonDiv{
        position: absolute;
        top: 5px;
        right: 5px;
        width: 20%;
        height: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }


    #buttonDiv button{
        height: 20px;
        width: 20px;
        padding: 0;
    }

    #btn-agrandir{
        z-index: 3;
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
    }

    @media screen and (min-width: 428px)  {
        
    #buttonDiv{
        top: -30px;
    }
    
    #buttonDiv{
        width: 100px;
    }
    }

</style>