<template>
  <div id="mainDescription">
    <!-- Onglets -->
    <div class="tabs-header">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Contenu -->
    <div class="tabs-content">
        <div v-show="activeTab === 'Lyrics'" id="LyricsTab">
            <h1>{{ Title }}</h1>
            <h3>{{ Artist }}</h3>
            <div id="Lyrics"></div>
        </div>
        <div v-show="activeTab === 'Suggestions'" style="height: 100%;">
            <SuggestionsPanel ref="suggDesc"></SuggestionsPanel>
        </div>
    </div>
  </div>
</template>

<script>
import { getLyrics } from '@/api';
import SuggestionsPanel from './SuggestionsPanel.vue';

export default {
    name: "DescriptionVideo",
    components: {
        SuggestionsPanel
    },
    data() {
        return {
            Title: "",
            Artist: "",
            activeTab: "Lyrics",
            tabs: ['Lyrics', 'Suggestions']
        };
    },
    methods: {
        setLyrics() {
            getLyrics(this.Artist, this.Title)
            .then(async (response) => {
                console.log("Lyrics", response.data)
                document.getElementById("Lyrics").innerText = response.data
            })
        },
        fillDivSugg(list){
            this.$refs.suggDesc.fillDiv(list)
        }
    },
    mounted() {
    }
};

// Fonction globale fournie par YouTube qui est appelée quand l'API est prête
window.onYouTubeIframeAPIReady = function() {
  if (window.vueInstance) {
    window.vueInstance.onYouTubeIframeAPIReady(); // Appelle la méthode de l'instance Vue
  }
};
</script>

<style>

#mainDescription{
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 50%;
}
.tabs-header{
    max-height: 8%;
}
.tabs-content{
    width: 90%;
    max-height: 92%;
}

#LyricsTab{
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 100%;
}

#LyricsTab h1,h2,h3{
    margin: 0;
    flex: 0 0 10%;
}


#Lyrics{
    overflow: auto;
    max-height: 80%;
}

@media screen and (min-width: 428px)  {
}

</style>