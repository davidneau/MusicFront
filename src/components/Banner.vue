<template>
    <div id="bannerSearch">
        <div id="divLogo" style="height: 100%;">
            <img src="../../assets/logo.png" style="height: 100%;">
        </div>
        <div id="searchDiv" v-if="userConnected === 'true'">
            <input type="text" id="search" @keyup.enter="searching()" ref="searchInput" value="" placeholder="Rechercher un titre, un artiste…">
            <svg @click="searching()" class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black">
                <path d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
        </div>
        <div id="buttonsMenu">
            <router-link v-if="userConnected === 'true'" style="justify-content: space-around;text-decoration: none;" to="/playlist">
                <button class="btn-menu btn-menu-banner" id="btn-profil" style="padding: 8px 16px;">
                    <img src="../../assets/playlist.png" style="height: 40px;">
                    <p v-if="device=='Desktop'" style="font-size: 20px; font-weight: bold; margin-left: 10px;">Playlist</p>
                </button>
            </router-link>
            <router-link v-if="userConnected === 'true'" to="/home" style="justify-content: space-around; text-decoration: none;">
                <button class="btn-menu btn-menu-banner" id="btn-menu" style="padding: 8px 16px;">
                    <img src="../../assets/menu.png" style="height: 40px;">
                    <p v-if="device=='Desktop'" style="font-size: 20px; font-weight: bold; margin-left: 10px;">Menu</p>
                </button>
            </router-link>
            <router-link v-if="userConnected === 'true'" style="justify-content: space-around;text-decoration: none;" to="/profil">
                <button class="btn-menu btn-menu-banner" id="btn-profil" style="padding: 8px 16px;">
                    <img src="../../assets/profil.png" style="height: 40px;">
                    <p v-if="device=='Desktop'" style="font-size: 20px; font-weight: bold; margin-left: 10px;">Profil</p>
                </button>
            </router-link>
        </div>
        <!-- <button class="neon-btn-deco" @click="logoutBanner">⏻</button> -->
    </div>
</template>


<script>
import { searchMusic } from '@/api';

export default ({
    name: "MusicPage",
    props: ["device"],
    data() {
        return {
            userConnected : localStorage.getItem('userConnected')
        }
    },
    methods: {
        connectedUserBanner() {
            this.userConnected = true
            console.log("switch", this.userConnected)
        },
        disconnectedUserBanner() {
            this.userConnected = false
            console.log("switch", this.userConnected)
        },
        logoutBanner(){
            this.disconnectedUserBanner()
            this.$emit('logout')
        },
        async searching() {
            let searchstr = document.getElementById('search').value
            document.getElementById("historique").innerHTML = ""
            document.getElementById("logoSearch").style.display = "block"
            document.getElementById("searchResult").style.display = "none"
            let musicVideos = await searchMusic(searchstr)
            console.log(musicVideos.data)
            document.getElementById("logoSearch").style.display = "none"
            document.getElementById("searchResult").style.display = "flex"
            this.$emit('setSearchResult', musicVideos.data)
        }
    },
    watch: {
        userConnected(newVal) {
            console.log("watch", newVal)
            localStorage.setItem('userConnected', newVal.toString())
            this.userConnected = newVal.toString()
        }
    },
    mounted(){
        console.log(localStorage.getItem('userConnected'))
        console.log(typeof localStorage.getItem('userConnected'))
        console.log(this.userConnected)
        console.log(typeof this.userConnected)
    }
});
</script>

<style>


#searchDiv{
    position: relative;
    width: 320px;
}


#searchDiv input{
    width: 100%;
    padding: 10px 44px 10px 16px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    font-size: 0.95rem;
    outline: none;
}

#searchDiv input::placeholder {
  color: #888;
}

#searchDiv input:focus {
  border-color: #00f0ff;
  box-shadow: 10 10 8px rgba(0, 240, 255, 0.4);
}

#buttonsMenu{
    flex: 0 0 30%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-right: 10px;
}

#divLogo{
    flex: 0 0 30%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    margin-left: 10px;
}

.search-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  width: 18px;
  height: 18px;
  transform: translateY(-50%);
  stroke: #aaa;
  stroke-width: 2;
  fill: none;
  pointer-events: auto;
  cursor: pointer;
}

.btn-menu {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 30px;
    font-size: 16px;
    color: white;
    background: #0b0f1a;
    border-radius: 40px;
    border: none;
    cursor: pointer;

    box-shadow:
        0 0 12px 2px rgba(120, 220, 255, 0.9),
        0 0 12px 6px rgba(240, 147, 251, 0.8);
}

.btn-menu:hover {
  box-shadow:
    0 0 12px 4px rgba(120, 220, 255, 1),
    0 0 12px 12px rgba(240, 147, 251, 1);
}

.btn-blue-glass {
  padding: 5px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;

  background: linear-gradient(
    135deg,
    #2196f3,
    pink
  );

  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  box-shadow:
    0 8px 24px rgba(0, 150, 255, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.btn-menu-banner{
    padding: 2px 15px !important;
}


@media screen and (min-width: 428px)  {
    .btn-blue-glass {    
        padding: 12px 28px;
    }
}

.btn-blue-glass:hover {
  transform: translateY(-2px);
  box-shadow:
    0 14px 32px rgba(0, 150, 255, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.45);
  filter: brightness(1.08);
}

.btn-blue-glass:active {
  transform: translateY(0);
  box-shadow:
    0 6px 14px rgba(0, 150, 255, 0.3);
}

.neon-btn-deco {
    width: 44px;
    height: 44px;
    position: relative;
    display: inline-block;
    padding: 10px 10px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: linear-gradient(45deg, #00f0ff, #ff00f7);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: 0.3s;
    box-shadow: 0 0 10px #00f0ff, 0 0 20px #ff00f7, 0 0 30px #ff00f7;
}

.neon-btn-deco:hover {
    box-shadow: 0 0 20px #00f0ff, 0 0 30px #ff00f7, 0 0 40px #ff00f7;
}

.neon-btn-deco::before {
    content: '';
    position: absolute;
    background: linear-gradient(45deg, #00f0ff, #ff00f7);
    border-radius: 15px;
    filter: blur(10px);
    opacity: 0.7;
    z-index: -1;
}

p{
    margin: 0;
}

</style>