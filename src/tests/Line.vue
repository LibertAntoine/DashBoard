<template>
	<div id="app">
		<LineChart />
	</div>
</template>

<script>
import LineChart from './components/D3/line.vue'

export default {
	name: 'App',
	components: {
		LineChart
	}
}
</script>

<style>
body {
	background-color: white;
}
</style>
