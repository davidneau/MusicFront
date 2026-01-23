<template>
    <div id="menuBar">
        <div id="searchDiv">
            <input type="text" id="search" @keyup.enter="search" ref="searchInput" value="" placeholder="search text area">
            <button @click="$emit('search', true)" @keydown="$emit('search', true, document.getElementById('search'))">Search</button>
        </div>
    </div>
</template>

<script>

export default {
  name: "MenuBar",
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