<template>
  <div id="mainDescription">
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
        getLyrics(this.Artist + "(sep)" + this.Title)
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
}

</style>