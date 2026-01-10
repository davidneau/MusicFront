<template>
  <div id="mainDescription">
    <h1>{{ Title }}</h1>
    <h3>{{ Artist }}</h3>
    <div id="Lyrics"></div>
  </div>
</template>

<script>
import { getLyrics } from '@/api';

export default {
  name: "DescriptionVideo",
  data() {
    return {
        Title: "",
        Artist: ""
    };
  },
  methods: {
    setLyrics() {
        getLyrics(this.Artist, this.Title)
        .then(async (response) => {
            console.log("Lyrics", response.data)
            document.getElementById("Lyrics").innerText = response.data
        })
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
}

#Lyrics{
    width: 25%;
    overflow: auto;
}

</style>