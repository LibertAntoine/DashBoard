<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <p> ton ip est : {{ this.clientIp }} </p>
    <DropDown 
      :options='citiesList' 
      :placeholderText='"select a city"' 
      @update="(city) => this.city = city"
    /> 
    <SunDisplay
      width= '300px'
      :sunriseHours= this.locationInformation.sunrise
      :sunsetHours= this.locationInformation.sunset
    />
    <BarChart id='BarChart' class="graph"
      :labels="this.labels" 
      :datasets="
        [{
          label: this.city + ' Temperature (F°)',
          backgroundColor: '#f87979',
          data: this.datasets
        }]
      "
    />
    <LineChart id='LineChart' class="graph"
      :labels="this.labels" 
      :datasets="
        [{
          label: this.city + ' Temperature (F°)',
          backgroundColor: '#1B157C',
          data: this.datasets
        }]
      "
    />

    <Plotly class="graph"
      :data="[{ x: this.labels, y: this.datasets, type: 'bar' }]"
      :layout="{ 
        title: this.city + ' Temperature (F°)',
        yaxis: {range: [Math.min(...this.datasets), Math.max(...this.datasets)]}
      }"
      />

  </div>
</template>

<script>
import DataApi from './services/Api/Data'
import { dayTimeToDate } from './services/helpers/conversion'

import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
import DropDown from './components/DropDown'
import SunDisplay from './components/SunDisplay'
import { Plotly } from 'vue-plotly'

export default {
  name: 'App',
  components: {
    BarChart,
    LineChart,
    DropDown,
    Plotly,
    SunDisplay
  },
  data () {
    return {
      citiesList: ['London', 'Paris', 'Madrid'],
      labels: [],
      datasets: [],
      city: 'London',
      clientIp: '',
      locationInformation: {
        sunset: '00:00',
        sunrise: '00:00'
      },
      location: {}
    }
  },
  async created () {
    this.clientIp = await DataApi.getMyIp();
    this.location = await DataApi.getLocation();
    // update location information with our longitude & latitude
    this.locationInformation = await DataApi.getLocationInfos(this.location.lat, this.location.long);
  },

  watch: { // define watcher on our variable city and update the data if it changes
    city: function (newCity) {
      console.log('Selected city: ' + newCity)
      this.updateData(newCity)
    }
  },
  methods: {
      async updateData (city) {
        console.log('update data for ' + city)
        const dataAPI = await DataApi.getCity16days(city); // use local data instead
        // const dataAPI = await DataApi.getLocalCity16days(this.city).data; // get data
        this.labels = dataAPI.data.list.map( day => dayTimeToDate(day.dt))
        this.datasets = dataAPI.data.list.map( day => parseInt(day.main.temp))
      }
  }
}
</script>

<style>
#app {
  padding: 30px;
}

.graph {
  display: inline-block;
  padding: 40px;
  width: 500px;
}

</style>
