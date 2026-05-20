<template>
    <div id="mainSuggestion" style="height: 100%; position: relative;">
        <button id="buttonUp" @click="translateUp()">Up</button>
        <div style="overflow: auto; height: 100%;">
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
            device: "Desktop",
            tabs: ['Suggestion', 'Playlist'] /* , 'Infos', 'Album', 'Concerts' */
        };
    },
    methods: {
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        translateUp(){
            if (this.device == "Mobile"){
                console.log("up")
                if (document.getElementById("mainSuggestion").className == '' || document.getElementById("mainSuggestion").className == 'down') document.getElementById("mainSuggestion").className = 'up'
                else document.getElementById("mainSuggestion").className = 'down'
                console.log(document.getElementById("mainSuggestion").className)
            }
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
        this.device = localStorage.getItem("device")
    }
});
</script>

<style>
    .tabs-header{
        height: 8%;    
        position: sticky;
        top: 0;
        background-color: black;
    }

    #mainSuggestion{
        flex: 0 0 50%;
        height: calc(100vh - 60);
        background-color: black;
        overflow: visible;
        flex-direction: column;
        position: relative;
        z-index: 5;
        max-height: 50%;
    }

    #buttonUp{
        position: absolute;
        top: -20px;
        height: 20px;
        left: 0;
        z-index: 200000;
    }

    #mainSuggestion.up {
        animation: slideUpHalf 1s ease-in-out forwards;
    }
    
    #mainSuggestion.down {
        animation: slideDownHalf 1s ease-in-out forwards;
    }

    .musicSugg{
        z-index: 2;
        margin: 20px;
    }

    @media screen and (min-width: 428px)  {
        #mainSuggestion{
            background-color: rgba(0, 255, 255,0);
            flex: 0 0 25%;
            max-height: 100%;
        }

        .tabs-header{
            height: 4%;    
        }
    }

    @keyframes slideUpHalf {
        from {
            transform: translateY(0);
        }

        to {
            transform: translateY(-100%);
        }
    }

    @keyframes slideDownHalf {
        from {
            transform: translateY(-100%);
        }

        to {
            transform: translateY(0);
        }
    }
</style>