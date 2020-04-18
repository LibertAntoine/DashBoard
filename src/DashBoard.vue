<template>
  <div id="app">
    
    <SuiModal :title='"test modal with sementic-ui"' ref='dialogueModal'> 
      <sui-modal-description>
        <sui-image floated="left" size="medium" src="logoProfile.png" />
        <sui-header>Default Profile Image</sui-header>
        <p> We've found the following gravatar image associated with your e-mail address.</p>
        <p>Is it okay to use this photo?</p>
      </sui-modal-description>

      <template v-slot:actions>
        <sui-button positive @click.prevent='$refs.dialogueModal.toggle'> CLOSE </sui-button>
      </template>
    </SuiModal>
    <sui-button @click.prevent='$refs.dialogueModal.toggle'>Show Modal</sui-button>
    <div id="locationInfo">
      <div id="citySearch" class="ui input">
            <input id="cityInput" v-model="localisation" type="text" placeholder="Enter Location" />
            <button @click="updateLocation" class="ui primary basic button" type="button">Search</button>
      </div> 

      <div class="ui four column divided grid">
        <div class="row">
          <WeatherMap class="column" :embedURL='embedURL' title='Localisation Map' :height='600' :width='500' />

          <GraphBar class="column" 
            :datasets="[
                { x: this.labelsMinTemp, y: this.datasetsMinTemp, type: 'bar', name: 'Min'},
                { x: this.labelsMaxTemp, y: this.datasetsMaxTemp, type: 'bar', name: 'Max'}
            ]"
            :range='[Math.min(...this.datasetsMinTemp) - 5, Math.max(...this.datasetsMaxTemp)]'
            title='Temperature (°C)'
            :height='300' 
            :width='400' />

          <LocalInfo :forecast="forecast" :address="address"/>
        </div>
      </div> 
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
import MapModal from './components/MapModal'
import WeatherMap from './components/WeatherMap'
import LocalInfo from './components/LocalInfo'
import SuiModal from './components/SuiModal'
import GraphBar from './components/GraphBar'

export default {
  name: 'App',
  components: {
    SunDisplay,
    MoonPhase,
    WeatherMap,
    LocalInfo,
    MapModal,
    GraphBar,
    SuiModal
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
