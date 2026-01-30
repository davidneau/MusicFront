<template>
    <div id="bannerSearch">
        <div>Logo</div>
        <router-link v-if="userConnected" to="/Home">
            <button class="btn-menu">Home</button>
        </router-link>
        <router-link v-if="userConnected" to="/playlist">
            <button class="btn-menu">Playlist</button>
        </router-link>
        <router-link v-if="userConnected" to="/statistiques">
            <button class="btn-menu">Statistiques</button>
        </router-link>
        <router-link v-if="userConnected" to="/jeux">
            <button class="btn-menu">Jeux</button>
        </router-link>
        <router-link v-if="userConnected" to="/parametre">
            <button class="btn-menu">Paramètre</button>
        </router-link>
        <button @click="logoutBanner">Déconnexion</button>
    </div>
</template>


<script>

export default ({
    name: "MusicPage",
    data() {
        return {
            userConnected : true
        }
    },
    methods: {
        connectedUserBanner() {
            this.userConnected = true
        },
        disconnectedUserBanner() {
            this.userConnected = false
        },
        logoutBanner(){
            this.disconnectedUserBanner()
            this.$emit('logout')
        }
    }
});
</script>

<style>

.btn-menu {
  padding: 8px 30px;
  font-size: 16px;
  color: white;
  background: #0b0f1a;
  border-radius: 40px;
  border: none;
  cursor: pointer;

  box-shadow:
    0 0 12px 4px rgba(120, 220, 255, 0.9),
    0 0 12px 12px rgba(240, 147, 251, 0.8);
}

.btn-menu:hover {
  box-shadow:
    0 0 12px 6px rgba(120, 220, 255, 1),
    0 0 12px 18px rgba(240, 147, 251, 1);
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

</style>