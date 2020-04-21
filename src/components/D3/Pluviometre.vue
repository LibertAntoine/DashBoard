<template>
	<div class="pluviometre">
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
	name: 'Pluviometre',
	props: {
		'mm': {
			type: Number,
			default: () => 0
		},
		'max': {
			type: Number,
			default: () => 40
		}
	},
	data() {
		return {
			water: 20
		}
	},
	mounted() {
		this.buildAxis();
		this.updateWater(0)
		//setTimeout(this.updateWater, 1000)
	},
	watch: {
		water() {
			this.updateWater()
		},
		mm() {
			this.updateWater()
		},
		max() {
			this.buildAxis();
			this.updateWater();
		}
	},
	methods: {
		setTo0() {
			this.updateWaterNoAnim(0);
		},
		updateWaterNoAnim(level) {
			const svg = d3.select(this.$refs.svg)
			const water = svg.select('.water')

			const scale = d3.scaleLinear().range([0, 409.6 - 21.8 - (80 - 51.2)]).domain([0, this.max])

			const scaleHeight = d3.scaleLinear().range([21.8, 409.6 - (80 - 51.2)]).domain([0, this.max])

			const baseY = (409.6 - 50) + 80;

			water.data([ (level !== undefined) ? level : this.mm ])
				.attr("height", d => scaleHeight(d))
				.attr('y', d => baseY - scale(d))
		},
		updateWater(level) {
			const svg = d3.select(this.$refs.svg)
			const water = svg.select('.water')

			const scale = d3.scaleLinear().range([0, 409.6 - 21.8 - (80 - 51.2)]).domain([0, this.max])

			const scaleHeight = d3.scaleLinear().range([21.8, 409.6 - (80 - 51.2)]).domain([0, this.max])

			const baseY = (409.6 - 50) + 80;

			water.data([ (level !== undefined) ? level : this.mm ])
				.transition().duration(1500).ease(d3.easeElasticOut)
				.attr("height", d => scaleHeight(d))
				.attr('y', d => baseY - scale(d))
		},
		buildAxis() {
			const svg = d3.select(this.$refs.svg)
			//const height = svg.select('.glass').node().height.baseVal.value - 50;
			const scaleY = d3.scaleLinear().range([359.6, 0]).domain([0, this.max])

			const axisF = d3.axisLeft(scaleY)
				.tickSize([20])
				//.tickValues(d3.range(5, this.max, (this.max - 5) / 5 ))
				//.tickValues([this.max, 5])
				.tickPadding([13])
				.tickFormat(d3.format("d"))
				//.tickSizeInner([24])

			svg.select('#Page-1').select('g.axis').remove()

			svg.select('#Page-1')
				.append('g')
				.attr('class', "axis")
				.attr('transform', "translate(100, 80)")
				.attr('font-weight', "bold")
				.call(axisF)
				.call(g => g.select('.domain').remove())
				.attr('font-size', "20px")
				.selectAll('text')
				.attr('color', "white")
				.select(function() { 
					return this.parentNode
				}).selectAll('text.t-stroke').data((d, i, nodes) => {
					return [{
						d, 
						x: d3.select(nodes[i]).select('text').attr('x'),
						dy: d3.select(nodes[i]).select('text').attr('dy')
					}]
				}).enter().insert('text', 'text').text(d => {
					return d3.format("d")(d.d);
				})
				.attr('class', "t-stroke")
				.attr('x', d => d.x)
				.attr('dy', d => d.dy)
		}
	}
}
</script>

<style lang="less">
svg {
	width: 200px;

	.t-stroke {
		stroke: #0000004d;
		stroke-width: 3pt;
		stroke-linejoin: round
	}

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

