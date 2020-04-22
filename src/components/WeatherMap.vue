<template>
  <div id="weatherMap" :style="'width: 100%; height:' + (parseInt(height) + 58) + 'px;'">
      <h2 id="mapTitle">{{ title }}</h2>
      <iframe
          id="map-embed-iframe"
          frameborder="0"
          :height='height'
          :width='"100%"'
          :src='embedURL'>
          </iframe>
  </div>
</template>

<script>
export default {
  name: 'WeatherMap',
  props: {
        embedURL: {type: String, require: true},
        title: {type: String, default: 'title'},
        height: {type: Number, default: 500}
  }
}
</script>

<style>
#weatherMap {
  background-color : white;
  padding : 5px;
  border-radius: .28571429rem;
  box-shadow: 0 1px 3px 0 #d4d4d5, 0 0 0 1px #d4d4d5;
}

#mapTitle {
  margin-left : 10px;
  margin-top : 3px;
}
</style>