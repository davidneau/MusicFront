<template>
    <div id="mainSuggestion" style="height: 100%; position: relative;">
        <!-- Onglets -->
        <div class="tabs-header">
            <button
                v-for="tab in tabs"
                :key="tab"
                :class="['tab-btn', 'active' && activeTab === tab ]"
                @click="activeTab = tab"
            >
                {{ tab }}
            </button>
        </div>

        <!-- Contenu -->
        <div class="tabs-content">
            <div v-show="activeTab === 'Suggestion'" id="suggTab">
                <div>
                    <div class="loaderLogo" id="logoSugg"></div>
                </div>
                <div v-for="music in listMusics" class="musicSugg" :key="music.Title">
                    <Music :title="music.Title" 
                        :artist="music.Artist" 
                        :img="music.Image" 
                        videoId="none" 
                        from="search">
                    </Music>
                </div>
            </div>
            <div v-show="activeTab === 'Playlist'" id="playlistTab">
                <div>
                    <div class="loaderLogo" id="logoSugg"></div>
                </div>
                <div v-for="music in listPlaylist" class="musicSugg" :key="music.Title">
                    <Music :title="music.Title" 
                        :artist="music.Artist" 
                        :img="music.Image" 
                        videoId="none" 
                        from="search">
                    </Music>
                </div>
            </div>
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
            listMusics: [],
            listPlaylist: [],
            activeTab: "Suggestion",
            tabs: ['Suggestion', 'Playlist'] /* , 'Infos', 'Album', 'Concerts' */
        };
    },
    methods: {
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        async fillDiv(list){
            this.listMusics = []
            console.log("fill suggestion div :", list)
            for (const music of list) {
                this.listMusics.push(music)
                await this.sleep(100)
                await this.$nextTick()
            }

            document.getElementById("logoSugg").style.display = "none"
        },
        async fillPlaylist(list){
            this.listMusics = []
            console.log("fill playlist div :", list)
            for (const music of list) {
                this.listPlaylist.push(music)
                await this.sleep(100)
                await this.$nextTick()
            }

            document.getElementById("logoSugg").style.display = "none"
        }
    },
    async mounted() {
    }
});
</script>

<style>
    #mainSuggestion{
        margin-top: 10px;
        flex: 0 0 25%;
        height: calc(100vh - 60);
        background-color: black;
        overflow: auto;
        flex-direction: column;
    }

    .musicSugg{
        z-index: 2;
        margin: 20px;
    }

    @media screen and (min-width: 428px)  {
        #mainSuggestion{
            background-color: rgba(0, 255, 255,0);
        }
    }

</style>