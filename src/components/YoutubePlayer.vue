<template>
  <div>
    <button @click="$emit('closeEvent')" id="close">close</button>
    <div id="youtube-player"></div>
  </div>
</template>

<script>
import { insertMusic, getSimilarTrack } from '@/api';

export default {
  name: "YoutubePlayer",
  data() {
    return {
      videoName: "",
      player: null, // L'instance du lecteur YouTube
      isAPIReady: false, // Flag pour savoir si l'API YouTube est prête
      playListCursor: 0,
      playList: [],
      //apiLastFM: `https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${this.currentArtist}&track=${this.currentArtist}&api_key=e8fd7f2b2b20413902b17196069c8a67&format=json`,
    };
  },
  mounted() {
    // On expose l'instance Vue sur `window` pour y accéder depuis l'API YouTube
    window.vueInstance = this;
    this.loadYouTubeAPI();
  },
  methods: {
    // Charge l'API YouTube
    loadYouTubeAPI() {
      if (window.YT) {
        // Si l'API est déjà présente, on appelle directement la méthode de Vue
        this.onYouTubeIframeAPIReady();
      } else {
        // Si l'API n'est pas encore disponible, on charge le script
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.onload = () => {
          // Une fois le script chargé, on appelle la fonction `onYouTubeIframeAPIReady`
          this.onYouTubeIframeAPIReady();
        };
        document.body.appendChild(script);
      }
    },
    // Fonction appelée par YouTube lorsque l'API est prête
    onYouTubeIframeAPIReady() {
      if (window.YT && window.YT.Player) {
        this.isAPIReady = true;
        this.createPlayer();
      } else {
        console.error("L'API YouTube n'est pas encore prête.");
      }
    },
    // Crée l'instance du lecteur YouTube
    createPlayer() {
      if (this.isAPIReady) {
        this.player = new window.YT.Player('youtube-player', {
          videoId: 'dQw4w9WgXcQ', // ID de la vidéo initiale
          events: {
            'onStateChange': this.onPlayerStateChange
          }
        });
      } else {
        console.error("L'API YouTube n'est pas encore prête.");
      }
    },
    // Gère les changements d'état du lecteur
    onPlayerStateChange(event) {
      if (event.data === window.YT.PlayerState.ENDED) {
        console.log('La vidéo est terminée');
        this.playNewVideo("")
      }
    },
    setPlayList(playList){
        this.playList = playList
        console.log("playList set to :", this.playList)
    },
    // Change la vidéo avec un nouvel ID
    playNewVideo(videoId, videoName) {
        if (this.player) {
            if (videoId == ""){
              getSimilarTrack(this.videoName)
              .then(async (response) => {
                console.log("response", response)
                let musicVideos = await this.$parent.APIytSearch(response.data)
                console.log('Résultats de la recherche :', musicVideos);
                this.videoName = musicVideos[0]["snippet"]['localized']['title']
                this.player.loadVideoById(musicVideos[0].id);
                
                let title = response.data.split("-")[0]
                let artist = response.data.split("-")[1]
                let id_yt = musicVideos[0].id
                let payload = {"title": title,
                               "artist": artist,
                               "id_yt": id_yt,
                               "Clicked": false
                }

                insertMusic(payload)
                })
            }
            else {
              this.player.loadVideoById(videoId); // Charge une nouvelle vidéo
              this.videoName = videoName
            }
        } else {
            console.error("Le lecteur YouTube n'est pas encore prêt.");
        }
    }
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

#youtube-player{
    width: 100%;
    height: 100%;
}

#close{
  position: absolute;
  top: 5px;
  right: 5px;
}

@media screen and (min-width: 428px)  {
    
  #close{
    top: -30px;
  }
}

</style>