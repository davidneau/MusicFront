<template>
    <div class="musicDiv btn-menu">
        <div @click="handleClick" class="flexRow">
            <img v-if="img == 'https://upload.wikimedia.org/wikipedia/commons/9/97/Music_-_The_Noun_Project.svg'" style='filter: invert(1);' :src=img height="60px" width="60px">
            <img v-else :src=img height="60px" width="60px" referrerpolicy="no-referrer">
            <div class="textMusicDiv">
                <h2>{{ title }}</h2>
                <h3>{{ artist }}</h3>
                <h3>{{ album }}</h3>
            </div>
        </div>
        <button v-if="btnATP" @click="open_amtp_popup_fct">Add to playlist</button>
    </div>
</template>


<script>
/* import { getMusic } from '@/api'; */
import { inject } from 'vue'
import { ON_ITEM_CLICK, OPEN_AMTP_POPUP } from "@/api"

export default ({
    setup(props) {
        const onItemClick = inject(ON_ITEM_CLICK)
        if (!onItemClick) throw new Error("onItemClick not injected!")
        let payload = {
            "from": props.from,
            "title": props.title,
            "artist": props.artist,
            "id": props.videoId,
            "id_clip": props.id_clip
        }

        const handleClick = () => onItemClick(payload)

        
        const open_amtp_popup = inject(OPEN_AMTP_POPUP)
        if (!open_amtp_popup) throw new Error("open_amtp_popup not injected!")
        const open_amtp_popup_fct = () => open_amtp_popup(props.videoId)

        return { handleClick, open_amtp_popup_fct }
    },
    data(){
        return {
        }
    },
    name: "divMusic",
    props: ["title", "artist", "album", "img", "videoId", "from", "id_clip", "btnATP"]
});
</script>

<style>
    .flexRow{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .musicDiv{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin: 10px;
    }
    
    .musicDiv img{
        margin-right: 10px;
    }

    .musicDiv h2,h3{
        margin: 0px;
    }
</style>