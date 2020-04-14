import { openMapApi, ipgeolocationApi } from "./Api"
import axios from "axios"

export default {
  getCity: async () => {
    return await openMapApi.get("weather?id=2172797", {
      params: {
        appid: process.env.VUE_APP_APIKEY_OPENWEATHERMAP
      }
    })
  },

  getCity16days: async (city) => {
    return await openMapApi.get("forecast", {
      params: {
        appid: process.env.VUE_APP_APIKEY_OPENWEATHERMAP,
        q: city,
        mode: "json"
      }
    })
  },

  getLocalCity16days: async (city) => await fetch('/localdata/' + city + '.json').then(res => res.json()).catch(err => console.error(err)),

  getMyIp: async () => await axios.get('https://api.ipify.org?format=json').then(response => response.data.ip).catch(err => console.error(err)),

  getLocationInformations: async (ip) => {
    return await ipgeolocationApi.get('astronomy', {
      params: {
        apiKey: process.env.VUE_APP_API_APIKEY_IPGEOLOCATION,
        lang: 'fr',
        ip: ip
      }
    }).then(response => response.data).catch(err => console.error(err))
  }
}
