import axios from 'axios';

const API = axios.create({
  //baseURL: 'http://127.0.0.1:5000',
  baseURL: 'https://musicback-0vef.onrender.com',
});

export function login(identifiant, password) {
    console.log("login")
    return API.post('/login', { 'identifiant': identifiant, 'password': password })
        .then(res => {
            localStorage.setItem('token', res.data.access_token);
            console.log("setItem token ", res.data.access_token)
            return res.data;
        });
}

export function getProfile() {
    console.log("getProfile")
    return API.get('/profile', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}
/* 
export function listenMusic(payload) {
    return API.post('/listenMusic', payload, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
} */

export function searchYT(searchStr) {
    console.log("searchYT")
    return API.get('/searchYT/' + searchStr, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

export function loadHistorique() {
    console.log("loadHistorique")
    return API.get('/loadHistorique/', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

export function loadReplay() {
    console.log("loadReplay")
    return API.get('/loadReplay/', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

export function insertMusic(payload) {
    console.log("insertMusic")
    return API.post('/insertMusic/', payload, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

export function getSimilarTrack(track) {
    console.log("getSimilarTrack")
    return API.get('/getSimilarTrack/' + track, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}


API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    console.log("token: ", token)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});