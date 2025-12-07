<template>
  <v-app>
    <v-main>
      <router-view @switchUserConnected="switchUserConnected"/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    userConnected: false
    //
  }),
  methods: {
    switchUserConnected(){
        this.userConnected = !this.userConnected
    }
  }
}
</script>

<style>
body, html {
  padding: 0;
  margin: 0;
}

body {
  background-image: url('../assets/Background_Music.jpg');
  background-size: cover;       /* L’image couvre toute la page */
  background-position: center;  /* Centrée */
  background-repeat: no-repeat; /* Pas de répétition */
  height: 100vh;
  margin: 0;
}


#bannerSearch {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #00a6ef;
    height: 60px;
    position: sticky;
    left: 0;
    right: 0;
    top: 0;
}
</style>