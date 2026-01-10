import axios from 'axios';

const API = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

export function login(identifiant, password) {
    console.log(process.env.VUE_APP_API_URL)
    return API.post('/login', { 'identifiant': identifiant, 'password': password })
        .then(res => {
            localStorage.setItem('token', res.data.access_token);
            console.log("setItem token ", res.data.access_token)
            return res.data;
        });
}

export function getProfile() {
    console.log("getProfile")
    return API.get('/profile');
}

export function signInUser(id, mdp) {
    console.log("signIn")
    return API.post('/signIn', {"identifiant": id, "password": mdp});
}

export function searchYT(searchStr) {
    console.log("searchYT")
    return API.get('/searchYT/' + searchStr);
}

export function getLyrics(Artist, Title) {
    console.log("getLyrics")
    return API.get('/getLyrics', {params: {
        title: Title,
        artist: Artist
    }})
}

export function getMusic(Artist, Title) {
    console.log("getMusic")
    return API.get('/getMusic', {params: {
        title: Title,
        artist: Artist
    }})
}

export function searchMusic(searchStr) {
    console.log("searchMusic")
    return API.get('/searchMusic/' + searchStr);
}

export function loadHistorique() {
    console.log("loadHistorique")
    return API.get('/loadHistorique/');
}

export function loadReplay() {
    console.log("loadReplay")
    return API.get('/loadReplay/');
}

export function insertMusic(payload) {
    console.log("insertMusic")
    return API.post('/insertMusic/', payload);
}

export function getSimilarTrack(track) {
    console.log("getSimilarTrack")
    return API.get('/getSimilarTrack/' + track);
}


API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});