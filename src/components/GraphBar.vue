<template>
  <div id="graphBar" ref="graphBar" :style="`height: ${this.height} px;`" >
    <h2 id="graphBarTitle">{{ title }}</h2>
    <Plotly id="graph" ref="plotly"
    :data="datasets"
    :layout="{
        autosize:true,
        yaxis: {range: range},
        barmode: 'group',
        margin: {l: 50, r: 50, b: 50, t: 50, pad: 4},
        font: {color:'#254558', size: 10, family: 'Karla'}
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
  mounted() {
    window.addEventListener('resize', this.resizeHandle)
    setTimeout(() => this.resizeHandle(), 100)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandle)
  },
  props: {
        datasets: {type: Array, require: true, default: null},
        range: {type: Array, require: true, default: null},
        title: {type: String, default: 'title'},
        height: {type: Number, default: 500},
        width: {type: Number, default: 500}
  },
  methods: {
    resizeHandle() {
      this.$refs.plotly.relayout({
        width: this.$refs.graphBar.clientWidth - 10 ,
        height: this.height
      });
    }
  }
}
</script>

<style>
#graphBar {
  background-color : white;
  padding : 5px;
  border-radius: .28571429rem;
  box-shadow: 0 1px 3px 0 #d4d4d5, 0 0 0 1px #d4d4d5;
}
#graphBarTitle {
    margin-left : 10px;
    margin-top : 3px;
}
#graph {
    padding-top : - 30px;
}

 @media (max-width: 1024px) {
#graphBar {
    width: 45%;
    margin-right: 5%;
    }
}
 @media (max-width: 450px) {
 #graphBarTitle {
    margin-left : 0px;
    font-size : 1em;
}
 }
</style>