<template>
  <v-app>
    <Banner ref="banner" @logout="logout" @switchUserConnected="switchUserConnected" :userConnected="userConnected"></Banner>
    <v-main>
        <router-view  
            @playvideo="playvideo" 
            @descriptionUpdate="descriptionUpdate" 
            @changeplaylist="changeplaylist"
            @switchUserConnected="switchUserConnected"
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
            @descriptionUpdate="descriptionUpdate"
        />
        <Description ref="description"></Description>
    </div>
  </v-app>
</template>

<script>
import YoutubePlayer from './components/YoutubePlayer.vue';
import Description from './components/Description.vue';
import Banner from './components/Banner.vue';
import { searchMusic, getMusic } from './api';

export default {
    name: 'App',
    components: {
        YoutubePlayer,
        Description,
        Banner
    },
    data: () => ({
        //
    }),
    methods: {
        switchUserConnected(){
            this.$refs.banner.connectedUserBanner()
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
        },
        logout(){
            this.$router.push('/')
        },
        async search(fillDivSearch) {
            console.log("a")
            try {
                this.loading = true
                document.getElementById("loaderLogo").style.display = "block"
                document.getElementById("home").style.display = "none"
                document.getElementById("searchResult").style.display = "flex"
                document.getElementById("searchResult").innerHTML = ""
                let musicVideos = await searchMusic(this.$refs.searchInput.value)
                .then(response =>{
                    // Afficher les résultats
                    console.log('Résultats de la recherche :', response.data);

                    document.getElementById("loaderLogo").style.display = "none"
                    //this.$refs.youtubePlayer.setPlayList(response.data);
                    

                    if (fillDivSearch){
                        response.data.forEach(item => {
                            let div = document.createElement("div")
                            div.id = item.id
                            div.className = "searchOneResult"

                            div.onclick = async() => {
                                console.log("clic")
                                
                                let music = await getMusic(item["artist"], item["title"])
                                
                                console.log(music)
                                this.$emit('playvideo', {"id": music.data["id_yt"], "from": "search", "title": music.data["Title"], "artist": music.data["Artist"]})
                                
                                document.getElementsByTagName("body")[0].style.overflow = "hidden"
                                document.getElementById("player").style.display = "block"
                                if (this.device == "Mobile") {
                                    document.getElementById("divPlayer").style.display = "block"
                                    document.getElementById("divPlayer").classList.add("playerMiniatureMobile")
                                    document.getElementById("player").classList.add("playerMiniature")
                                }
                                else{
                                    document.getElementById("divPlayer").style.display = "flex"
                                    document.getElementById("divPlayer").classList.remove("playerMiniature")
                                    document.getElementById("divPlayer").classList.remove("playerMiniatureMobile")
                                }
                                document.getElementById("divPlayer").style.visibility = "visible"
                                document.getElementById("player").style.visibility = "visible"
                            }

                            let img = document.createElement("img")
                            img.src = item["img"]
                            div.appendChild(img)

                            let divDesc = document.createElement("div")
                            divDesc.className = "divDesc"

                            if (Object.keys(item).includes('title')){
                                let title = document.createElement("h2")
                                title.textContent = item["title"]
                                
                                let artist = document.createElement("h2")
                                artist.textContent = item["artist"]
                                
                                let album = document.createElement("h2")
                                album.textContent = item["album"]

                                divDesc.appendChild(title)
                                divDesc.appendChild(artist)
                                divDesc.appendChild(album)
                            } else {
                                let h2 = document.createElement("h2")
                                h2.textContent = item["titre"]

                                divDesc.appendChild(h2)
                            }

                            div.appendChild(divDesc)

                            document.getElementById("searchResult").appendChild(div)
                        });
                        this.loading = false
                    }
                })
                return musicVideos
            } catch (error) {
                console.error('Erreur lors de la recherche YouTube :', error);
            }
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