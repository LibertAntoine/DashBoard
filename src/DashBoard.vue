<template>
  <sui-container fluid id='app'>

    <!-- ----- MENU ----- -->
    <sui-segment clearing id='menu'>
      <sui-header size='large' floated='left' id='title'>Weather Board</sui-header>  
      <sui-menu floated='right' compact>
          <sui-menu-item>
           
            <sui-input transparent icon='search' v-model='searchInput.value' @keyup.enter='inputEnterHandler' :placeholder='searchInput.placeholder'/>
          </sui-menu-item>
          <sui-menu-item right> <sui-button icon='map' @click.prevent='$refs.mapModal.toggle'/> </sui-menu-item>
      </sui-menu>
    </sui-segment>

    <sui-divider />

    <!-- ----- CONTENT ----- -->
    <sui-container id=' mainContent' fluid>
      <sui-grid>
        <sui-grid-row>

          <sui-grid-column :width='7'>
            <WeatherMap class="four wide column" :embedURL='embedURL' :height=400 title=''/>
          </sui-grid-column>

          <sui-grid-column :width='9'>
            <sui-grid :columns='2'>
              <sui-grid-row stretched>

                <sui-grid-column>
                  <sui-segment>
                    <sui-header size='large'> {{ this.locationInformations.address.name }} </sui-header>
                    <sui-header size='small'> {{ this.locationInformations.address.street }} </sui-header>
                    <sui-statistic >
                      <sui-statistic-value> {{ currentTemperature }} °C </sui-statistic-value>
                      <sui-statistic-label>temperature</sui-statistic-label>
                    </sui-statistic>
                  </sui-segment>
                </sui-grid-column>

                <sui-grid-column>
                  <sui-segment>
                    <sui-header size='large'> Details </sui-header>
                    <sui-statistics-group horizontal :columns='2'>
                      <sui-statistic in-group >
                        <sui-statistic-value> {{ this.currentHumidity }} % </sui-statistic-value>
                        <sui-statistic-label> Humidity </sui-statistic-label>
                      </sui-statistic>
                      <sui-statistic in-group>
                        <sui-statistic-value> {{ this.currentWindSpeed }} </sui-statistic-value>
                        <sui-statistic-label> <span class="tiny">km/h</span> <br/> Windspeed </sui-statistic-label>
                      </sui-statistic>
                    </sui-statistics-group>
                  </sui-segment>
                </sui-grid-column>

              </sui-grid-row>
              <sui-grid-row stretched>

                <sui-grid-column>
                  <sui-segment>
                    <SunDisplay
                      width= 'auto'
                      :sunriseHours='locationInformations.sunrise || "00:00"'
                      :sunsetHours='locationInformations.sunset || "00:00"'
                    />
                  </sui-segment>
                </sui-grid-column>

                <sui-grid-column>
                  <sui-segment>
                    <MoonPhase
                      :testPercentage='MoonPhaseTestPercentage'
                      width= '200px'
                    />
                  </sui-segment>
                </sui-grid-column>
                  
              </sui-grid-row>
            </sui-grid>

          </sui-grid-column>
        </sui-grid-row>

        <sui-grid-row :columns='2'>

          <sui-grid-column>
            <sui-segment>
              <GraphBar class="column" 
                :datasets="[
                { x: this.labelsMinTemp, y: this.datasetsMinTemp, type: 'bar', name: 'Min'},
                { x: this.labelsMaxTemp, y: this.datasetsMaxTemp, type: 'bar', name: 'Max'}
                ]"
                :range='[Math.min(...this.datasetsMinTemp) - 5, Math.max(...this.datasetsMaxTemp)]'
                title='Temperature (°C)'
                :height='300'
              />
            </sui-segment>
          </sui-grid-column>

          <sui-grid-column>
            <sui-segment>
              <GraphBar class="column" 
                :datasets="[
                { x: this.labelsMinTemp, y: this.datasetsMinTemp, type: 'bar', name: 'Min'},
                { x: this.labelsMaxTemp, y: this.datasetsMaxTemp, type: 'bar', name: 'Max'}
                ]"
                :range='[Math.min(...this.datasetsMinTemp) - 5, Math.max(...this.datasetsMaxTemp)]'
                title='Temperature (°C)'
                :height='300'
              />
            </sui-segment>
          </sui-grid-column>

        </sui-grid-row>
      </sui-grid>

    </sui-container>
    <MapModal ref='mapModal' @select='updateLocationFromModal'/>
  </sui-container>
</template>

<script>
import DataApi from './services/Api/Data'
import DarkSkyData from '@/services/Api/DarkSkyData';

import { dayTimeToDate } from './services/helpers/conversion'

import SunDisplay from './components/SunDisplay'
import MoonPhase from './components/MoonPhase'
import MapModal from './components/MapModal'
import WeatherMap from './components/WeatherMap'
import GraphBar from './components/GraphBar'
import InfoCard from './components/InfoCard'

export default {
  name: 'App',
  components: {
    SunDisplay,
    MoonPhase,
    WeatherMap,
    MapModal,
    GraphBar,
    // InfoCard
  },
  data () {
    return {
      searchInput: {
        placeholder: "Enter Location...",
        value: ""
      },
      locationInformations: {
        address: {},
        sunset: '00:00',
        sunrise: '00:00'
      },
      location: {},
      defaultLoc: { lat: 48.8534, lng: 2.3488},
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
    const getGeoloc = await DataApi.getLocation();
    this.location = getGeoloc || this.defaultLoc;
    // update location information with our longitude & latitude
    // const locationInformation = await DataApi.getLocationInfos(this.location.lat, this.location.lng);
    // if (locationInformation) { this.locationInformation = locationInformation; } 
  },

  watch: { // define watcher on our location
    location: function (newLocation) {
      this.updateInfos(newLocation)
    }
  },
  methods: {

      async inputEnterHandler() {
        // ----- find location with DarkSky -----
        const result = await DarkSkyData.getCoordinates(this.searchInput.value)
        if(result.error) {
          console.log('location not found');
        } else {
          this.location = {lat: result.latitude, lng: result.longitude};
        }

        this.searchInput.value = ''; // reset input value
        
      },
      updateLocationFromModal(lat, lng) {
        this.location = {lat, lng};
      },

      updatePercentage(event) {
        this.MoonPhaseTestPercentage = parseInt(event.target.value) / 100;
      },

      searchBarGetLatLng() {

      },
      async updateInfos({lat, lng}) {
        // ----- DarkSky -----
        this.embedURL = DarkSkyData.getEmbedURL(lat, lng);
        this.locationInformations.address = await DarkSkyData.getAddress(lat, lng);
        this.forecast = await DarkSkyData.getForecast(lat, lng);
        this.labelsMinTemp = this.forecast.daily.data.map( day => dayTimeToDate(day.time).split(' ')[0]);
        this.datasetsMinTemp = this.forecast.daily.data.map( day => parseInt(day.temperatureMin - 32) * 5/9);
        this.labelsMaxTemp = this.forecast.daily.data.map( day => dayTimeToDate(day.time).split(' ')[0]);
        this.datasetsMaxTemp = this.forecast.daily.data.map( day => parseInt(day.temperatureMax - 32) * 5/9);
        this.currentHumidity = (this.forecast.currently.humidity * 100).toFixed(1) || null;
        this.currentSummary = this.forecast.currently.summary || null;
        this.currentWindSpeed = this.forecast.currently.windSpeed * 1,852 || null;
        this.currentTemperature = ((this.forecast.currently.temperature - 32) * 5/9).toFixed(1) || null;

        // -----sun & moon -----
        const astroInfos = await DataApi.getLocationInfos(this.location.lat, this.location.lng);
        if (astroInfos) { 
          this.locationInformations = {
            ...this.locationInformations, 
            sunset: astroInfos.sunset,
            sunrise: astroInfos.sunrise,
            moonset: astroInfos.moonset,
            moonrise: astroInfos.moonrise
          }
        }
      }
  }
}
</script>

<style>
#app {
  padding: 30px;
  background-color : #373635;
}

#title {
  padding: 0;
  margin: 0;
}
#graph {
  width: 520px;
}

.tiny {
  font-size: 0.8em;
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
