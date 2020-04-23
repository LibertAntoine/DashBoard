<template>
  <sui-container fluid id='app'>

    <!-- ----- MENU ----- -->
    <sui-segment clearing id='menu'>
      <h1 id='title'>Weather Board</h1>  
      <sui-menu floated='right' compact>
          <sui-menu-item>
           
            <sui-input transparent 
              icon='search' 
              v-model='searchInput.value' 
              @keyup.enter='inputEnterHandler' 
              :placeholder='searchInput.placeholder' 
              :disable='searchInput.disable'
              :loading='searchInput.disable'
            />
          </sui-menu-item>
          <sui-menu-item right> <sui-button icon='map' @click.prevent='$refs.mapModal.toggle'/> </sui-menu-item>
      </sui-menu>
    </sui-segment>

    <sui-divider />

    <!-- ----- CONTENT ----- -->
    <div id="content">
      <h2>
        {{ locationInformations.address.name }}, <i>{{ locationInformations.address.street }}</i>
      </h2>
      <div id="basic-infos" class="rows">
        <sui-segment>
            <sui-statistic in-group='' >
              <sui-statistic-value>
                {{ weatherInfos.current.temp }} <span class='tiny'>°C</span>
              </sui-statistic-value>
            </sui-statistic>
        </sui-segment>
        <sui-segment>
            <sui-statistic in-group='' >
              <sui-statistic-value> {{ weatherInfos.current.humidity }} <span class='tiny'>%</span>
            </sui-statistic-value>
            </sui-statistic>
        </sui-segment>
        <sui-segment>
            <sui-statistic in-group=''>
              <sui-statistic-value> {{ weatherInfos.current.windSpeed }} <span class='tiny'>km/h</span>
              </sui-statistic-value>
            </sui-statistic>
        </sui-segment>
      </div>

      <div id='first-row' class='rows'>

        <sui-segment>
            <CelestialDisplay
                          :title='"Sun"'
                          :sunriseHours='locationInformations.sunrise || "00:00"'
                          :sunsetHours='locationInformations.sunset || "00:00"'
                        />
            <CelestialDisplay
              :title='"Moon"'
              :sunriseHours='locationInformations.moonrise || "00:00"'
              :sunsetHours='locationInformations.moonset || "00:00"'
              :fillColor='"23242f"'
                        />
        </sui-segment>
        <sui-segment>
          <MoonPhase
                                  :testPercentage='MoonPhaseTestPercentage'
                                  width= 'auto'
                    			 	 	     />
        </sui-segment>
        <sui-segment>
          <sui-statistic in-group='' >
            <sui-header size='large'> Click for rain details </sui-header>
            <RainButton @click.native="toggleRain"/>
          </sui-statistic>
        </sui-segment>
      </div>

      <div id='graphs' class='rows'>
        <div id='left'>
          <WeatherMap class="four wide column" :embedURL='embedURL' :height='400' title=''/>
        </div>
        <div id='right'>
          <GraphBar class="column"
                :datasets="[
                { x: weatherInfos.daily.daysLabels, y: weatherInfos.daily.tempMin, type: 'bar', name: 'Min'},
                { x: weatherInfos.daily.daysLabels, y: weatherInfos.daily.tempMax, type: 'bar', name: 'Max'}
                ]"
                :range='[Math.min(...weatherInfos.daily.tempMin) - 5, Math.max(...weatherInfos.daily.tempMax)]'
                title='Temperature (°C)'
                :height='300'
              />

          <sui-segment>
            <sui-header size='medium'> Weekly maximum temperature </sui-header>
            <!--TODO bring actual dates in-->
            <D3Line :data="weatherInfos.daily.tempMax" :height="350"/>
          </sui-segment>
        </div>
      </div>

      <RainModal :timestamp="weatherInfos.daily.daysTimestamp" :precipIntensity="weatherInfos.daily.precipIntensity" ref='rainModal'/>
      <MapModal ref='mapModal' @select='updateLocationFromModal'/>
    </div>
  </sui-container>
</template>

<script>
import DataApi from './services/Api/Data'
import DarkSkyData from '@/services/Api/DarkSkyData';

import { dayTimeToDate } from './services/helpers/conversion'

import CelestialDisplay from './components/CelestialDisplay'
import MoonPhase from './components/MoonPhase'
import MapModal from './components/MapModal'
import RainModal from './components/RainModal'
import WeatherMap from './components/WeatherMap'
import GraphBar from './components/GraphBar'
import InfoCard from './components/InfoCard'

import RainButton from './components/RainButton'
import D3Line from './components/D3/D3Line'

export default {
  name: 'App',
  components: {
    CelestialDisplay,
    MoonPhase,
    WeatherMap,
	 MapModal,
    GraphBar,
	 RainModal,
	 RainButton,
	  D3Line,
    // InfoCard
  },
  data () {
    return {
      searchInput: {
        placeholder: "Enter Location...",
        value: "",
        disable: false
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
      forecast: {
        data: {
          
        }
      },
      weatherInfos: {
        current: {
          summary: 'undefined',
          humidity: undefined,
          windSpeed: undefined,
          temp: undefined
        },
        daily: {
          daysLabels: [],
          daysTimestamp: [],
          daysSummary: [],
          tempMin: [],
          tempMax: [],
          windBearing: [],
          windSpeed: [],
          cloudCover: [],
          precipIntensity: []
        }
      },
      embedURL: ''
    }
  },

  async created () {
    const getGeoloc = await DataApi.getLocation();
    this.location = getGeoloc || this.defaultLoc;
  },

  watch: { // define watcher on our location
    location: function (newLocation) {
      this.updateInfos(newLocation)
    }
  },
  methods: {
  	  toggleRain() {
		  this.$refs.rainModal ? this.$refs.rainModal.toggle() : null;
	  },

      async inputEnterHandler() {

        this.searchInput.disable = true;

        // ----- find location with DarkSky -----
        const result = await DarkSkyData.getCoordinates(this.searchInput.value)
        
        if(result.error) {
          console.log(result.error);
        } else {
          this.location = {lat: result.latitude, lng: result.longitude};
          this.$refs.mapModal.setSelectedLocation( this.location );
        }

        this.searchInput.disable = false;
        this.searchInput.value = ''; // reset input value
        
      },
      updateLocationFromModal(lat, lng) {
        this.location = {lat, lng};
      },

      updatePercentage(event) {
        this.MoonPhaseTestPercentage = parseInt(event.target.value) / 100;
      },

      async updateInfos({lat, lng}) {
        // ----- DarkSky -----
        this.embedURL = DarkSkyData.getEmbedURL(lat, lng);
        this.locationInformations.address = await DarkSkyData.getAddress(lat, lng);
        this.forecast = await DarkSkyData.getForecast(lat, lng);

        console.log('forecast', this.forecast);

        if (this.forecast.error) {
          console.log(`Error : ${this.forecast.error}`);
        } else {

          this.weatherInfos.daily.daysLabels = this.forecast.daily.data.map( day => dayTimeToDate(day.time).split(' ')[0] );
          this.weatherInfos.daily.daysTimestamp = this.forecast.daily.data.map( day => day.time );
          this.weatherInfos.daily.daysSummary = this.forecast.daily.data.map( day => day.summary );
          this.weatherInfos.daily.tempMin = this.forecast.daily.data.map( day => parseFloat(day.temperatureMin) );
          this.weatherInfos.daily.tempMax = this.forecast.daily.data.map( day => parseFloat(day.temperatureMax) );
          this.weatherInfos.daily.windBearing = this.forecast.daily.data.map( day => day.windBearing );
          this.weatherInfos.daily.windSpeed = this.forecast.daily.data.map( day => day.windSpeed );
          this.weatherInfos.daily.cloudCover = this.forecast.daily.data.map( day => day.cloudCover );
          this.weatherInfos.daily.precipIntensity = this.forecast.daily.data.map( day => day.cloudCover );
          
          this.weatherInfos.current.summary = this.forecast.currently.summary;
          this.weatherInfos.current.humidity = (this.forecast.currently.humidity * 100).toFixed(1);
          this.weatherInfos.current.windSpeed = this.forecast.currently.windSpeed;
          this.weatherInfos.current.temp = this.forecast.currently.temperature;

          console.log('weatherInfos', this.weatherInfos);
        
        }

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
  @font-face {
  font-family: 'Butler';
  src: url('../fonts/Butler-Black.woff2') format('woff2'),
  url('../fonts/Butler-Black.woff') format('woff');
  font-weight: 900;
  font-style: normal;
  }

  @font-face {
  font-family: 'Karla';
  src: url('../fonts/Karla-Regular.ttf');
  }

  #app {
  padding: 30px;
  background-color : #f4f5f6;
  }

  /*MENU*/
  #menu{
  border: none;
  box-shadow: none;
  background: none;
  align-items: center;
  padding: 0 5%;
  }

  #title {
  font-family: Butler;
  font-size: 3em;
  color: #2b2b3a;
  padding: 0;
  margin: 0;
  display: inline-flex;
  }

  /*CONTENT*/

  #content{
  text-align: center;
  font-family: Karla;
  }

  h2{
  color: #254558;
  font-family: Karla !important;
  }

  h2 i{
  font-size: 0.7em;
  }

  .rows{
  display: flex;
  justify-content: space-between;
  }

  .rows > .ui.segment{
  width: 30%;
  margin: 0 !important;
  justify-content: space-between;
  margin-bottom: 1.66em !important;
  background-size: contain;
  background-position: right 30% bottom 50%;
  background-repeat: no-repeat;
  }

  #basic-infos > .ui.segment{
  display: flex;
  height: 100px;
  }

  #first-row > .ui.segment{
  height: 300px;
  }

  #basic-infos > .ui.segment:first-child{
  background-image: linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)),
  url("../images/temp.png");
  }
  #basic-infos > .ui.segment:nth-child(2){
  background-image: linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)),
  url("../images/humidity.png");
  }
  #basic-infos > .ui.segment:nth-child(3){
  background-image: linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)),
  url("../images/wind.png");
  }

  #basic-infos > .ui.segment > .ui.statistic{
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 10%;
  padding-right: 5%;
  width: 100%;
  }

  .label{
  margin-left: 5%;
  }

  .tiny{
  font-size: 0.5em;
  }

  #first-row .ui.segment > * {
  box-shadow: none;
  }

  #first-row > .ui.segment > .display:first-child{
  margin-bottom: 10px !important;
  }
  
  #graphs{
    display: flex;
    justify-content: space-between;
  }
  
  #right{
  width: 30%;
  }
  
  #left{
  width: 65%;
  }

</style>
