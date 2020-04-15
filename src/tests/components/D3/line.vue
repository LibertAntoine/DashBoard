<template>
	<div class="line-chart-container">
		<svg ref="svg" width="600" height="500">
		</svg>
	</div>
</template>

<script>
import * as d3 from 'd3'
import TWEEN from '@tweenjs/tween.js'

export default {
	name: 'line-chart',
	props: { 
		data: {
			type: Array,
			default: () => [10, 7, 12, 21, 20, 22]
		}
	},
	data() {
		return {
			scaleX: null,
			scaleY: null,
			animatedData: [],
			path: null,
			dots: null,
			dotsHover: null,
			range: []
		}
	},
	watch: {
		data(newData, oldData) {
			this.tweenData(newData, oldData);
		}
	},
	async mounted() {
		this.buildSVG();
		this.buildDots();
		await this.showDotsgradually()
		this.tweenDots()
			.onComplete(this.buildLines)
	},
	methods: {
		buildLines() {
			const lines = d3.range(0, 30, 5);
			d3.select(this.$refs.svg).selectAll('line')
				.data(lines)
				.enter()
				.append('line')
				.attr('x1', this.scaleX(0))
				.attr('y1', d => this.scaleY(d))
				.attr('x2', this.scaleX(this.data.length - 1))
				.attr('y2', d => this.scaleY(d))
				.attr("transform", (d, i) => "translate(" + ( - 600 - (lines.length-1-i) * 150) + ", 0)")
				.transition().duration(750).ease(d3.easeLinear)
				.attr("transform", () => "translate(0, 0)")
		},
		tweenDots() {
			function animate(time) {
				requestAnimationFrame(animate);
				TWEEN.update(time);
			}
			requestAnimationFrame(animate);
			return new TWEEN.Tween(this.animatedData)
				.to(this.data, 1000)
				.easing(TWEEN.Easing.Quadratic.Out)
				.delay(500)
				.onUpdate(() => {
					this.dots = d3.select(this.$refs.svg).selectAll('circle.dot')
						.data(this.animatedData)
						.attr('cy', d => this.scaleY(d))
				})
				.start()
		},
		tweenData(newData, oldData) {
			function animate(time) {
				requestAnimationFrame(animate);
				TWEEN.update(time);
			}
			requestAnimationFrame(animate);
			new TWEEN.Tween(oldData)
				.easing(TWEEN.Easing.Quadratic.Out)
				.to(newData, 1000)
				.onUpdate(() => {
					this.animatedData = oldData;
					this.update();
				})
				.start();
		},

		showDotsgradually() {
			return new Promise(resolve => {
				let item = 0;
				setTimeout(() => {
					for (let i=0; i<this.data.length; i++) {
						setTimeout(() => {
							this.animatedData.push(15);
							this.buildDots();
							item += 20;

							if (i == this.data.length - 1)
								resolve();
						}, ((400 / this.data.length) - item) * i);
					}
				}, 1500)
			})
		},
		createPath() {
			return d3.line().x((d, i) => this.scaleX(i)).y(d => this.scaleY(d))(this.animatedData);
		},
		buildDots() {
			this.dots = d3.select(this.$refs.svg).selectAll('circle.dot')
				.data(this.animatedData)
				.enter()
				.append('circle')
				.classed('dot', true)
				.attr('cx', (d, i) => this.scaleX(i))
				.attr('cy', d => this.scaleY(d))
				.attr('r', 4)
				.attr('class', "dot");

			this.dotsHover = d3.select(this.$refs.svg).selectAll('circle.hover')
				.data(this.data)
				.enter()
				.append('circle')
				.classed("hover", true)
				.attr('cx', (d, i) => this.scaleX(i))
				.attr('cy', d => this.scaleY(d))
				.attr('r', 11)
				.on('mouseover', this.logHover)
		},
		logHover(event) {
			console.log(event)
		},
		buildSVG() {
			this.scaleX = d3.scaleLinear().range([10, 590]).domain([0, this.data.length - 1]);
			this.rangeY = d3.scaleLinear().range([500, 0]);
			this.scaleY = this.rangeY.domain([0, 30]);
			this.path = d3.select(this.$refs.svg)
				.append('path');
		},
		update() {
			this.path.attr('d', this.createPath());
			const totalLength = this.path.node().getTotalLength();
			this.path
				.attr("stroke-dasharray", totalLength)
				.attr("stroke-dashoffset", totalLength)
				.transition().duration(4000).ease(d3.easeLinear)
				.attr("stroke-dashoffset", 0);
		}
	}
}
</script>

<style lang="less">
svg {
	path {
		fill: none;
		stroke-width: 2px;
		stroke: lightcoral;
	}

	circle {

		&.dot {
			fill: black;
		}

		&.hover {
			fill: lightblue;
			opacity: .5;
		}
	}

	line {
		stroke: gray;
		stroke-width: 1px;
	}
}
</style>
