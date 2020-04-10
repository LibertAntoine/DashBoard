<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <select name="city" id="city-select" v-on:change="changeData">
        <option value="London">London</option>
        <option value="Paris">Paris</option>
        <option value="Madrid">Madrid</option>
    </select>
    <bar id='bar' 
      :labels="this.labels" 
      :datasets="
        [{
          label: this.city + ' Temperature (F°)',
          backgroundColor: '#f87979',
          data: this.datasets
        }]
      "
    />
    <lineChart id='line' 
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
import DataApi from './services/Api/Data.js'
import bar from './components/bar.js'
import line from './components/line.js'
import { dayTimeToDate } from './services/helpers/conversion'

export default {
  name: 'App',
  components: {
    bar,
    lineChart : line
  },
  data: function () {
    return {
      labels: [],
      datasets: [],
      city: "London"
    }
  },
  created () {
    this.printData();
  },
  methods: {
      async printData () 
      {
        console.log(this.city)
        let dataAPI = await DataApi.getCity16days(this.city);
        dataAPI.data.list.map((day) => {
          this.labels.push(dayTimeToDate(day.dt))
          this.datasets.push(parseInt(day.main.temp))
        });
      },
      async changeData (e)
      {
       this.city = e.target.value;
       await this.printData();
      }
  }

}
</script>

<style>
#app {
  padding: 30px;
}

#bar {
  padding: 40px;
}


</style>
