<template>
  <div id="graphBar" :style="'width:' + (parseInt(width) + 10) + 'px; height:' + (parseInt(height) + 58) + 'px;'">
    <h2 id="graphBarTitle">{{ title }}</h2>
    <Plotly id="graph"
    :data="datasets"
    :layout="{
        yaxis: {range: range},
        barmode: 'group',
        width: width,
        height: height,
        margin: {l: 50, r: 50, b: 50, t: 50, pad: 4}
    }"/>
  </div>
</template>

<script>
import { Plotly } from 'vue-plotly'

export default {
  name: 'GraphBar',
  components: {
      Plotly
  },
  props: {
        datasets: {type: Array, require: true},
        range: {type: Array, require: true},
        title: {type: String, default: 'title'},
        height: {type: Number, default: 500},
        width: {type: Number, default: 500}
  }
}
</script>

<style>
#graphBar {
  background-color : white;
  padding : 5px;
  border-radius: .28571429rem;
  box-shadow: 0 1px 3px 0 #d4d4d5, 0 0 0 1px #d4d4d5;
  margin: 5px;
}
#graphBarTitle {
    margin-left : 10px;
    margin-top : 3px;
}
#graph {
    padding-top : - 30px;
}
</style>