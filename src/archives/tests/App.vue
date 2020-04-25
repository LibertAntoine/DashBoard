<template>
	<div id="app">
		<ResponsiveAreaChart 
			@select="onSelect"
			class="area-chart"
			:data="data"
			:ceil="max" />
		<div class="content">
			<h3>Selected Value: {{ currentValue }}</h3>
			<div>
				<label>Record Count:</label>
				<input v-model="itemCount">
			</div>
			<div>
				<label>Min Value: </label>
				<input v-model="min">
			</div>
			<div>
				<label>Max Value: </label>
				<input v-model="max">
			</div>
		</div>
	</div>
</template>

<script>
import ResponsiveAreaChart from './components/D3/vuejs-d3-responsive-areachart'
import generateData from './randomData'

export default {
	name: 'App',
	components: {
		//D3LineChart,
		ResponsiveAreaChart
	},
	data() {
		return {
			data: [],
			chartWidth: 0,
			currentValue: null,
			itemCount: 25,
			min: 10,
			max: 100
		}
	},
	mounted() {
		setInterval(() => {
			this.data = generateData(this.itemCount,
			parseInt(this.min, 10),
			parseInt(this.max, 10))
		}, 2000);
	},
	methods: {
		onSelect(value) {
			this.currentValue = value;
		}
	}
}
</script>

<style lang="less">
body {
	background-color: white;

	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
		margin-top: 60px;

		h1, .content {
			margin-left: 20px;
		}
		
		label {
			display: inline-block;
			width: 150px;
		}

		.area-chart {
			height: 300px;
		}
	}
}
</style>
