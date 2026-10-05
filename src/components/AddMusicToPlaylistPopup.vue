<template>
    <div class="playlistPopup" style="flex-direction: column; z-index: 100000;">
        <button class="closePp" @click="$emit('closePopup')">X</button>
        <h1>Add to playlist :</h1>
        <div v-for="pl in Object.keys(playlistStore.playlists)" :key="pl" class="divPlaylist" tabindex="0" @click="addSongToPlaylistYT">
            {{ pl }}
        </div>
    </div>
</template>


<script>
import { addSongToPlaylist } from '@/api';
import { usePlaylistStore } from '@/stores/playlist';

export default ({
    name: "AddMusicToPlaylistPopup",

    data(){
        return{
            videoID: "",
            playlistStore: usePlaylistStore()
        }
    },
    props: ["music_id"],
    methods: {
        addSongToPlaylistYT(event){
            this.videoID = this.music_id
            addSongToPlaylist({videoID: this.playlistStore.musicIdToAdd, nomPlaylist: event.target.innerText})
            .then(() => {
                alert(`l'id de la video ${this.playlistStore.musicIdToAdd} a été ajouté à la playlist ${event.target.innerText}`)
                this.$emit("closePopup")
            })
        },
    },
    mounted(){
        //this.loadPlaylist()
        console.log("init playlist :", this.playlistStore.playlists)
    }
});
</script>

<style>

.closePp{
    background-color: red;
    position: absolute;
    top: -10px;
    right: -10px;
    color: white;
    border-radius: 50%;
    cursor: pointer;
}

.divPlaylist{
    border: 1px solid black;
    width: 80%;
    border-radius: 5px;
    font-size: large;
    font-weight: bold;
    text-align: center;
    padding: 5px 0;
    cursor: pointer;
}

.playlistPopup{
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -20%);
    background-color: green;
    border: 1px solid black;
    border-radius: 15px;
    height: 80vh;
    width: 30vw;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    color: white
}

@media screen and (max-width: 428px)  {
    .playlistPopup{
        left: 10% !important;
        width: 80% !important;
        transform: translate(0, -20%) !important;
    }
}

</style>