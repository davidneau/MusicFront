<template>
    <div id="blur"></div>
    <div id="bannerSearch">
        <div v-if="userConnected">
            <input type="text" id="search" @keyup.enter="search" ref="searchInput" value="21 pilots">
            <button @click="search(true)">Search</button>
        </div>
    </div>
    <div id="searchResult"></div>
    <div id="home">
        <div id="replay">
            
        </div>
        <div id="historique">
            
        </div>
    </div>
    <YoutubePlayer ref="youtubePlayer" id="player" @closeEvent="close" @searchEvent="search"/>
</template>

<script>
import YoutubePlayer from '../components/YoutubePlayer.vue';
import { searchYT, insertMusic, loadHistorique, loadReplay } from '../api';

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

            document.getElementById("blur").onclick = () => {
                this.close()
            }

            let histo = await loadHistorique()
            let replay = await loadReplay()

            console.log(histo)
            console.log(replay)

            histo.data.forEach(item => {
                console.log(item)
                let div = document.createElement("div")
                div.id = item[2]
                div.className = "searchOneResult"

                div.onclick = () => {
                    this.video_playing = true
                    this.$refs.youtubePlayer.playNewVideo(item[2], item[6]);
                    document.getElementsByTagName("body")[0].style.overflow = "hidden"
                    document.getElementById("player").style.display = "block"
                    document.getElementById("player").classList.remove("playerMiniature")
                    document.getElementById("player").classList.remove("playerMiniatureMobile")
                    document.getElementById("blur").style.display = "block"
                    document.getElementById("blur").style.height = document.getElementById("searchResult").clientHeight + "px"
                    if (this.device == "Mobile") {
                        document.getElementById("searchResult").style.overflow = "hidden"
                    }
                    insertMusic({"id_yt": item[2], "searchStr": item[6], "Clicked": true})
                    /* listenMusic({"id_yt": item.id, "artist": artistAndTitle.data[0], "title": artistAndTitle.data[1], "click": true}) */
                }

                let img = document.createElement("img")
                img.src = item["img"]
                div.appendChild(img)

                let divDesc = document.createElement("div")
                divDesc.className = "divDesc"

                let title = document.createElement("h2")
                title.textContent = item[6]
                
                let artist = document.createElement("h2")
                artist.textContent = item[7]

                divDesc.appendChild(title)
                divDesc.appendChild(artist)
                

                div.appendChild(divDesc)

                document.getElementById("historique").appendChild(div)
            });
        },
        close(){
            console.log(this.video_playing)
            if (this.video_playing) {
                this.video_playing = false
                document.getElementById("blur").style.display = "none"
                document.getElementsByTagName("body")[0].style.overflow = "visible"
                if (this.device == "Desktop") document.getElementById("player").classList.add("playerMiniature")
                else document.getElementById("player").classList.add("playerMiniatureMobile")
            }
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
                let musicVideos = await searchYT(this.$refs.searchInput.value)
                .then(response =>{
                    // Afficher les résultats
                    console.log('Résultats de la recherche :', response.data);

                    this.$refs.youtubePlayer.setPlayList(response.data);
                    
                    document.getElementById("searchResult").innerHTML = ""

                    if (fillDivSearch){
                        // Exemple d'affichage de titres et de vidéos
                        response.data.forEach(item => {
                            let div = document.createElement("div")
                            div.id = item.id
                            div.className = "searchOneResult"

                            div.onclick = () => {
                                this.video_playing = true
                                this.$refs.youtubePlayer.playNewVideo(item.id, item["titre"]);
                                document.getElementsByTagName("body")[0].style.overflow = "hidden"
                                document.getElementById("player").style.display = "block"
                                document.getElementById("player").classList.remove("playerMiniature")
                                document.getElementById("player").classList.remove("playerMiniatureMobile")
                                document.getElementById("blur").style.display = "block"
                                document.getElementById("blur").style.height = document.getElementById("searchResult").clientHeight + "px"
                                if (this.device == "Mobile") {
                                    document.getElementById("searchResult").style.overflow = "hidden"
                                }
                                insertMusic({"id_yt": item.id, "searchStr": item["titre"], "Clicked": true})
                                /* listenMusic({"id_yt": item.id, "artist": artistAndTitle.data[0], "title": artistAndTitle.data[1], "click": true}) */
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
    }
});
</script>

<style scopped>
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
    width: 50%;
    margin-top: 10px;
    margin-bottom: 10px;
    border: 1px solid black;
    border-radius: 15px;
    padding: 10px;
    background-color: burlywood;
    cursor: pointer;
}

.searchOneResult h2{
    margin-left: 10px;
}

#player {
    display: none;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
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
    top: calc(100% - 300px) !important;
    left: calc(100% - 500px) !important;
    width: 400px !important;
    height: 200px !important;
}

.playerMiniatureMobile{
    bottom: 0 !important;
    left: 30% !important;
    width: 70% !important;
    height: 200px !important;
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
}
</style>
  