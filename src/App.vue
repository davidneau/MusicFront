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

#bannerSearch {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #EEEEEE;
    height: 60px;
    position: sticky;
    left: 0;
    right: 0;
    top: 0;
}
</style>