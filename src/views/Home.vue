<template>
    <div id="bannerSearch">
        <div>Logo</div>
        <div v-if="userConnected" id="searchDiv">
            <input type="text" id="search" @keyup.enter="search" ref="searchInput" value="21 pilots">
            <button @click="search(true)">Search</button>
        </div>
        <button @click="logout">Déconnexion</button>
    </div>
    <div id="searchResult"></div>
    <div id="home">
        <div id="replay">
            
        </div>
        <div id="historique">
            
        </div>
    </div>
    <div id="divPlayer">
        <YoutubePlayer ref="youtubePlayer" id="player" :device="device" @closeEvent="close" @reduireEvent="reduire" @agrandireEvent="agrandir" @searchEvent="search"/>
    </div>
</template>

<script>
import YoutubePlayer from '../components/YoutubePlayer.vue';
import { searchMusic, loadHistorique, getMusic, loadReplay } from '../api';

export default ({
    name: "MusicPage",
    props: ["userConnected"],
    components: {
        YoutubePlayer
    },
    data() {
        return {
            device: "Mobile",
            current_video_id: "",
            video_playing: false,
            API_KEY: 'AIzaSyA8apjRRfjCHmu6M_4q_r3kUbnO_qJ7xfk',
            API_URL: 'https://www.googleapis.com/youtube/v3/search',
            VIDEO_DETAILS_URL: 'https://www.googleapis.com/youtube/v3/videos',
            serpAPI_KEY: '777faa1853ab2cc4bfb9c2b265b2147cc6167016356d283bbfc7cb61903009a8'
        };
    },
    methods: {
        async init(){
            let largeurEcran = window.innerWidth || document.documentElement.clientWidth;
            if (largeurEcran > 428) this.device = "Desktop"
            else this.device == "Mobile"

            console.log("device :", this.device)

            document.getElementById("divPlayer").onclick = () => {
                this.reduire()
            }

            let histo = await loadHistorique()
            let replay = await loadReplay()

            histo.data.splice(20)
            console.log(replay)

            histo.data.forEach(item => {
                console.log(item)
                let div = document.createElement("div")
                div.id = item[2]
                div.className = "searchOneResult"

                div.onclick = async () => {
                    this.video_playing = true

                    let music = await getMusic(item["Artist"], item["Title"])
                    
                    this.$refs.youtubePlayer.playNewVideo(music.data["id_yt"]);
                    document.getElementsByTagName("body")[0].style.overflow = "hidden"
                    document.getElementById("divPlayer").style.display = "block"
                    document.getElementById("player").style.display = "block"
                    if (this.device == "Mobile") {
                        document.getElementById("divPlayer").classList.add("playerMiniatureMobile")
                        document.getElementById("player").classList.add("playerMiniature")
                    }
                    else{
                        document.getElementById("divPlayer").classList.remove("playerMiniature")
                        document.getElementById("divPlayer").classList.remove("playerMiniatureMobile")
                    }
                    document.getElementById("divPlayer").style.visibility = "visible"
                    document.getElementById("player").style.visibility = "visible"
                }

                let img = document.createElement("img")
                img.src = item["StatMusic3"]["Image"]
                div.appendChild(img)

                let divDesc = document.createElement("div")
                divDesc.className = "divDesc"

                let title = document.createElement("h2")
                title.textContent = item["Title"]
                
                let artist = document.createElement("h2")
                artist.textContent = item["Artist"]
                
                let album = document.createElement("h2")
                album.textContent = item["StatMusic3"]["Album"]

                divDesc.appendChild(title)
                divDesc.appendChild(artist)
                divDesc.appendChild(album)
                

                div.appendChild(divDesc)

                document.getElementById("historique").appendChild(div)
            });
        },
        agrandir(){
            if (this.video_playing) {
                document.getElementsByTagName("body")[0].style.overflow = "hidden"
                if (this.device == "Desktop") {
                    document.getElementById("divPlayer").classList.remove("divPlayerMiniature")
                }
                else {
                    document.getElementById("divPlayer").classList.remove("playerMiniatureMobile")
                }
                document.getElementById("player").classList.remove("playerMiniature")
            }
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
        async APIytSearch(input) {
            // Construire l'URL avec les paramètres
            const url = `${this.API_URL}?part=snippet&type=video&q=${encodeURIComponent(input)}&key=${this.API_KEY}&maxResults=100`;
            
            // Effectuer une requête fetch
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const searchData = await response.json();

            // Récupérer les IDs des vidéos trouvées
            const videoIds = searchData.items.map(item => item.id.videoId).join(',');

            // Étape 2 : Obtenir les détails des vidéos pour vérifier la catégorie
            const videoDetailsResponse = await fetch(
                `${this.VIDEO_DETAILS_URL}?part=snippet&id=${videoIds}&key=${this.API_KEY}`
            );
            const videoDetailsData = await videoDetailsResponse.json();

            // Filtrer uniquement les vidéos ayant la catégorie musique (ID: 10)
            return videoDetailsData.items.filter(video => video.snippet.categoryId === '10');
        },
        async search(fillDivSearch) {
            try {
                document.getElementById("home").style.display = "none"
                document.getElementById("searchResult").style.display = "flex"
                let musicVideos = await searchMusic(this.$refs.searchInput.value)
                .then(response =>{
                    // Afficher les résultats
                    console.log('Résultats de la recherche :', response.data);

                    //this.$refs.youtubePlayer.setPlayList(response.data);
                    
                    document.getElementById("searchResult").innerHTML = ""

                    if (fillDivSearch){
                        response.data.forEach(item => {
                            let div = document.createElement("div")
                            div.id = item.id
                            div.className = "searchOneResult"

                            div.onclick = async() => {
                                console.log("clic")
                                
                                let music = await getMusic(item["artist"], item["title"])
                                
                                console.log(music)
                                this.$refs.youtubePlayer.playNewVideo(music.data["id_yt"], music.data["Title"] + " " + music.data["Artist"]);
                                
                                document.getElementsByTagName("body")[0].style.overflow = "hidden"
                                document.getElementById("divPlayer").style.display = "block"
                                document.getElementById("player").style.display = "block"
                                if (this.device == "Mobile") {
                                    document.getElementById("divPlayer").classList.add("playerMiniatureMobile")
                                    document.getElementById("player").classList.add("playerMiniature")
                                }
                                else{
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
                    }
                })
                return musicVideos
            } catch (error) {
                console.error('Erreur lors de la recherche YouTube :', error);
            }
        }
    },
    async mounted() {
        this.init()
        document.title = 'MusicDA';
    }
});
</script>

<style scopped>

html, body, #app, v-app, v-main{
    height: 100%;
}

html{
    background-color: aliceblue;
}

#search {
    border: 1px solid black;
}


#searchResult {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: calc(100vh - 60px);
    overflow-y: auto;     /* scroll vertical seulement si besoin */
    overflow-x: hidden; 
}

.searchOneResult {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 90%;
    margin-top: 10px;
    margin-bottom: 10px;
    border: 1px solid black;
    border-radius: 15px;
    padding: 10px;
    background-color: #00ebff;
    cursor: pointer;
}

.searchOneResult h2{
    margin-left: 10px;
}

#searchDiv{
    display: flex;
    flex-direction: row;
}

#divPlayer{
    display: none;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    background-color: rgb(50, 50, 50, 0.5);
    z-index: 3;
}

.playerFullScreen{
    width: 100% !important;
    height: 100% !important;
    top: 0 !important;
    left: 0 !important;
    bottom: 0 !important;
    right: 0 !important;
}

#blur{
    width: 100vw;
    height: 100vh;
    background-color: black;
    position: absolute;
    z-index: 2;
    opacity: 0.5;
    filter: blur(100px);
    display: none;
}

.playerMiniature{
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100% !important;
    height: 100% !important;
    position: relative !important;
}

.playerMiniatureMobile{
    top: initial !important;
    left: initial !important;
    right: 10px !important;
    bottom: 10px !important;
    width: 70% !important;
    height: 200px !important;
}


#player {
    top: 20px;
    bottom: 20px;
    left: 20px;
    right: 20px; 
    width: calc(100vw - 40px); 
    height: calc(100vh - 40px);
    position: absolute;
}


#historique{
    overflow-y: auto; 
    max-height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    align-items: center;
}

@media screen and (min-width: 428px)  {
    
    #player {
        top: 100px;
        bottom: 100px;
        left: 100px;
        right: 100px; 
        width: calc(100% - 200px); 
        height: calc(100% - 200px);
    }
    .searchOneResult {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 25%;
        margin-top: 10px;
        margin-bottom: 10px;
        border: 1px solid black;
        border-radius: 15px;
        padding: 10px;
        background-color: #00ebff;
        cursor: pointer;
    }

    .divPlayerMiniature{
        top: calc(100% - 300px) !important;
        left: calc(100% - 500px) !important;
        width: 400px !important;
        height: 200px !important;
    }
}
</style>
  