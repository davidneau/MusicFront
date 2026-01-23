<template>
    <div>
        <div>
            <h4 style="color:white">Enter the Playlist ID from youtube :</h4>
            <input type="text" id="playlistID" style="width: 200px;" @keypress="createPlaylist">
        </div>
        <div id="playlists">
            <div style="color:white">Playlist from yt</div>
            <div id="contentPlaylist">

            </div>
        </div>
    </div>
</template>


<script>
import { createPlaylist, getPlaylist } from '@/api';

export default ({
    name: "LoginPage",
    methods: {
        createPlaylist() {
            let playlistId = document.getElementById("playlistID").value
            let payload = {"name": "playlist YT 1", "playlistID": playlistId, "fromYT": true}
            createPlaylist(payload)
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
    },
    mounted(){
        this.getPlaylist()
    }
})
</script>

<style>

#contentPlaylist{
    display: flex;
}
</style>