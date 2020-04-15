<template>
  <div id="app">
    <NavBar :update='updateLocation'/>

    <div class="ui stackable four column grid centered">
      <WeatherMap class="four wide column" :embedURL='embedURL' title='Localisation Map' :height='600' :width='500' />

      <GraphBar class="column" 
        :datasets="[
            { x: this.labelsMinTemp, y: this.datasetsMinTemp, type: 'bar', name: 'Min'},
            { x: this.labelsMaxTemp, y: this.datasetsMaxTemp, type: 'bar', name: 'Max'}
        ]"
        :range='[Math.min(...this.datasetsMinTemp) - 5, Math.max(...this.datasetsMaxTemp)]'
        title='Temperature (°C)'
        :height='300' 
        :width='400' />

      <InfoCard class="column" 
        :title='currentSummary'
        :datasets='[
          {label:"Temperature", value: currentTemperature + " °C"}
        ]'
        :height='170' 
        :width='250' />

        <InfoCard class="column" 
        title="Details"
        :datasets='[
          {label:"Humidity", value: currentHumidity + " %"},
          {label:"Windspeed", value: currentWindSpeed + " km/h"}
        ]'
        :height='230' 
        :width='320' />

        <InfoCard class="column" 
        :title='"Weather today at :" + this.address'
        :height='130' 
        :width='400' />


    <Modal ref='testModal'
      :title= '"test titre"'
      :overlayColor= '"#000000"'
      :overlayOpacity= '0.4' 
      />


    </div>
    <SuiModal :title='"test titre"' ref='testModal'> 
    <p>test du component Modal</p>
    </SuiModal>
    <MapModal ref='mapModal'/>
    <sui-button @click.prevent='$refs.testModal.toggle'>Show Modal</sui-button>
    <sui-button @click.prevent='$refs.mapModal.toggle'>Show mapModal</sui-button>
    <SunDisplay
      width= '300px'
      :sunriseHours='locationInformation.sunrise || "00:00"'
      :sunsetHours='locationInformation.sunset || "00:00"'
    />
    <MoonPhase
      :testPercentage='MoonPhaseTestPercentage'
      width= '200px'
    />

    <input type="range" min="0" max="100" value="25" class="slider" id="myRange" @input="updatePercentage">
    <br/>

  </div>
</template>

<script>
import DataApi from './services/Api/Data'
import DarkSkyData from '@/services/Api/DarkSkyData';

import { dayTimeToDate } from './services/helpers/conversion'

import SunDisplay from './components/SunDisplay'
import MoonPhase from './components/MoonPhase'
import MapModal from './components/MapModal'
import WeatherMap from './components/WeatherMap'
import SuiModal from './components/SuiModal'
import GraphBar from './components/GraphBar'
import InfoCard from './components/InfoCard'
import NavBar from './components/NavBar'

export default {
  name: 'App',
  components: {
    SunDisplay,
    MoonPhase,
    WeatherMap,
    MapModal,
    GraphBar,
    SuiModal,
    InfoCard,
    NavBar
  },
  data () {
    return {
      clientIp: '',
      locationInformation: {
        sunset: '00:00',
        sunrise: '00:00'
      },
      location: {},
      MoonPhaseTestPercentage: 0,
      address : '',
      forecast: null,
      embedURL: '',
      localisation : '',
      labelsMinTemp : [],
      datasetsMinTemp : [],
      labelsMaxTemp : [],
      datasetsMaxTemp : [],
      currentHumidity : null,
      currentSummary : null,
      currentWindSpeed : null,
      currentTemperature : null
    }
  },

  async created () {
    this.clientIp = await DataApi.getMyIp();
    this.location = await DataApi.getLocation();
    
    // update location information with our longitude & latitude
    const locationInformation = await DataApi.getLocationInfos(this.location.latitude, this.location.longitude);
    if (locationInformation) {
      this.locationInformation = locationInformation;
    } 
    this.loadWeather(this.location.latitude || '40.8587', this.location.longitude || '10.3429');
  },

  watch: { // define watcher on our variable city and update the data if it changes
    city: function (newCity) {
      console.log('Selected city: ' + newCity)
      this.updateData(newCity)
    }
  },
  methods: {
      updatePercentage(event) {
        this.MoonPhaseTestPercentage = parseInt(event.target.value) / 100;
      },
      // DarkSky
      async loadWeather(lat, lng) {
        this.embedURL = DarkSkyData.getEmbedURL(lat, lng)
        const result = await DarkSkyData.getAddress(lat, lng)
        this.address = [result.name, result.street].join(' ')
        this.forecast = await DarkSkyData.getForecast(lat, lng)
        this.labelsMinTemp = this.forecast.daily.data.map( day => dayTimeToDate(day.time).split(' ')[0])
        this.datasetsMinTemp = this.forecast.daily.data.map( day => parseInt(day.temperatureMin - 32) * 5/9)
        this.labelsMaxTemp = this.forecast.daily.data.map( day => dayTimeToDate(day.time).split(' ')[0])
        this.datasetsMaxTemp = this.forecast.daily.data.map( day => parseInt(day.temperatureMax - 32) * 5/9)
        this.currentHumidity = (this.forecast.currently.humidity * 100).toFixed(1) || null
        this.currentSummary = this.forecast.currently.summary || null
        this.currentWindSpeed = this.forecast.currently.windSpeed * 1,852 || null
        this.currentTemperature = ((this.forecast.currently.temperature - 32) * 5/9).toFixed(1) || null
       },
      async updateLocation(localisation) {
        const result = await DarkSkyData.getCoordinates(localisation)
          if(result.error) this.loadWeather(this.location.lat, this.location.long);
          else this.loadWeather(result.latitude, result.longitude);
      },
  }
}
</script>

<style>
body {
	background-color: white;
}

#app {
  padding: 30px;
  background-color : #373635;
}
#graph {
  width: 520px;
}

.graph {
  display: inline-block;
  width: 500px;
}
#cityInput {
  margin-right : 3px;
}
#citySearch {
  margin-bottom : 10px;
}
#tempGraph {
  border-radius : 30px;
}

</style>
