<template>
    <div class="mainPlaylists">
        <!-- <div style="visibility: hidden;">
            <h4 style="color:white">Enter the Playlist ID from youtube :</h4>
            <input type="text" id="playlistID" style="width: 200px;" @keypress="createPlaylist">
        </div>
        <div id="playlists" style="visibility: hidden;">
            <div style="color:white">Playlist from yt</div>
            <div id="contentPlaylist"></div>
        </div> -->
        <h1>Playlists</h1>
        <div id="playlists2">
            <button @click="createPlaylistPopup = true">Create Playlist</button>
            
            <div v-for="ind in titlePlaylists.length" class="playlists" :key="ind">
                <h2 style="margin-left: 20px;">{{ titlePlaylists[ind-1] }}</h2>
                <button @click="playPlaylist(listPlaylists[ind-1])">Play</button>
                <div style="width: 90%;" v-if="Object.keys(listPlaylists[ind-1]).length !== 0">
                    <div class="playlist">
                        <div v-for="music in listPlaylists[ind-1]" class="playlists" :key="music.Title">
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
            <div>
                <button @click="createPlaylistPopup = false">Annuler</button>
                <button @click="createPlaylistYT">Create Playlist</button>
            </div>
        </div>
    </div>
</template>


<script>
import { createPlaylist, getPlaylist2, createPlaylist2 } from '@/api';
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

#playlistPopup{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background-color: green;
    border-radius: 15px;
    border: 1px solid black;
    height: 15vh;
    padding: 10px;
}

.mainPlaylists{
    margin-top: 20px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.playlists{
    color: white;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 15px;
    min-width: 15%;
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

.playlists>div{
    margin-left: 0;
    margin-right: 0;
    padding-left: 20px;
    padding-right: 5px;
}

.playlists>div>img{
    z-index: 20;
}

.playlist>div>div{
    overflow: hidden;
}

.textMusicDiv>h2{
    overflow: hidden;
    white-space: nowrap;
    transition: transform 0.5s linear;
}

.textMusicDiv:hover h2 {
    animation: scroll-text 5s linear forwards;
}

@keyframes scroll-text {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

#playlists2{
    margin-top: 50px;
    width: 100%;
}
</style>