<template>
    <div style="position: relative;">
        <div id="background">
            <div class="loaderLogo" id="logoPlayer" style="display: block;"></div>
        </div>
        <button id="btn-agrandir" style="visibility: hidden;" @click="$emit('agrandir')">⛶</button>
        <div id="youtube-player" style="z-index: 2; position: absolute;"></div>
        <div id="subPlayer">
            <div>
                <button @click="previous">Prev</button>
                <button @click="next">Next</button>
            </div>
            <button @click="showAddPlaylistPopup = true">Add to playlist</button>
        </div>

        <div class="playlistPopup" v-show="showAddPlaylistPopup" style="flex-direction: column; z-index: 100000;">
            <h1>Add to playlist :</h1>
            <select id="selectPlaylist">
            </select>
            <button @click="addSongToPlaylistYT">Ok</button>
        </div>
        
        <div v-if="showHumanPopup" class="human-popup-overlay">
            <div class="human-popup">
                <p>Cliquer pour continuer la lecture</p>
                <button @click="resumeAfterHumanClick">OK</button>
            </div>
        </div>
        <audio id="player" controls></audio>
    </div>
</template>

<script>
import { getSimilarTrack, getMusicFromVideoID, addSongToPlaylist } from '@/api';

export default {
  name: "YoutubePlayer", 
  props: ["device"],
  data() {
    return {
        videoName: "",
        player: null,
        isAPIReady: false,
        playListCursor: 0,
        playList: [],
        videoIdCurrentlyPlayed: "",
        isTransitioning: false,
        watchdogTimer: null,
        endTimer: null, // ⬅️ timer pour le delay après la fin
        watchdogDelay: 6000,
        hasStarted: false,
        playlistLoaded: false,
        showHumanPopup: false,
        humanActionResolver: null,
        autoPlayCount: 0,
        lastPlaylistIndex: -1,
        lastVideoId: null,
        showAddPlaylistPopup: false,
        isPlaying: false,
        wasPlayingWhenHidden: false,
        backgroundResumeCount: 0,
    };
  },
  
  mounted() {
    window.vueInstance = this;
    this.loadYouTubeAPI();
  },

  unmounted(){
    const audio = document.getElementById("player");

    audio.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

    async function playMusic() {
        try {
            await audio.play();
        } catch (e) {
            console.error(e);
        }
    }

    playMusic()
  },

  methods: {
    handleVisibilityChange() {
        if (document.hidden) {
            this.wasPlayingWhenHidden = this.isPlaying;
        } else {
            if (this.wasPlayingWhenHidden) {
            this.wasPlayingWhenHidden = false;
            this.backgroundResumeCount = 0; // ← reset
            setTimeout(() => this.player?.playVideo(), 300);
            }
        }
    },

    addSongToPlaylistYT(){
        const currentIndex = this.player.getPlaylistIndex?.();
        const playlist2 = this.player.getPlaylist?.() || [];
        const currentVideoId = playlist2[currentIndex] || this.player.getVideoData?.().video_id;
        let playlist = document.getElementById("selectPlaylist").value
        console.log({videoID: currentVideoId, nomPlaylist: playlist})
        addSongToPlaylist({videoID: currentVideoId, nomPlaylist: playlist})
        .then(() => {
            alert(`l'id de la video ${currentVideoId} a été ajouté à la playlist ${playlist}`)
            this.showAddPlaylistPopup = false
        })
    },
    next(){
        this.player.nextVideo()
    },
    previous(){
        this.player.previousVideo()
    },
    waitForHumanClick() {
        return new Promise((resolve) => {
            this.humanActionResolver = resolve;
            this.showHumanPopup = true;
        });
    },

    resumeAfterHumanClick() {
        this.showHumanPopup = false;

        if (this.pendingHumanResume) {
            this.pendingHumanResume = false;
            this.player.playVideo();
        }
    },

    confirmHumanAction() {
        this.showHumanPopup = false;

        // Optionnel : log pour debug
        console.log("✅ Clic humain détecté");

        if (this.humanActionResolver) {
            this.humanActionResolver();
            this.humanActionResolver = null;
        }
    },
    loadYouTubeAPI() {
        if (window.YT && window.YT.Player) {
            this.onYouTubeIframeAPIReady();
        } else {
            const script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(script);
        }
    },

    onYouTubeIframeAPIReady() {
        if (window.YT && window.YT.Player) {
            this.isAPIReady = true;
            this.createPlayer();
        } else {
            console.error("L'API YouTube n'est pas encore prête.");
        }
    },

    createPlayer() {
      if (!this.isAPIReady) {
        console.error("L'API YouTube n'est pas encore prête.");
        return;
      }

      this.player = new window.YT.Player('youtube-player', {
        videoId: '',
        playerVars: {
            rel: 0,
            modestbranding: 1,
            controls: 1,
            autoplay: 1,
            origin: window.location.origin
        },
        events: {
          onStateChange: this.onPlayerStateChange,
          onError: this.onPlayerError
        }
      });
    },

    onPlayerError(event) {
      console.warn("Erreur YouTube :", event.data);
      clearTimeout(this.watchdogTimer);
      clearTimeout(this.endTimer);
      this.skipToNext();
    },

    skipToNext() {
      this.isTransitioning = false;
      clearTimeout(this.watchdogTimer);
      clearTimeout(this.endTimer);

      // Si on a encore une vidéo dans la playlist
      if (this.playList.length > 0 && this.playListCursor + 1 < this.playList.length) {
        this.playListCursor += 1;
        const music = this.playList[this.playListCursor];

        this.playNewVideo(
          music.id,
          `${music.Title || ""}`,
          "playlist",
          music.Title || "",
          music.Artist || "no Data"
        );
      } else {
        // Fin de playlist ou pas de playlist
        this.playList = [];
        this.playListCursor = 0;

        // Lance la logique auto (ta logique existante)
        this.$emit("playvideo", { from: "automatic" });
      }
    },

    async onPlayerStateChange(event) {
        switch (event.data) {
            case window.YT.PlayerState.PLAYING: {
                this.isPlaying = true;
                this.backgroundResumeCount = 0; // ← reset quand la lecture reprend vraiment

                const currentIndex = this.player.getPlaylistIndex?.();
                const playlist = this.player.getPlaylist?.() || [];
                const currentVideoId = playlist[currentIndex] || this.player.getVideoData?.().video_id;


                // Première vidéo
                if (this.lastPlaylistIndex === -1) {
                    this.lastPlaylistIndex = currentIndex;
                    this.lastVideoId = currentVideoId;
                    let music = await getMusicFromVideoID(currentVideoId)
                    console.log(music)
                    this.$emit('descriptionUpdate', {"title": music.data['Title'], "artist": music.data["Artist"]});
                    return;
                }

                console.log(currentIndex)
                console.log(currentVideoId)
                console.log(this.lastPlaylistIndex)
                console.log(this.lastVideoId)
                // Nouvelle vidéo détectée
                if (
                    currentIndex !== this.lastPlaylistIndex ||
                    currentVideoId !== this.lastVideoId
                ) {
                    this.autoPlayCount++;
                    console.log("🎵 Changement de vidéo, compteur =", this.autoPlayCount);

                    
                    let music = await getMusicFromVideoID(currentVideoId)
                    console.log(music)
                    this.$emit('descriptionUpdate', {"title": music.data['Title'], "artist": music.data["Artist"]});

                    this.lastPlaylistIndex = currentIndex;
                    this.lastVideoId = currentVideoId;

                    if (this.autoPlayCount % 5 === 0) {
                        console.log("⏸ Pause pour interaction humaine");
                        this.pendingHumanResume = true;
                        this.player.pauseVideo();
                        this.showHumanPopup = true;
                        return;
                    }
                }

                break;
            }

            case window.YT.PlayerState.PAUSED: {
                break;
            }
            
            case window.YT.PlayerState.BUFFERING:
                console.log("Buffering...");
                break;

            case window.YT.PlayerState.CUED:
                console.log("Vidéo prête");
                break;
        }
    },

    setPlayList(playList) {
      this.playList = playList || [];
      this.playListCursor = 0; // ⬅️ reset important
      console.log("playList set to :", this.playList);
    },

    getVideoName() {
      return this.videoName;
    },

    setVideoName(videoName) {
      this.videoName = videoName;
    },

    playNewVideo(videoId, videoName = "", from, title = "", artist = "") {
      // CAS 2
      this.$emit('descriptionUpdate', { title, artist });

      if (!this.player) {
        console.error("Le lecteur YouTube n'est pas encore prêt.");
        return;
      }

      clearTimeout(this.watchdogTimer);
      clearTimeout(this.endTimer);
      this.hasStarted = false;

      console.log("id", videoId);

      // Si on ne vient pas d'une playlist, on vide la playlist
      if (from !== "playlist") {
        this.playList = [];
        this.playListCursor = 0;
      }

      // CAS 1 : lecture automatique sans ID → on récupère une vidéo similaire
      if (videoId === "") {
        console.log("Recherche similaire pour :", this.videoName);

        getSimilarTrack(this.videoName)
          .then((response) => {
            console.log("resp", response.data);

            title = response.data["Title"];
            artist = response.data["Artist"];
            const ytId = response.data["yt_id"];

            this.videoName = `${title} ${artist}`;
            this.videoIdCurrentlyPlayed = ytId;

            this.player.loadVideoById({
              videoId: ytId,
              startSeconds: 0
            });

            this.$emit('descriptionUpdate', { title, artist });
          })
          .catch((err) => {
            console.error("Erreur getSimilarTrack :", err);
          });

        return;
      }

      // CAS 2 : lecture normale avec ID direct
      this.videoIdCurrentlyPlayed = videoId;
      this.videoName = videoName;

      this.player.loadVideoById({
        videoId: videoId,
        startSeconds: 0
      });

      this.$emit('descriptionUpdate', { title, artist });
    }
  }
};

// Fonction globale appelée par l'API YouTube
window.onYouTubeIframeAPIReady = function () {
  if (window.vueInstance) {
    window.vueInstance.onYouTubeIframeAPIReady();
  }
};
</script>

<style>
#background {
  background-color: grey;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

#youtube-player {
  display: block;
  width: 100%;
  height: 90%;
}

#subPlayer {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    top: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: black;
}


#subPlayer div{
    flex: 0 0 30%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}

#buttonDiv {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20%;
  height: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

#buttonDiv button {
  height: 20px;
  width: 20px;
  padding: 0;
}

#btn-agrandir {
  z-index: 3;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
}

.human-popup-overlay{
    position: absolute;
    background-color: black;
    border-radius: 15px;
    border: 1px solid white;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    z-index: 10000;
    color: white;
}

@media screen and (min-width: 428px) {
  #buttonDiv {
    top: -30px;
  }

  #buttonDiv {
    width: 100px;
  }
}
</style>