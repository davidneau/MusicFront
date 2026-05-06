<template>
    <div>
        <div>
            <h4 style="color:white">Enter the Playlist ID from youtube :</h4>
            <input type="text" id="playlistID" style="width: 200px;" @keypress="createPlaylist">
        </div>
        <div id="playlists">
            <div style="color:white">Playlist from yt</div>
            <div id="contentPlaylist"></div>
        </div>
        <div id="playlists2">
            <button @click="createPlaylistPopup = true">Create Playlist</button>
            
            <div v-for="ind in titlePlaylists.length" class="playlists" :key="ind">
                <h2 style="margin-left: 20px;">{{ titlePlaylists[ind-1] }}</h2>
                <button @click="playPlaylist(listPlaylists[ind-1])">Play</button>
                <div v-if="Object.keys(listPlaylists[ind-1]).length !== 0">
                    <div class="playlist">
                        <div v-for="music in listPlaylists[ind-1]" id="playlists" :key="music.Title">
                            <Music :title="music.Title" 
                                :artist="music.Artist" 
                                :img="music.Image" 
                                :videoId="music.id_yt" 
                                from="playlist">
                            </Music>
                        </div>
                    </div>
                </div>
                <div v-else>
                    Aucune musiques
                </div>
            </div>
        </div>
        <div id="playlistPopup" v-show="createPlaylistPopup">
            <div>
                <p>Name :</p>
                <input type="text" v-model="namePlaylist">
            </div>
            <button @click="createPlaylistYT">Create Playlist</button>
        </div>
    </div>
</template>


<script>
import { createPlaylist, getPlaylist, getPlaylist2, createPlaylist2 } from '@/api';
import Music from '../components/Music.vue';

export default ({
    name: "LoginPage",
    components: {
        Music
    },
    data() {
        return {
            createPlaylistPopup: false,
            namePlaylist: "",
            titlePlaylists: Array(),
            listPlaylists: Array()
        }
    },
    methods: {
        playPlaylist(playlist){
            console.log(playlist)
            this.$emit("playvideo", {"playlist": playlist.map((el) => el.id_yt), "from": "playlist"})
            this.$emit("displayPlaylist", {"playlist": playlist})
        },
        createPlaylist() {
            let playlistId = document.getElementById("playlistID").value
            let payload = {"name": "playlist YT 1", "playlistID": playlistId, "fromYT": true}
            createPlaylist(payload)
        },
        createPlaylistYT() {
            let payload = {"nomPlaylist": this.namePlaylist}
            createPlaylist2(payload)
            .then(() => {
                alert(`La playlist ${this.namePlaylist} a bien été créée`)
                this.createPlaylistPopup = false
            })
        },
        getPlaylist() {
            getPlaylist("playlist YT 1")
            .then((response) => {
                response.data.forEach(item => {
                    let div = document.createElement("div")
                    div.id = item.id
                    div.className = "searchOneResult"

                    div.onclick = () => {
                        console.log("item", item)

                        this.$emit('descriptionUpdate', {"title": item['Title'], "artist": "no data"})
                        this.$emit('playvideo', {"id": item["id"], 
                                                 "from": "playlist", 
                                                 "title": item["Title"], 
                                                 "artist": ""})
                        this.$emit('changeplaylist', {"playlist": response.data})

                        document.getElementById("player").style.display = "block"
                        document.getElementById("divPlayer").style.display = "flex"
                        document.getElementById("divPlayer").classList.remove("playerMiniature")
                        document.getElementById("divPlayer").classList.remove("playerMiniatureMobile")
                        document.getElementById("divPlayer").style.visibility = "visible"
                        document.getElementById("player").style.visibility = "visible"
                    }

                    console.log(item)
                    let img = document.createElement("img")
                    img.src = item["img"]
                    div.appendChild(img)

                    let divDesc = document.createElement("div")
                    divDesc.className = "divDesc"

                    let title = document.createElement("h2")
                    title.textContent = item["Title"]

                    divDesc.appendChild(title)

                    div.appendChild(divDesc)

                    document.getElementById("contentPlaylist").appendChild(div)
                });
            })
        },
        getPlaylistYT() {
            getPlaylist2()
            .then((response) => {
                console.log(response.data.Playlist)
                let pls = response.data.Playlist
                Object.keys(pls).forEach((el) => {
                    this.titlePlaylists.push(el)
                    this.listPlaylists.push(pls[el])
                })
                console.log(this.titlePlaylists)
                console.log(this.listPlaylists)
            })
        },
    },
    mounted(){
        this.getPlaylistYT()
    }
})
</script>

<style>

#contentPlaylist{
    display: flex;
}

.playlists{
    color: white;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: 1px solid white;
    border-radius: 15px;
    height: 150px;
}

.playlists>div{
    flex: 0 0 90%;
}

.playlists>button{
    flex: 0 0 2%;
}

.playlists>h2{
    flex: 0 0 5%;
}

.playlist{
    color: white;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    border: 1px solid blue;
    border-radius: 15px;  
    overflow-x: auto;
}

.playlist>div{
    min-width: 15%;
}

#playlists2{
    margin-top: 50px;
}
</style>