<template>
  <div id="WeatherMap" :style="'width:' + (parseInt(width) + 10) + 'px; height:' + (parseInt(height) + 10) + 'px;'">
      <iframe
          id="map-embed-iframe"
          frameborder="0"
          :height='height'
          :width='width'
          :src='embedURL'>
          </iframe>
  </div>
</template>

<script>
export default {
  name: 'WeatherMap',
  props: {
        embedURL: {type: String, default: '', require:true},
        height: {type: Number, default: 500},
        width: {type: Number, default: 500}
  }
}
</script>

<style>
#WeatherMap {
  background-color : white;
  padding : 5px;
  border-radius: .28571429rem;
  box-shadow: 0 1px 3px 0 #d4d4d5, 0 0 0 1px #d4d4d5;
}
</style>