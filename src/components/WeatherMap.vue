<template>
  <div class="WeatherMap">
      <iframe
          id="map-embed-iframe"
          frameborder="0"
          height="500px"
          width="500px"
          :src='embedURL'>
          </iframe>
  </div>
</template>

<script>

export default {
  name: 'WeatherMap',
  props: {
        embedURL: {}
  }
}
</script>

<style>
body {
  font-size: 1em;
}
</style>