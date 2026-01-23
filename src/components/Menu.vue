<template>
    <div id="menuBar">
        <div id="searchDiv">
            <input type="text" id="search" @keyup.enter="searching()" ref="searchInput" value="" placeholder="search text area">
            <button @click="searching()">Search</button>
        </div>
    </div>
</template>

<script>

export default {
  name: "MenuBar",
  methods: {
    searching() {
        let searchstr = document.getElementById('search').value
        this.$emit('search', true, searchstr)
    }
  }
};
</script>

<style>

#menuBar{
    width: 100%;
    background-color: blue;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}

</style>