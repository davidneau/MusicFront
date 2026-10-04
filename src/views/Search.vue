<template>
    <div id="mainSearch">
        <div class="searchResultDiv" v-for="musicS in search" :key="musicS">
            <Music 
                :title="musicS['title']" 
                :artist="musicS['artist']"
                :album="musicS['album']"
                :videoId="musicS['id']"
                :id_clip="musicS['id_clip']"
                :img="musicS['img']"
                :btnATP=true
                from="search"
            ></Music>
        </div>
    </div>
</template>

<script>
import Music from '@/components/Music.vue';
import { searchMusic } from '@/api';

export default ({
    name: "SearchPage",
    props: ["userConnected", "device"],
    components: {
        Music
    },
    data() {
        return {
            search: Array(),
        };
    },
    methods: {
        async init(){
            const params = new URLSearchParams(window.location.search);
            const search_str = params.get("search_str");
            console.log(search_str)
            let search = await searchMusic(search_str)
            console.log(search.data)
            this.search = search.data
        }
    },
    watch: {
        '$route.query.search_str': {
            handler() {
                this.init()
            },
            immediate: true
        }
    },
    async mounted() {
        this.init()
        document.title = 'MusicDA';
    },
    unmounted(){
        this.$emit('reduire')
    }
});
</script>

<style>

.searchResultDiv{
    width: 50%;
    padding-left: 25%;
}

#mainSearch {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: calc(100vh - 60px);
    overflow-y: auto;     /* scroll vertical seulement si besoin */
    overflow-x: hidden; 
}

.searchOneResult {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 90%;
    margin-top: 10px;
    margin-bottom: 10px;
    border: 1px solid black;
    border-radius: 15px;
    padding: 10px;
    background-color: #00ebff;
    cursor: pointer;
}

.searchOneResult h2{
    margin-left: 10px;
}

#searchDiv{
    display: flex;
    flex-direction: row;
}</style>