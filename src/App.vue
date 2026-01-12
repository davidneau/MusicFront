<template>
  <v-app>
    <v-main>
        <router-view  
            @switchUserConnected="switchUserConnected" 
            @playvideo="playvideo" 
            @descriptionUpdate="descriptionUpdate" 
            @changeplaylist="changeplaylist"
        />
    </v-main>
    <div id="divPlayer">
        <YoutubePlayer 
            ref="youtubePlayer" 
            id="player" 
            :device="device" 
            @closeEvent="close" 
            @reduireEvent="reduire" 
            @agrandirEvent="agrandir" 
            @searchEvent="search" 
            @descriptionUpdate="descriptionUpdate"
        />
        <Description ref="description"></Description>
    </div>
  </v-app>
</template>

<script>
import YoutubePlayer from './components/YoutubePlayer.vue';
import Description from './components/Description.vue';

export default {
    name: 'App',
    components: {
        YoutubePlayer,
        Description
    },
    data: () => ({
        userConnected: false
        //
    }),
    methods: {
        switchUserConnected(){
            this.userConnected = !this.userConnected
        },
        descriptionUpdate(payload){
            console.log("descriptionUpdate", payload)
            this.$refs.description.Title = payload.title
            this.$refs.description.Artist = payload.artist
            this.$refs.description.setLyrics()
        },
        playvideo(payload){
            console.log("payload", payload)
            this.$refs.youtubePlayer.playNewVideo(payload.id, payload.title + " " + payload.artist, payload.from, payload.title, payload.artist);
        },
        changeplaylist(payload){
            this.$refs.youtubePlayer.setPlayList(payload.playlist);
        },
        agrandir(){
            console.log("agrandir")
            document.getElementsByTagName("body")[0].style.overflow = "hidden"
            if (this.device == "Desktop") {
                document.getElementById("divPlayer").classList.remove("divPlayerMiniature")
            }
            else {
                document.getElementById("divPlayer").classList.remove("playerMiniatureMobile")
            }
            document.getElementById("player").classList.remove("playerMiniature")
        },
        reduire(){
            console.log("reduire")
            document.getElementsByTagName("body")[0].style.overflow = "visible"
            if (this.device == "Desktop") {
                document.getElementById("divPlayer").classList.add("divPlayerMiniature")
            }
            else {
                document.getElementById("divPlayer").classList.add("playerMiniatureMobile")
            }
            document.getElementById("player").classList.add("playerMiniature")
        },
        close(){
            document.getElementById("divPlayer").style.visibility = "hidden"
            document.getElementById("player").style.visibility = "hidden"
            this.$refs.youtubePlayer.player.pauseVideo()
        }
    }
}
</script>

<style>
body, html {
  padding: 0;
  margin: 0;
}

body {
  background-image: url('../assets/Background_Music.jpg');
  background-size: cover;       /* L’image couvre toute la page */
  background-position: center;  /* Centrée */
  background-repeat: no-repeat; /* Pas de répétition */
  height: 100vh;
  margin: 0;
}


#bannerSearch {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #00a6ef;
    height: 60px;
    position: sticky;
    left: 0;
    right: 0;
    top: 0;
}
</style>