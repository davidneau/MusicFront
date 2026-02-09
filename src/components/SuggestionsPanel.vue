<template>
    <div id="mainSuggestion" style="height: 100%;">
        <div v-for="music in listMusics" class="musicSugg" :key="music">
            <Music :title="music.name" :artist="music.artist.name" :img="music.Image" videoId="none" from="search"></Music>
        </div>
    </div>
</template>

<script>
import Music from './Music.vue';

export default ({
    name: "SuggestionPanel",
    components: {
        Music
    },
    data() {
        return {
            listMusics: Array()
        };
    },
    methods: {
        fillDiv(list){
            console.log("fill suggestion div :", list)
            this.listMusics = list
        }
    },
    async mounted() {
    }
});
</script>

<style>
    #mainSuggestion{
        flex: 0 0 25%;
        height: calc(100vh - 60);
        background-color: black;
        overflow: auto;
        flex-direction: column;
    }

    .musicSugg{
        margin: 20px;
    }
</style>