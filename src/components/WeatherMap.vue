<template>
  <div id="weatherMap" >
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
        embedURL: {type: String, require: true, default : ''},
        height: {type: Number, default: 500}
  }
}
</script>

<style>
  #weatherMap {
  background-color : white;
  box-shadow: 0 1px 2px 0 rgba(34,36,38,.15);
  padding: 1em 1em;
  border-radius: .28571429rem;
  border: 1px solid rgba(34,36,38,.15);
  height: 100%;
  }
  
  iframe{
    height: 100%;
   }
</style>