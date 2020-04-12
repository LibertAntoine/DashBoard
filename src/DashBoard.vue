<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <DropDown :options="citiesList" :selected='this.city' @update="(city) => this.city = city"/> <br>
    <BarChart id='BarChart' 
      :labels="this.labels" 
      :datasets="
        [{
          label: this.city + ' Temperature (F°)',
          backgroundColor: '#f87979',
          data: this.datasets
        }]
      "
    />
    <LineChart id='LineChart' 
      :labels="this.labels" 
      :datasets="
        [{
          label: this.city + ' Temperature (F°)',
          backgroundColor: '#1B157C',
          data: this.datasets
        }]
      "
    />
  </div>
</template>

<script>
import DataApi from './services/Api/Data'
import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
import DropDown from './components/DropDown'
import { dayTimeToDate } from './services/helpers/conversion'

export default {
  name: 'App',
  components: {
    BarChart,
    LineChart,
    DropDown
  },
  data () {
    return {
      citiesList: ['London', 'Paris', 'Madrid'],
      labels: [],
      datasets: [],
      city: "London"
    }
  },
  created () {
    this.updateData(this.city);
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

#BarChart, #LineChart {
  display: inline-block;
  padding: 40px;
  width: 500px;
}

</style>
