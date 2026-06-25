<template>
  <v-app>
    <Banner ref="banner" @setSearchResult="setSearchResult" @switchUserConnected="switchUserConnected" :userConnected="userConnected"></Banner>
    <v-main>
        <router-view @playvideo="playvideo" 
            @logout="logout"
            @descriptionUpdate="descriptionUpdate" 
            @changeplaylist="changeplaylist"
            @switchUserConnected="switchUserConnected"
            @reduire="reduire"
            @displayPlaylist="displayPlaylist"
            :device="device"
            id="routerView"
            v-slot="{ Component }">
            <component :is="Component" ref="rv" />
        </router-view>
        <div id="divPlayer">
            <button id="btn-reduire" @click="reduire">Réduire</button>
            <Description :device="device" ref="description" @playvideo="playvideo" ></Description>
            <YoutubePlayer
                ref="youtubePlayer" 
                id="player" 
                :device="device" 
                @playvideo="playvideo" 
                @close="close" 
                @reduire="reduire" 
                @agrandir="agrandir"
                @descriptionUpdate="descriptionUpdate"
            />
            <SuggestionsPanel ref="sugg" @playvideo="playvideo"></SuggestionsPanel>
        </div>
        <AddMusicToPlaylistPopup v-show="showAddPlaylistPopup" @closePopup="closePopup" :music_id="music_id" ref="amtp"></AddMusicToPlaylistPopup>
    </v-main>
  </v-app>
</template>

<script>
import YoutubePlayer from './components/YoutubePlayer.vue';
import Description from './components/Description.vue';
import Banner from './components/Banner.vue';
import SuggestionsPanel from './components/SuggestionsPanel.vue'
import { searchMusic, getMusic, ON_ITEM_CLICK, OPEN_AMTP_POPUP, getSimilarTrack } from './api';
import { provide, getCurrentInstance  } from 'vue'
import AddMusicToPlaylistPopup from '@/components/AddMusicToPlaylistPopup.vue';

export default {
    setup() {
        // 👇 récupérer l'instance du composant
        const instance = getCurrentInstance()
        // instance.proxy = le 'this' du composant
        const onItemClick = (payload) => {
            console.log("payload", payload)
            instance.proxy.playvideo(payload)
        }
        provide(ON_ITEM_CLICK, onItemClick)

        const open_amtp_popup = (payload) => {
            instance.proxy.openAddMusicToPlaylistPopup(payload)
        }
        provide(OPEN_AMTP_POPUP, open_amtp_popup)
        return {}
    },
    name: 'App',
    components: {
        YoutubePlayer,
        Description,
        Banner,
        SuggestionsPanel,
        AddMusicToPlaylistPopup
    },
    data: () => ({
        device: "",
        playlist: Array(),
        enchainement_music: 0,
        showAddPlaylistPopup: false,
        music_id: ""
    }),
    methods: {
        openAddMusicToPlaylistPopup(music_id){
            this.music_id = music_id
            this.$refs.amtp.loadPlaylist()
            this.showAddPlaylistPopup= true
        },
        closePopup(){
            this.showAddPlaylistPopup = false
        },
        switchUserConnected(){
            this.$refs.banner.connectedUserBanner()
        },
        descriptionUpdate(payload){

            console.log("descriptionUpdate", payload)
            this.$refs.description.Title = payload.title
            this.$refs.description.Artist = payload.artist
            this.$refs.description.setLyrics()
        },
        displayPlaylist(payload){
            this.$refs.sugg.fillPlaylist(payload.playlist)
        },
        async playvideo(payload){
            this.$refs.sugg.fillDiv([])
            document.getElementById("Lyrics").innerText = ""
            document.getElementById("logoDesc").style.display = "block"
            document.getElementById("logoSugg").style.display = "block"
            document.getElementById("divPlayer").style.display = "flex"
            console.log("playvideo", payload)
            console.log(payload.id == "none")
            if (payload.id == "automatic" && this.playlist != []){
                return
            }
            if (payload.id == "none"){
                let music = await getMusic(payload.artist, payload.title)
                console.log("music", music)
                if (music.data.id_clip && music.data.id_clip != "Not found") payload.id = music.data.id_clip
                else payload.id = music.data.id_yt
            }
            if (payload.from == "search" || payload.from == "histo"){
                this.$refs.youtubePlayer.playlistLoaded = false
                document.getElementById("divPlayer").style.visibility = "visible"
                document.getElementById("player").style.visibility = "visible"
                if (payload.id_clip !== "Not found" && payload.id_clip !== null && payload.id_clip !== undefined) payload.id = payload.id_clip
            }
            if (payload.from == "search" || payload.from == "histo" || payload.from == "suggestion"){
                this.agrandir()
            }
            if (payload.from == "search" || payload.from == "histo" || payload.from == "automatic" || payload.from == "playlist"){
                if (payload.playlist) {
                    console.log("play playlist")
                    this.$refs.youtubePlayer.autoPlayCount = 0
                    for (let i = payload.playlist.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [payload.playlist[i], payload.playlist[j]] = [payload.playlist[j], payload.playlist[i]];
                    }
                    
                    this.$refs.youtubePlayer.player.loadPlaylist(payload.playlist);
                } else {
                    let videoName = this.$refs.youtubePlayer.getVideoName()
                    console.log("video", videoName)
                    if (payload.from == "search" || payload.from == "histo") {
                        console.log("id", payload)
                        videoName = payload.title + " " + payload.artist
                        document.getElementById("youtube-player").style.visibility = "visible"
                        //this.$refs.youtubePlayer.playNewVideo(payload.id, videoName, payload.from, payload.title, payload.artist)
                        this.$refs.youtubePlayer.setVideoName(payload.title + " " + payload.artist)
                    }
                    getSimilarTrack(videoName)
                    .then(async (response) => {
                        console.log("getSimilarTrack : ", response.data)
                        if (!Object.keys(response.data).includes("Ex")){
                            this.enchainement_music += 1
                            if (this.enchainement_music == 5){
                                alert("êtes vous encore là?");
                                this.enchainement_music = 0;
                            }
                            console.log("reponse de GetSimilarTrack : ", response.data)
                            document.getElementById("youtube-player").style.visibility = "visible"
                            //this.$refs.youtubePlayer.setVideoName(response.data.music["Title"] + " " + response.data.music["Artist"])
                            if (payload.id_clip && payload.id_clip != "Not found") this.playlist = [payload.id_clip]
                            else this.playlist = [payload.id]

                            if (response.data.length != 0) {
                                response.data.Result.forEach(track => this.playlist.push(track.id_yt))
                            }

                            console.log("Playlist préchargée :", this.playlist)
                            this.$refs.youtubePlayer.autoPlayCount = 0
                            this.$refs.youtubePlayer.player.loadPlaylist(this.playlist);

                            //payload.done()
                            if (response.data['Result'].lenght != 0) this.$refs.sugg.fillDiv(response.data['Result'])
                        }
                    })
                }
                console.log("getVideoName:", this.$refs.youtubePlayer.getVideoName())
            }
        },
        changeplaylist(payload){
            this.$refs.youtubePlayer.setPlayList(payload.playlist);
        },
        agrandir(){
            console.log("agrandir")
            document.getElementById("divPlayer").classList.add("playerFullScreen")
            document.getElementById("divPlayer").classList.remove("playerMiniature")
            if (this.device == 'Desktop') document.getElementById("divPlayer").style.top = "60px"
            document.getElementById("mainDescription").style.display = "flex"
            document.getElementById("mainSuggestion").style.display = "flex"
            document.getElementById("btn-reduire").style.visibility = "visible"
            document.getElementById("btn-agrandir").style.visibility = "hidden"
        },
        reduire(){
            console.log("reduire")
            document.getElementById("divPlayer").classList.remove("playerFullScreen")
            document.getElementById("divPlayer").classList.add("playerMiniature")
            document.getElementById("mainDescription").style.display = "none"
            document.getElementById("mainSuggestion").style.display = "none"
            document.getElementById("btn-reduire").style.visibility = "hidden"
            document.getElementById("btn-agrandir").style.visibility = "visible"
        },
        close(){
            document.getElementById("divPlayer").style.visibility = "hidden"
            document.getElementById("player").style.visibility = "hidden"
            this.$refs.youtubePlayer.player.pauseVideo()
        },
        logout(){
            this.$router.push('/')
        },
        setSearchResult(list){
            this.$refs.rv.setSearchResult(list)
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
        /* localStorage.setItem('userConnected', false);
        this.$refs.banner.userConnected = false */
        let largeurEcran = window.innerWidth || document.documentElement.clientWidth;

        console.log(largeurEcran)
        if (largeurEcran > 428) this.device = "Desktop"
        else this.device = "Mobile"

        localStorage.setItem('device', this.device)

        console.log("device : ", this.device)
        console.log("user connected : ", this.$refs.banner.userConnected)
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
    height: calc(100vh - 60px);
}

#routerView{
    height: calc(100% - 60px);
}

#btn-reduire{
    position: absolute;
    cursor: pointer;
    z-index: 3;
    top: 0;
    right: 0;
    z-index: 50;
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
    z-index: 1000;
    box-shadow:
    0 0 12px 2px rgba(120, 220, 255, 0.9),
    0 0 12px 6px rgba(240, 147, 251, 0.8);
}

#playerFullScreen{
    top: 60px;
    left: 0;
    right: 0;
}

#divPlayer{
    display: none;
    flex-direction: column;
    position: absolute;
    top: 60px;
    width: 100%;
    height: calc(100% - 60px);
    background-color: black;
    overflow: hidden;
}

#player{
    height: 100%;
    flex: 0 0 50%;
    order: -1;
}

.flexCol{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #0b0b0f;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #00f0ff, #ff00f7);
  border-radius: 10px;
  background-clip: padding-box;
  border: 2px solid transparent;
  cursor: pointer;
}

#btn-agrandir{
    font-size: 20px;
    background-color: black;
    color: white;
}

#btn-reduire{
    font-size: 16px;
    background-color: black;
    color: white;
}

.playlistPopup{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: green;
    border: 1px solid black;
    border-radius: 15px;
    height: 10vh;
    width: 30vw;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    color: white
}

@media screen and (min-width: 428px)  {
    #playerAndDesc{
        flex: 0 0 70%;
    }

    #player{
        order: 0;
        z-index: 100;
        box-shadow:
            8px 0 15px rgba(124, 252, 0, 0.6),   /* droite */
            -8px 0 15px rgba(124, 252, 0, 0.6);   /* gauche */
        }

    #divPlayer{
        flex-direction: row;
    }
}
</style>