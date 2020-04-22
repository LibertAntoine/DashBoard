<template>
  <sui-container fluid id='app'>

    <!-- ----- MENU ----- -->
    <sui-segment clearing id='menu'>
      <sui-header size='large' floated='left' id='title'>Weather Board</sui-header>  
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
                    <sui-header size='large'> {{ locationInformations.address.name }} </sui-header>
                    <sui-header size='small'> {{ locationInformations.address.street }} </sui-header>
                    <sui-statistic >
                      <sui-statistic-value> {{ weatherInfos.current.temp }} °C </sui-statistic-value>
                      <sui-statistic-label>temperature</sui-statistic-label>
                    </sui-statistic>
                  </sui-segment>
                </sui-grid-column>

                <sui-grid-column>
                  <sui-segment>
                    <sui-header size='large'> Details </sui-header>
                    <sui-statistics-group horizontal :columns='2'>
                      <sui-statistic in-group >
                        <sui-statistic-value> {{ weatherInfos.current.humidity }} % </sui-statistic-value>
                        <sui-statistic-label> Humidity </sui-statistic-label>
                      </sui-statistic>
                      <sui-statistic in-group>
                        <sui-statistic-value> {{ weatherInfos.current.windSpeed }} </sui-statistic-value>
                        <sui-statistic-label> <span class="tiny">km/h</span> <br/> Windspeed </sui-statistic-label>
                      </sui-statistic>
                    </sui-statistics-group>
                  </sui-segment>
                </sui-grid-column>

              </sui-grid-row>
              <sui-grid-row stretched>

                <sui-grid-column>
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
                </sui-grid-column>

                <sui-grid-column>
            	 <sui-grid :columns='2'>
						 	 <sui-grid-row>
						 	 	 <sui-grid-column>
                  	 	 	 <sui-segment>
                    		 	 	 <MoonPhase
                      		 	 	 :testPercentage='MoonPhaseTestPercentage'
                      		 	 	 width= 'auto'
                    			 	 	 />
                  	 	 	 </sui-segment>
							 	 </sui-grid-column>
						 	 	 <sui-grid-column fluid>
                  	 	 	 <sui-segment>
                    		 	 	 <RainButton @click.native="toggleRain"/>
                  	 	 	 </sui-segment>
							 	 </sui-grid-column>
						 	 </sui-grid-row>
            	 </sui-grid>
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
                { x: weatherInfos.daily.daysLabels, y: weatherInfos.daily.tempMin, type: 'bar', name: 'Min'},
                { x: weatherInfos.daily.daysLabels, y: weatherInfos.daily.tempMax, type: 'bar', name: 'Max'}
                ]"
                :range='[Math.min(...weatherInfos.daily.tempMin) - 5, Math.max(...weatherInfos.daily.tempMax)]'
                title='Temperature (°C)'
                :height='300'
              />
            </sui-segment>
          </sui-grid-column>

          <sui-grid-column>
            <sui-segment>
               <sui-header size='medium'> Weekly maximum temperature </sui-header>
					<!--TODO bring actual dates in-->
            <D3Line :data="weatherInfos.daily.tempMax" :height="350"/>
            </sui-segment>
          </sui-grid-column>

        </sui-grid-row>
      </sui-grid>

    </sui-container>
    <RainModal :forecast="forecast" ref='rainModal'/>
    <MapModal ref='mapModal' @select='updateLocationFromModal'/>
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
          daysSummary: [],
          tempMin: [],
          tempMax: [],
          windBearing: [],
          windSpeed: [],
          cloudCover: []
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
          this.weatherInfos.daily.daysSummary = this.forecast.daily.data.map( day => day.summary );
          this.weatherInfos.daily.tempMin = this.forecast.daily.data.map( day => parseFloat(day.temperatureMin) );
          this.weatherInfos.daily.tempMax = this.forecast.daily.data.map( day => parseFloat(day.temperatureMax) );
          this.weatherInfos.daily.windBearing = this.forecast.daily.data.map( day => day.windBearing );
          this.weatherInfos.daily.windSpeed = this.forecast.daily.data.map( day => day.windSpeed );
          this.weatherInfos.daily.cloudCover = this.forecast.daily.data.map( day => day.cloudCover );
          
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
