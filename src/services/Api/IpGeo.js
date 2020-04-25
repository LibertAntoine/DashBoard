import {ipgeolocationApi } from "./Api"
import axios from "axios"

export default {

  getLocalCity16days: async (city) => await fetch('/localdata/' + city + '.json').then(res => res.json()).catch(err => console.error(err)),

  getMyIp: async () => await axios.get('https://api.ipify.org?format=json').then(response => response.data.ip).catch(err => console.error(err)),

  getLocationInfosFromIp: async (ip) => {
    return await ipgeolocationApi.get('astronomy', {
      params: {
        apiKey: process.env.VUE_APP_APIKEY_IPGEOLOCATION,
        lang: 'fr',
        ip: ip
      }
    }).then(response => response.data).catch(err => console.error(err))
  },
  getLocationInfos: async (lat, long) => {
    return await ipgeolocationApi.get('astronomy', {
      params: {
        apiKey: process.env.VUE_APP_APIKEY_IPGEOLOCATION,
        lang: 'fr',
        lat: lat,
        long: long
      }
    }).then(response => response.data).catch(err => console.error(err))
  },

  getLocation: async () => {
    if (navigator.geolocation) {
      return await new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      })
      .then(res => {
        return {lat: res.coords.latitude, lng: res.coords.longitude, accuracy: res.coords.accuracy}; 
      })  
      .catch((error) => {
        console.err('Erreur lors de la géolocalisation :');
        switch (error.code) {
          case error.TIMEOUT:
            console.err('Timeout !');
            break;
          case error.PERMISSION_DENIED:
            console.err('Vous n’avez pas donné la permission');
            break;
          case error.POSITION_UNAVAILABLE:
            console.err('La position n’a pu être déterminée');
            break;
          case error.UNKNOWN_ERROR:
            console.err('Erreur inconnue');
            break;
        }
      });
    } else {
      console.err('API navigator.geolocation non disponible');
      return undefined;
    }
  }
}
