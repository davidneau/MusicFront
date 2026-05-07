<template>
    <div class="playlistPopup" style="flex-direction: column; z-index: 100000;">
        <h1>Add to playlist :</h1>
        <select id="selectPlaylistPopup">
        </select>
        <div>
            <button @click="addSongToPlaylistYT">Ok</button>
            <button @click="$emit('closePopup')">Annuler</button>
        </div>
    </div>
</template>


<script>
import { addSongToPlaylist, getPlaylist2 } from '@/api';

export default ({
    name: "AddMusicToPlaylistPopup",

    data(){
        return{
            videoID: ""
        }
    },
    props: ["music_id"],
    methods: {
        loadPlaylist(){
            getPlaylist2()
            .then((response) => {
                document.getElementById("selectPlaylistPopup").innerHTML = ""
                console.log(response.data.Playlist)
                let playlists = response.data.Playlist
                Object.keys(playlists).forEach((key) => {
                    console.log(key)
                    let option = document.createElement("option")
                    option.value = key
                    option.innerText = key
                    document.getElementById("selectPlaylistPopup").appendChild(option)
                })
            })
        },
        addSongToPlaylistYT(){
            this.videoID = this.music_id
            console.log({videoID: this.videoID, nomPlaylist: document.getElementById("selectPlaylistPopup").value})
            addSongToPlaylist({videoID: this.videoID, nomPlaylist: document.getElementById("selectPlaylistPopup").value})
            .then(() => {
                alert(`l'id de la video ${this.videoID} a été ajouté à la playlist ${document.getElementById("selectPlaylistPopup").value}`)
                this.$emit("closePopup")
            })
        },
    },
    mounted(){
        //this.loadPlaylist()
    }
});
</script>

<style>
</style>