<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <DropDown :options="citiesList" :selected='this.city' @update="(city) => this.city = city"/> <br>
    <p> ton ip est : {{ this.clientIp }} </p>
    <div> {{ this.locationInformation }} </div>
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
import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
import DropDown from './components/DropDown'
import { dayTimeToDate } from './services/helpers/conversion'
import { Plotly } from 'vue-plotly'

export default {
  name: 'App',
  components: {
    BarChart,
    LineChart,
    DropDown,
    Plotly
  },
  data () {
    return {
      citiesList: ['London', 'Paris', 'Madrid'],
      labels: [],
      datasets: [],
      city: "London",
      clientIp: '',
      locationInformation: {}
    }
  },
  async created () {
    // this.updateData(this.city)
    this.clientIp = await DataApi.getMyIp()
    this.updatelocationInfos()
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
      },
      async updatelocationInfos () {
        this.locationInformation = await DataApi.getLocationInformations(this.clientIp)
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
