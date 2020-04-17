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
			circles: {},
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
		//this.buildDots();
		await this.showDotsgradually()
		this.tweenDots()
			.onComplete(this.buildLines)
	},
	methods: {
		buildLines() {
			const lines = d3.range(0, 30, 5);

			const size = this.scaleX(this.data.length - 1) - this.scaleX(0);

			const line = d3.select(this.$refs.svg).selectAll('line.line')
				.data(lines)
				.enter()
				.append('line')
					.attr('class', "line")
					.attr('x1', this.scaleX(0))
					.attr('y1', d => this.scaleY(d))
					.attr('x2', this.scaleX(this.data.length - 1))
					.attr('y2', d => this.scaleY(d))
				.attr('stroke-dasharray', size)
				.attr('stroke-dashoffset', (d, i) => size + i * 100)
				.attr('opacity', 0)

			// NOTE line opacity
			// This method of passing via each is necessary to catch the index, selection.call can't get it apparently
			line.each((d, i, nodes) => {
				d3.select(nodes[i]).call(opacityAnim, 400, i)
			})

			function opacityAnim(line, duration, index) {
				d3.select({}).transition().duration(duration)
					.tween("attr:opacity", function() {
						const interpolate = d3.interpolateNumber(0, 1)
						return function(t) { 
							line.attr("opacity", interpolate(t));
						};
					});
			}

			// NOTE line move
			line.transition().duration(750).ease(d3.easeQuadInOut)
				.attr('stroke-dashoffset', 0)
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
				.onUpdate(this.buildDots)
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
					for (let i = 0; i < this.data.length; i++) {
						setTimeout(async () => {
							this.animatedData.push(15);
							this.buildDots();
							item += 20;
							if (i == this.data.length - 1)
								resolve();
						}, ((800 / this.data.length) - item) * i);
					}
				}, 1500)
			})
		},
		createPath() {
			return d3.line().x((d, i) => this.scaleX(i)).y(d => this.scaleY(d))(this.animatedData);
		},
		buildDots() {
			this.dots = d3.select(this.$refs.svg).selectAll('g.dot')
				.data(this.animatedData);

			const y_axis = d3.axisLeft()
				.scale(this.scaleY)
				.tickPadding(-6)
				.ticks(5)

			const y_axisEl = d3.select(this.$refs.svg).selectAll('g.y_axis').data([null])
			y_axisEl.enter().append('g')
				.attr('class', "y_axis")
				.attr('style', "font-size: 1em")
				.merge(y_axisEl)
				.attr('transform', "translate(15, 0)")
				.call(y_axis).call(g => g.select('.domain').remove())
				.call(g => g.select('line').remove())
			

			// NOTE dots that are no longer here
			this.dots.exit().remove();

			// NOTE new dots
			const g = this.dots.enter()
					.append('g')
					.classed('dot', true)
					.on('mouseover', this.logHover)

			// NOTE first dot (visible dot)
			g.append('circle')
					.attr('class', "visible")
					.attr('r', 9)
					.transition().duration(800)
					.attr('r', 4)

			// NOTE second dot (not visible dot)
			g.append('circle')
					.attr('class', "hover") 
					.attr('r', 0)
					.transition().duration(800)
					.attr('r', 11)

			// NOTE new and updated dots
			this.dots.merge(g)
				.attr('transform', (d, i) => {
					return `translate(${this.scaleX(i)}, ${this.scaleY(d)})`
				})
		},
		logHover(event) {
			console.log(event)
		},
		buildSVG() {
			this.scaleX = d3.scaleBand().range([30, 590]).domain(this.data.map((el, i) => i))
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

	g.dot {

		circle {
			fill: black;

			&.hover {
				fill: lightblue;
				opacity: .5;
			}
		}

	}

	line {
		stroke: gray;
		stroke-width: 1px;
	}
}
</style>
