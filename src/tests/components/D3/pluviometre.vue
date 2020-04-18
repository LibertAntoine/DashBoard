<template>
	<div>
		<svg ref="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 204.8 512">
			<g id="Page-1">
				<rect class="water" x="34.13" :y="(409.6 - 50) + 80" width="136.53" :height="409.6 - (439-51.2)"/>
				<rect class="cap" x="8.53" y="8.53" width="187.73" height="34.13" rx="8.53"/>
				<rect class="cap" x="8.53" y="469.33" width="187.73" height="34.13" rx="8.53"/>
				<rect class="cls-2" x="153.6" y="51.2" width="23.06" height="409.6"/>
				<rect class="glass" x="34.13" y="51.2" width="136.53" height="409.6"/>
				<path d="M187.73,336.6V51.2A17.07,17.07,0,0,0,204.8,34.13V17.07A17.07,17.07,0,0,0,187.73,0H17.07A17.07,17.07,0,0,0,0,17.07V34.13A17.07,17.07,0,0,0,17.07,51.2V460.8A17.07,17.07,0,0,0,0,477.87v17.06A17.07,17.07,0,0,0,17.07,512H187.73a17.07,17.07,0,0,0,17.07-17.07V477.87a17.07,17.07,0,0,0-17.07-17.07V336.6Zm-17.06-29.4V460.8H34.13V51.2H170.67v256ZM17.07,17.07H187.73V34.13H17.07ZM187.73,494.93H17.07V477.87H187.73Z"/>
				<path class="cls-4" d="M134.73,102.4a8.53,8.53,0,0,1-8.53-8.53V76.8a8.54,8.54,0,0,1,17.07,0V93.87A8.53,8.53,0,0,1,134.73,102.4Z"/>
				<path class="cls-4" d="M134.73,213.33a8.53,8.53,0,0,1-8.53-8.53V128a8.54,8.54,0,0,1,17.07,0v76.8A8.53,8.53,0,0,1,134.73,213.33Z"/>
			</g>
		</svg>
	</div>
</template>

<script>
import * as d3 from 'd3'

export default {
	name: 'pluviometre',
	data() {
		return {
			water: 20
		}
	},
	mounted() {
		this.buildAxis();
		setTimeout(this.updateWater, 500)
	},
	watch: {
		water() {
			this.updateWater()
		}
	},
	methods: {
		updateWater() {
			const svg = d3.select(this.$refs.svg)
			const water = svg.select('.water')

			const scale = d3.scaleLinear().range([0, 409.6 - 21.8 - (80 - 51.2)]).domain([0, 40])

			const scaleHeight = d3.scaleLinear().range([21.8, 409.6 - (80 - 51.2)]).domain([0, 40])

			const baseY = (409.6 - 50) + 80;

			water.data([this.water])
				.transition().duration(1500).ease(d3.easeElasticOut)
				.attr("height", (d, i, nodes) => {
					return scaleHeight(d)
				})
				.attr('y', (d, i, nodes) => {
					console.log(d)

					console.log(scale(40))
					return baseY - scale(d)
					//debugger
				})
			//debugger
		},
		buildAxis() {
			const svg = d3.select(this.$refs.svg)
			const height = svg.select('.glass').node().height.baseVal.value - 50;
			const scaleY = d3.scaleLinear().range([height - height / 8, 0]).domain([5, 40])
			const axisF = d3.axisLeft(scaleY).tickSize([20])
				.tickPadding([13])
				.tickSizeInner([24])

			console.log(scaleY(0))
			console.log(scaleY(40))

			const axis = svg.select('#Page-1').selectAll('.axis').data([null])
			axis
				.enter()
				.append('g')
				.attr('class', "axis")
				.attr('transform', "translate(90, 80)")
				.merge(axis)
				.attr('font-weight', "bold")
				.call(axisF)
				.call(g => g.select('.domain').remove())
				.attr('font-size', "12px")
				.selectAll('text')
				.attr('color', (d, i, nodes) => {
					return "white"
				}).select(function() { 
					return this.parentNode
				})
				.selectAll('text.t-stroke').data(d => {
					return [d]
				}).enter().append('text').text(d => d).attr('class', "t-stroke")
		}
	}
}
</script>

<style lang="less">
svg {
	width: 200px;

	#Page-1 {
		.water { fill: #b2d5f2 }
		.cap {fill:#9e9e9e;}
		.cls-2 {fill:#6e8691;}
		.cls-2, .glass {opacity:0.25;}
		.glass {fill:#0377bc;}
		.cls-4 {fill:#f5f5f5;}
	}
}
</style>

