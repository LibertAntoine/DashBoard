<template>
  <div class="WeatherMap">
          <input v-model="location" type="text" class="form-control" placeholder="Enter Location">
          <div class="input-group-append">
            <button 
              @click="updateLocation"
              class="ui primary button"
              type="button">Search</button>
          </div> 
      <iframe
          id="map-embed-iframe"
          frameborder="0"
          height="500px"
          width="600px"
          :src='embedURL'>
          </iframe>
      <div>
      <p>Weather today at : {{ this.address }}</p>
      <p>{{ this.currentSummary }}</p>
      <p>Temperature : {{ this.currentTemperature }}</p>
      <p>Humidity : {{ this.currentHumidity }}</p>
      <p>WindSpeed : {{ this.currentWindSpeed  }}</p>
      </div>
  </div>
</template>

<script>
import DarkSkyData from '@/services/Api/DarkSkyData';
import DataApi from '@/services/Api/Data';

export default {
  name: 'WeatherMap',
  data() {
    return {
      embedURL: '',
      location: '',
      IpLocation: '',
      address: '',
      forecast: null,
      currentHumidity: '',
      currentSummary: '',
      currentWindSpeed: '',
      currentTemperature: ''
    };
  },
  async created() {
    this.IpLocation = await DataApi.getLocation();
    this.loadWeather(this.IpLocation.lat || '40.8587', this.IpLocation.long || '10.3429');
  },
  methods: {
    async loadWeather(lat, lng) {
      this.embedURL = DarkSkyData.getEmbedURL(lat, lng)
      const result = await DarkSkyData.getAddress(lat, lng)
      this.address = [result.name, result.street].join(' ')
      this.forecast = await DarkSkyData.getForecast(lat, lng)
      this.currentHumidity = this.forecast.currently.humidity
      this.currentSummary = this.forecast.currently.summary
      this.currentWindSpeed = this.forecast.currently.windSpeed
      this.currentTemperature =  this.forecast.currently.temperature
    },
    async updateLocation() {
      const result = await DarkSkyData.getCoordinates(this.location)
        if(result.error) {
          this.loadWeather(this.IpLocation.lat, this.IpLocation.long);
        } else {
          this.loadWeather(result.latitude, result.longitude);
        }
    },
  },
};
</script>

<style>
body {
  font-size: 1em;
}
.icon-temp {
  font-size: 1em;
}
.emoji {
  font-size: 1em;
}
</style>