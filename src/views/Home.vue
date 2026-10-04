<template>
    <div class="loaderLogo" id="logoSearch"></div>
    <div id="home">
        <div id="historique">
            <h1 style="color: white;">Historique</h1>
            <div v-for="(music, index) in listMusicsHisto" :key="music" :id="'Histo' + index" class="canBeFocused" tabindex="0">
                <Music 
                    :title="music['Title']" 
                    :artist="music['Artist']"
                    :album="music?.StatMusic3?.Album"
                    :img="music?.StatMusic3?.Image"
                    :videoId="music['id_yt']"
                    :id_clip="music?.StatMusic3?.id_clip"
                    :btnATP=true
                    from="histo"
                ></Music>
            </div>
        </div>
    </div>
</template>

<script>
import Music from '@/components/Music.vue';
import { loadHistorique } from '../api';

export default ({
    name: "MusicPage",
    props: ["userConnected", "device"],
    components: {
        Music
    },
    data() {
        return {
            current_video_id: "",
            video_playing: false,
            API_KEY: 'AIzaSyA8apjRRfjCHmu6M_4q_r3kUbnO_qJ7xfk',
            API_URL: 'https://www.googleapis.com/youtube/v3/search',
            VIDEO_DETAILS_URL: 'https://www.googleapis.com/youtube/v3/videos',
            serpAPI_KEY: '777faa1853ab2cc4bfb9c2b265b2147cc6167016356d283bbfc7cb61903009a8',
            loading: false,
            clicked: false,
            listMusicsHisto: Array(),
            listMusicsSearch: Array(),
        };
    },
    methods: {
        async init(){
            console.log("device :", this.device)
            let histo = await loadHistorique()
            console.log(histo.data)
            this.listMusicsHisto = histo.data
        },
        logout(){
            this.$router.push('/')
        },
        async setSearchResult(list) {
            this.listMusicsSearch = list
        },
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

<style scopped>

html, body, #app, v-app, v-main{
    height: 100%;
}

html{
    background-color: aliceblue;
}

.canBeFocused:focus {
    background-color: pink;
}

.loaderLogo {
    display: none;
    width: 48px;
    height: 48px;
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-top-color: #6366f1; /* indigo / supabase vibe */
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


.playerFullScreen{
    width: 100% !important;
    height: calc(100% - 60px) !important;
    top: 0;
    left: 0 !important;
    bottom: 0 !important;
    right: 0 !important;
}

#blur{
    width: 100vw;
    height: 100vh;
    background-color: black;
    position: absolute;
    z-index: 2;
    opacity: 0.5;
    filter: blur(100px);
    display: none;
}

.playerMiniature{
    top: 78vh !important;
    left: 50vw !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 50vw !important;
    height: 20vh !important;
    position: absolute;
}

.playerMiniatureMobile{
    position: absolute;
    top: 0;
    right: 0;
    width: 100% !important;
    height: 100% !important;
    overflow-y: auto;
}



#historique{
    overflow-y: auto; 
    max-height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    align-items: center;
}

#historique>div{
    width: 90%;
}

#searchResult>div{
    width: 90%;
}

@media screen and (min-width: 428px)  {
    .searchOneResult {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 25%;
        margin-top: 10px;
        margin-bottom: 10px;
        border: 1px solid black;
        border-radius: 15px;
        padding: 10px;
        background-color: #00ebff;
        cursor: pointer;
    }

    
    #historique>div{
        width: 30%;
    }

    #searchResult>div{
        width: 30%;
    }

    .playerMiniature{
        width: 20vw !important;
        left: 78vw !important;
    }

    .playerMiniature #player{
        flex: 0 0 100%
    }
}
</style>
  
