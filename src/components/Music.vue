<template>
    <div @click="handleClick" class="musicDiv btn-menu">
        <img v-if="img == 'https://upload.wikimedia.org/wikipedia/commons/9/97/Music_-_The_Noun_Project.svg'" style='filter: invert(1);' :src=img height="60px" width="60px">
        <img v-else :src=img height="60px" width="60px">
        <div>
            <h2>{{ title }}</h2>
            <h3>{{ artist }}</h3>
            <h3>{{ album }}</h3>
        </div>
    </div>
</template>


<script>
/* import { getMusic } from '@/api'; */
import { inject } from 'vue'
import { ON_ITEM_CLICK } from "@/api"

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

        return { handleClick }
    },
    name: "divMusic",
    props: ["title", "artist", "album", "img", "videoId", "from", "id_clip"],
    methods: {
    }
});
</script>

<style>
    .musicDiv{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 10px;
    }
    
    .musicDiv img{
        margin-right: 10px;
    }

    .musicDiv h2,h3{
        margin: 0px;
    }
</style>