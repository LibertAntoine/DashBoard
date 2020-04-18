<template>


  <div id="app">
    <div id="locationInfo">
          <div id="citySearch" class="ui input">
            <input id="cityInput" v-model="localisation" type="text" placeholder="Enter Location">
            <button @click="updateLocation" class="ui primary basic button" type="button">Search</button>
          </div> 

      <div class="ui four column divided grid">
        <div class="row">

        <div id='map' class="column">
          <WeatherMap :embedURL="this.embedURL"/>
        </div>

        <div id='graph' class="column">
          <Plotly id="tempGraph" class="graph column"
          :data="[{ x: this.labelsMinTemp, y: this.datasetsMinTemp, type: 'bar', name: 'Min'},
            { x: this.labelsMaxTemp, y: this.datasetsMaxTemp, type: 'bar', name: 'Max'}
          ]"
          :layout="{ 
            title: 'Temperature (C°)',
            yaxis: {range: [Math.min(...this.datasetsMinTemp) - 5, Math.max(...this.datasetsMaxTemp)]},
            barmode: 'group',
            width:'500',
            height:'500'
          }"
          />
          </div>

        <div id='info' class="column">
          <LocalInfo :forecast="forecast" :address="address"/>
        </div>
        </div> 
       </div>
    </div>

    <SunDisplay
      width= '300px'
      :sunriseHours= "this.locationInformation.sunrise"
      :sunsetHours= "this.locationInformation.sunset"
    />
    <MoonPhase
      :testPercentage= "this.MoonPhaseTestPercentage"
      width= '200px'
    />

    <input type="range" min="0" max="100" value="25" class="slider" id="myRange" @input="updatePercentage">
    <br/>

    <p> ton ip est : {{ this.clientIp }} </p>
    <p> ta localisation est : {{ this.location }} </p>

  </div>
</template>

<script>
import DataApi from './services/Api/Data'
import DarkSkyData from '@/services/Api/DarkSkyData';

import { dayTimeToDate } from './services/helpers/conversion'

import SunDisplay from './components/SunDisplay'
import MoonPhase from './components/MoonPhase'
import WeatherMap from './components/WeatherMap'
import LocalInfo from './components/LocalInfo'

import { Plotly } from 'vue-plotly'

export default {
  name: 'App',
  components: {
    Plotly,
    SunDisplay,
    MoonPhase,
    WeatherMap,
    LocalInfo
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
      datasetsMaxTemp : []
    }
  },
  async created () {
    this.clientIp = await DataApi.getMyIp();
    this.location = await DataApi.getLocation();
    // update location information with our longitude & latitude
    this.locationInformation = await DataApi.getLocationInfos(this.location.lat, this.location.long);
    this.loadWeather(this.location.lat || '40.8587', this.location.long || '10.3429');

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
        console.log(this.forecast)
        this.labelsMinTemp = this.forecast.daily.data.map( day => dayTimeToDate(day.time).split(' ')[0])
        this.datasetsMinTemp = this.forecast.daily.data.map( day => parseInt(day.temperatureMin - 32) * 5/9)
        this.labelsMaxTemp = this.forecast.daily.data.map( day => dayTimeToDate(day.time).split(' ')[0])
        this.datasetsMaxTemp = this.forecast.daily.data.map( day => parseInt(day.temperatureMax - 32) * 5/9)
      
       },
      async updateLocation() {
        const result = await DarkSkyData.getCoordinates(this.localisation)
          if(result.error) this.loadWeather(this.location.lat, this.location.long);
          else this.loadWeather(result.latitude, result.longitude);
      },
  }
}
</script>

<style>
#app {
  padding: 30px;
  background-color : #373635;
}
#map {
  width : 520px;
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
