<template>
    <div @click="handleClick" class="musicDiv btn-blue-glass">
        <img :src=img height="60px" width="60px">
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
            "id": props.videoId
        }
        
        const handleClick = () => onItemClick(payload)

        return { handleClick }
    },
    name: "divMusic",
    props: ["title", "artist", "album", "img", "videoId", "from"],
    methods: {
    },
    async mounted() {
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