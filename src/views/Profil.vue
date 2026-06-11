<template>
    <div>
        <div id="profilMain">
            <h1 style="margin-bottom: 20px;">Profil</h1>
            <div class="flexCol">
                <img src="../../assets/profil_inconnu.jpg" style="width: 30%">
                <div class="flexRow">
                    <button class="neon-btn-deco" @click="logoutBanner">⏻</button>
                    <h2>{{ userName }}</h2>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default ({
    name: "ProfilPage",
    data() {
        return {
            userName: ""
        }
    },
    methods: {
        logoutBanner(){
            this.disconnectedUserBanner()
            this.$emit('logout')
            localStorage.setItem("userConnected", false)
        },
        disconnectedUserBanner() {
            this.userConnected = false
            console.log("switch", this.userConnected)
        },
    },
    mounted(){
        this.userName = localStorage.getItem("userName")
    }
})
</script>

<style>

#profilMain {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    align-self: center;
    color: white;
    width: 70%;
    margin-left: 15%;
}

</style>