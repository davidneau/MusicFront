<template>
    <div>
        <div id="bannerSearch">
            <div v-if="userConnected">
                <input type="text" id="search" @keyup.enter="search" ref="searchInput" value="21 pilots">
                <button @click="search(true)">Search</button>
            </div>
        </div>
        <div id="divLogin">
            <h1>Login</h1>
            <h2>Id</h2>
            <input type="text" id="identifiant"/>
            <h2>Password</h2>
            <input type="password" id="password"/>
            <button @click="enter">Enter</button>
        </div>
    </div>
</template>


<script>
import { login, getProfile } from '../api';

export default ({
    name: "LoginPage",
    methods: {
        enter(){
            let identifiant = document.getElementById("identifiant").value
            let password = document.getElementById("password").value
            console.log(identifiant)
            console.log(password)

            login(identifiant, password)
            .then(() => {
                return getProfile();
            })
            .then(profile => {
                console.log(profile.data); // Affiche les infos de l'utilisateur
                this.$router.push('/search')
            })
            .catch(err => {
                console.error('Erreur:', err.response);
                alert("mot de passe ou identifiant erroné")
            });
        }
    }
})
</script>

<style>

h1, h2 {
    margin: 0;
}

#divLogin{
    margin-left: 35%;
    width: 30%;
    margin-top: 150px;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background-color: coral;
    border-radius: 15px;
}

</style>