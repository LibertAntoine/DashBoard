<template>
  <div class="ui card localInfo">
    <div class="content">
        <div class="header">Weather today at : {{ this.address }}</div>
    </div>
    <div class="content">
    <h2 class="ui header">{{ this.currentSummary }}</h2>
    
  </div>
  <div class="ui statistics">
  <div class="statistic">
    <div class="value">
      {{ this.currentTemperature}} °C
    </div>
    <div class="label">
      Temperature
    </div>
  </div>
  <div class="statistic">
    <div class="value">
      {{ this.currentHumidity}} %
    </div>
    <div class="label">
      Humidity 
    </div>
  </div>
  <div class="statistic">
    <div class="value">
      {{ this.currentWindSpeed }} km/h
    </div>
    <div class="label">
      WindSpeed
    </div>
  </div>
</div>
    </div>
</template>

<script>

export default {
  props: {
        forecast: {
            default: undefined,
            require : true
        },
        address: {
            type: String,
            default: '',
            require : true
        }
    },
    watch: { 
        forecast: function () { 
            if(this.forecast) {
                this.currentHumidity = (this.forecast.currently.humidity * 100).toFixed(1) || null
                this.currentSummary = this.forecast.currently.summary || null
                this.currentWindSpeed = this.forecast.currently.windSpeed * 1,852 || null
                this.currentTemperature = ((this.forecast.currently.temperature - 32) * 5/9).toFixed(1) || null
            }
        },
  },  
  name: 'LocalInfo',
  data() {
    return {
      currentHumidity: '',
      currentSummary: '',
      currentWindSpeed: '',
      currentTemperature: ''
    };
  },
  methods: {}
};
</script>

<style>
body {
  font-size: 1em;
}

.statistics {
    margin-left: auto !important;
    margin-right: auto !important;
    width: 100%;
    padding-bottom: 20px;
}
.localInfo {
    width: 400px !important;
    
}
</style>