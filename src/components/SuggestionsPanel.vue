<template>
    <div id="mainSuggestion">
        <div v-for="music in listMusics" :key="music">
            <Music :title="music.name" :artist="music.artist.name" videoId="none" from="search"></Music>
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
        flex: 0 0 30%;
        height: calc(100vh - 91px);
        background-color: #2196f3;
        overflow: auto;
    }
</style>