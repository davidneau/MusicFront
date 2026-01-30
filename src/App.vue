<template>
  <v-app>
    <p style="color:white">Impact-Site-Verification: 1137eed2-3cc0-461b-9315-6cc71c0133be</p>
    <Banner ref="banner" @logout="logout" @switchUserConnected="switchUserConnected" :userConnected="userConnected"></Banner>
    <v-main>
        <router-view  
            @playvideo="playvideo" 
            @descriptionUpdate="descriptionUpdate" 
            @changeplaylist="changeplaylist"
            @switchUserConnected="switchUserConnected"
            :device="device"
        />
        <div id="divPlayer">
            <div id="playerAndDesc">
                <YoutubePlayer
                    ref="youtubePlayer" 
                    id="player" 
                    :device="device" 
                    @playvideo="playvideo" 
                    @closeEvent="close" 
                    @reduireEvent="reduire" 
                    @agrandirEvent="agrandir"
                    @descriptionUpdate="descriptionUpdate"
                />
                <Description :device="device" ref="description" @playvideo="playvideo" ></Description>
            </div>
            <SuggestionsPanel v-if="device === 'Desktop'" ref="sugg" @playvideo="playvideo"></SuggestionsPanel>
        </div>
    </v-main>
  </v-app>
</template>

<script>
import YoutubePlayer from './components/YoutubePlayer.vue';
import Description from './components/Description.vue';
import Banner from './components/Banner.vue';
import SuggestionsPanel from './components/SuggestionsPanel.vue'
import { searchMusic, getMusic, ON_ITEM_CLICK, getSimilarTrack } from './api';
import { provide, getCurrentInstance  } from 'vue'

export default {
    setup() {
        // 👇 récupérer l'instance du composant
        const instance = getCurrentInstance()
        // instance.proxy = le 'this' du composant
        const onItemClick = (payload) => {
            instance.proxy.playvideo(payload)
        }

        provide(ON_ITEM_CLICK, onItemClick)

        return {}
    },
    name: 'App',
    components: {
        YoutubePlayer,
        Description,
        Banner,
        SuggestionsPanel
    },
    data: () => ({
        device: ""
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
        async playvideo(payload){
            document.getElementById("divPlayer").style.display = "flex"
            console.log("playvideo", payload)
            console.log(payload.id == "none")
            if (payload.id == "none"){
                let music = await getMusic(payload.artist, payload.title)
                console.log("music", music)
                payload.id = music.data.id_yt
            }
            if (payload.from == "search" || payload.from == "histo" || payload.from == "automatic"){
                let videoName = this.$refs.youtubePlayer.getVideoName()
                console.log("video", videoName)
                if (payload.from == "search" || payload.from == "histo") {
                    videoName = payload.title + " " + payload.artist
                    this.$refs.youtubePlayer.playNewVideo(payload.id, videoName, payload.from, payload.title, payload.artist)
                    this.$refs.youtubePlayer.setVideoName(payload.title + " " + payload.artist)
                }
                getSimilarTrack(videoName)
                .then(async (response) => {
                    console.log("getSimilarTrack : ", response.data)
                    if (payload.from == "automatic") {
                        console.log("resp", response.data)
                        let title = response.data["Title"]
                        let artist = response.data["Artist"]
                        this.$refs.youtubePlayer.player.loadVideoById(response.data["yt_id"]);
                        this.descriptionUpdate({"title": title, "artist": artist})
                        this.$refs.youtubePlayer.setVideoName(response.data["Title"] + " " + response.data["Artist"])
                    }
                    if(this.device == "Desktop") this.$refs.sugg.fillDiv(response.data['Result'])
                    else this.$refs.description.fillDivSugg(response.data['Result'])
                })
                console.log("getVideoName:", this.$refs.youtubePlayer.getVideoName())
            }
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
        },
    },
    mounted(){        
        let largeurEcran = window.innerWidth || document.documentElement.clientWidth;
        if (largeurEcran > 428) this.device = "Desktop"
        else this.device == "Mobile"
        console.log("device : ", this.device)
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

#playerAndDesc{
    flex: 0 0 100%;
    height: calc(100vh - 91px);
}

#bannerSearch {
    overflow: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: black;
    height: 60px;
    position: sticky;
    left: 0;
    right: 0;
    top: 0;
}

#divPlayer{
    display: none;
    flex-direction: row;
    position: absolute;
    top: 91px;
    width: 100%;
    height: calc(100% - 91px);
}

#player{
    height: 50%;
    max-height: 50%;
}


@media screen and (min-width: 428px)  {
    #playerAndDesc{
        flex: 0 0 70%;
    }
}
</style>