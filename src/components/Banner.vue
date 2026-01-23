<template>
    <div id="bannerSearch">
        <div>Logo</div>
        <router-link v-if="userConnected" to="/Home">
            <button>Home</button>
        </router-link>
        <router-link v-if="userConnected" to="/playlist">
            <button>Playlist</button>
        </router-link>
        <router-link v-if="userConnected" to="/statistiques">
            <button>Statistiques</button>
        </router-link>
        <router-link v-if="userConnected" to="/jeux">
            <button>Jeux</button>
        </router-link>
        <router-link v-if="userConnected" to="/parametre">
            <button>Paramètre</button>
        </router-link>
        <button @click="logoutBanner">Déconnexion</button>
    </div>
</template>


<script>

export default ({
    name: "MusicPage",
    data() {
        return {
            userConnected : false
        }
    },
    methods: {
        connectedUserBanner() {
            this.userConnected = !this.userConnected
        },
        logoutBanner(){
            this.connectedUserBanner()
            this.$emit('logout')
        }
    }
});
</script>