<template>
  <div id="infoCard" :style="'width:' + width + 'px; height:' + height + 'px;'">
    <div v-if="title" class="title">
        <h2>{{ title }}</h2>
    </div>
    <div v-if="datasets">
    <div v-for="data in datasets" :key="data.label" class="ui statistics">
    <div class="statistic">
        <div class="value">
        {{ data.value }}
        </div>
        <div class="label">
        {{ data.label }}
        </div>
    </div>
 </div>
 </div>
 </div>
</template>

<script>
export default {
  name: 'InfoCard',
  props: {
        datasets: {type: Array, default: null},
        title: {type: String, default: null},
        height: {type: Number, default: 200},
        width: {type: Number, default: 300}
    }
}
</script>

<style>
  .statistics {
  padding-left: 15px;
  }

  #infoCard{
  background-color : white;
  padding : 5px;
  border-radius: .28571429rem;
  box-shadow: 0 1px 3px 0 #d4d4d5, 0 0 0 1px #d4d4d5;
  margin: 5px;
  }

  #infoCard h1, h2, h3, h4, h5{
  font-family: Karla !important;
  color: #2b2b3a;
  }

  .title {
  margin-top: 5px;
  margin-left: 10px;
  height: 45px !important;
  }
</style>