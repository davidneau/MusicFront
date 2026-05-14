<template>
    <div class="mainPlaylists">
        <div id="headerPL">
            <h1>Playlists</h1>
            <button @click="createPlaylistPopup = true">Create Playlist</button>
        </div>
        <div id="playlists2" class="flexCol">
            
            <div v-for="ind in titlePlaylists.length" class="playlistDiv flexRow" :key="ind">
                <h2 style="margin-left: 10px; flex: 0 0 5%;">{{ titlePlaylists[ind-1] }}</h2>
                <div class="flexCol">
                    <button @click="playPlaylist(listPlaylists[ind-1])">Play</button>
                    <button @click="playlistEditPopup=true; titlePlaylistEdit=titlePlaylists[ind-1]; playlistEdit=listPlaylists[ind-1]">Edit</button>
                </div>
                <div style="width: 90%;">
                    <div class="playlist" v-if="Object.keys(listPlaylists[ind-1]).length !== 0">
                        <div v-for="music in listPlaylists[ind-1]" class="playlists" :key="music.Title">
                            <Music :title="music.Title" 
                                :artist="music.Artist" 
                                :img="music.Image" 
                                :videoId="music.id_yt" 
                                from="playlist">
                            </Music>
                        </div>
                    </div>
                    <div v-else>
                        Aucune musiques
                    </div>
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
        <div id="playlistEditPopup" v-show="playlistEditPopup">
            <button class="close-btn" style="right: 10px;" @click="playlistEditPopup=false">×</button>
            <h1 style="margin: 10px;">Editing: {{ titlePlaylistEdit }}</h1>
            <div class="playlist" id="playlistEditing">
                <div v-for="music in playlistEdit" class="playlists" :key="music.Title">
                    <button class="close-btn" @click="deleteSongFromPL(music.id_yt)">×</button>
                    <Music :title="music.Title" 
                        :artist="music.Artist" 
                        :img="music.Image" 
                        :videoId="music.id_yt" 
                        from="playlist">
                    </Music>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { createPlaylist, getPlaylist2, createPlaylist2, deleteSongFromPlaylist } from '@/api';
import Music from '../components/Music.vue';

export default ({
    name: "LoginPage",
    components: {
        Music
    },
    data() {
        return {
            createPlaylistPopup: false,
            playlistEditPopup: false,
            namePlaylist: "",
            titlePlaylists: Array(),
            listPlaylists: Array(),
            playlistEdit: [],
            titlePlaylistEdit: ""
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
        deleteSongFromPL(music_id){
            console.log(music_id)
            let payload = {"music_id": music_id, "playlist": this.titlePlaylistEdit}
            deleteSongFromPlaylist(payload)
            this.playlistEdit = this.playlistEdit.filter(user => user.id_yt !== music_id)
            console.log(this.playlistEdit)
        }
    },
    mounted(){
        this.getPlaylistYT()
    }
})
</script>

<style>

#headerPL{
    margin-top: 10px;
    width: 100%;
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;
}


#headerPL button{
    position: absolute;
    right: 10px;
}

#contentPlaylist{
    display: flex;
}

.playlistDiv{
    color: white;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 15px;
    width: 100%;
    height: 120px;
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
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

#playlistEditPopup{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: green;
    border-radius: 15px;
    border: 1px solid black;
    height: 70vh;
    padding: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.mainPlaylists{
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.playlists{
    color: white;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 15px;
    width: 260px;
    height: 120px;
    margin: 0 10px;
    pointer-events: none;
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
    align-items: center;
    border: 1px solid blue;
    border-radius: 15px;  
    overflow-x: auto;
}

.playlist>div{
    min-width: 260px;
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
    flex: 1;
    gap: 16px;          /* espace entre les enfants */
    overflow-y: auto;   /* scroll vertical */
}

#playlistEditing{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}

#playlistEditing .playlists{
  position: relative;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 0;

  width: 32px;
  height: 32px;

  border: none;
  border-radius: 50%;

  background: red;
  color: white;

  font-size: 22px;
  font-weight: bold;
  line-height: 32px;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  pointer-events: all;
}

.close-btn:hover {
  background: darkred;
}
</style>