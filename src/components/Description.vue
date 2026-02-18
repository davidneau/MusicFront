<template>
  <div id="mainDescription">
    <div>
        <div class="loaderLogo" id="logoDesc"></div>
    </div>
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
        <div v-show="activeTab === 'Lyrics'" id="LyricsTab">
            <h1>{{ Title }}</h1>
            <h3>{{ Artist }}</h3>
            <div id="Lyrics"></div>
        </div>
    </div>
  </div>
</template>

<script>
import { getLyrics } from '@/api';

export default {
    name: "DescriptionVideo",
    props: ['device'],
    data() {
        return {
            Title: "",
            Artist: "",
            activeTab: "Lyrics",
            tabs: ['Lyrics'] /* , 'Infos', 'Album', 'Concerts' */
        };
    },
    methods: {
        setLyrics() {
            getLyrics(this.Artist, this.Title)
            .then(async (response) => {
                console.log("Lyrics", response.data)
                document.getElementById("Lyrics").innerText = response.data
                document.getElementById("logoDesc").style.display = "none"
            })
        },
        fillDivSugg(list){
            this.$refs.suggDesc.fillDiv(list)
        }
    },
    mounted() {
        if (this.device == "Mobile") this.tabs.append("Suggestion")
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
    position: relative;
    z-index: 2;
    margin-top: 0;
    background-color: black;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    flex: 0 0 25%;
}

.tabs-content{
    width: 90%;
    max-height: 92%;
}

.tabs-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    max-height: 8%;
    width: 100%;
}

.tab-btn {
  position: relative;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #0ff;
  background: transparent;
  border: 2px solid #0ff;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.25s ease;
  text-transform: uppercase;

  /* Glow */
  box-shadow: 0 0 8px #0ff, inset 0 0 8px #0ff;
}

.tab-btn:hover {
  color: #fff;
  background: rgba(0, 255, 255, 0.1);
  box-shadow: 0 0 15px #0ff, inset 0 0 15px #0ff;
  transform: translateY(-2px);
}

.tab-btn.active {
  color: #000;
  background: #0ff;
  box-shadow: 0 0 20px #0ff, inset 0 0 20px #0ff;
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
    #mainDescription{
        margin-top: 10px;
        height: calc(100% - 10px);
        background-color: rgba(0, 255, 255, 0);
    }
}

</style>