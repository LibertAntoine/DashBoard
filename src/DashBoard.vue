<template>
  <div id='app'>

    <!-- ----- MENU ----- -->
    <div id='menu'>
      <h1 id='title'>Weather Board</h1>
      <label for="hamburger">&#9776;</label>
      <input type="checkbox" id="hamburger"/>
      <sui-menu floated='right' compact class='basic-nav' >
        
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
    </div>

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
              :fillColor='"254558"'
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
                { x: weatherInfos.daily.daysLabels, y: weatherInfos.daily.tempMin, type: 'bar', name: 'Min', 
                marker: {
                  color: '#254558'}},
                { x: weatherInfos.daily.daysLabels, y: weatherInfos.daily.tempMax, type: 'bar', name: 'Max',
                marker: {
                  color: '#F4901E'}}
                ]"
                :range='[Math.min(...weatherInfos.daily.tempMin) - 5, Math.max(...weatherInfos.daily.tempMax)]'
                title='Temperature (°C)'
                :height='300'
              />

          <sui-segment id='wtemp'>
            <h2> Weekly maximum temperature </h2>
            <!--TODO bring actual dates in-->
            <D3Line :data="weatherInfos.daily.tempMax" :timestamp="[1587592800, 1587679200, 1587765600, 1587852000, 1587938400, 1588024800, 1588111200, 1588197600]" />
          </sui-segment>
        </div>
      </div>

      <RainModal :timestamp="weatherInfos.daily.daysTimestamp" :precipIntensity="weatherInfos.daily.precipIntensity" ref='rainModal'/>
      <MapModal ref='mapModal' @select='updateLocationFromModal'/>
    </div>
  </div>
</template>

<script>
import IpGeo from './services/Api/IpGeo'
import DarkSkyData from '@/services/Api/DarkSkyData';

import { dayTimeToDate } from './services/helpers/conversion'

import CelestialDisplay from './components/CelestialDisplay'
import MoonPhase from './components/MoonPhase'
import MapModal from './components/MapModal'
import RainModal from './components/RainModal'
import WeatherMap from './components/WeatherMap'
import GraphBar from './components/GraphBar'
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
	  D3Line
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
    const getGeoloc = await IpGeo.getLocation();
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
          console.err(result.error);
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
        // console.log('forecast', this.forecast);

        if (this.forecast.error) {
          console.err(`Error : ${this.forecast.error}`);
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
        }

        // -----sun & moon -----
  const astroInfos = await IpGeo.getLocationInfos(this.location.lat, this.location.lng);
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

  /*NAVIGATION HAMBURGER*/

  /*function hamburger() {
  var x = document.getElementById("menu");
  if (x.className === "basic-nav") {
  x.className += " responsive";
  } else {
  x.className = "basic-nav";
  }
  }*/
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

  .ui.modal>.header, .ui.button, .ui.header,
  .ui.statistic>.value, .ui.statistics .statistic>.value{
  font-family: 'Karla' !important;
  color: #2b2b3a !important;
  }

  /*MENU*/
  #menu{
  border: none;
  box-shadow: none;
  background: none;
  align-items: center;
  padding: 0 5%;
  }

  #menu label, #hamburger {
  display: none;
  float: right;
  position: absolute;
  right: 0;
  top: 0;
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
  color: #2b2b3a;
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

  #right h2{
  margin-left: 10px;
  margin-top: 3px;
  font-size: 1.71428571rem;
  }

  #wtemp{
  padding: 5px;
  }

  /*RESPONSIVE*/

  @media (max-width: 1024px) {
  #app .ui.statistic>.value, #app .ui.statistics .statistic>.value{
  font-size: 3em !important;
  }

  .rows > .ui.segment{
  background-position: right 0% bottom 50%;
  }

  #first-row > .ui.segment{
  height: 200px;
  }

  #graphs{
  flex-direction: column;
  }

  #left{
  width: 100%;
  height: 400px;
  }

  #right {
  height: 400px;
  display: inline-flex;
  margin-top: 20px;
  width: 100%;
  }

  #right > .ui.segment{
  margin: 0;
  width: 50%;
  }
  }

  @media (max-width: 450px) {

  #menu label {
  display: inline-block;
  color: #f4f5f6;
  background: #2b2b3a;
  font-style: normal;
  font-size: 1.2em;
  padding: 10px;
  }

  .basic-nav{
  display: none !important;
  }
  #menu input:checked ~ .basic-nav {
  display: inline-flex !important;
  }

  #basic-infos > .ui.segment{
  height: 50px;
  padding: 2px;
  }

  #app .ui.statistic>.value, #app .ui.statistics .statistic>.value{
  font-size: 2em !important;
  font-variant: unicase;
  }
  .tiny {
  font-size: 0.59em;
  }
  .ui.large.header{
  font-size: 1em !important;
  }

  .ui.large.header {
  font-size: 1em;
  margin-bottom: 5px;
  }

  #first-row{
  flex-wrap: wrap;
  }

  #first-row > .ui.segment{
  height: 120px;
  width: 47.5%;
  }

  #first-row > .ui.segment:first-child{
    width: 100%;
  }

  #title{
  font-size: 2.5em;
  }

  #right{
  flex-direction: column;
  height: inherit;
  }

  #graphBar, #right > .ui.segment{
  width: 100%;
  }

  #right > .ui.segment{
  margin-top: 20px;
  }

  #right h2{
  font-size: 1em;
  }
  }

</style>
