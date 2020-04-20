<template>
	<div class="line-chart-container">
		<svg ref="svg" width="600" height="500">
		</svg>
		<input type="checkbox" v-model="line">
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
			default: () => [10, 7, 12, 21, 20, 22, 24, 2, 8]
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
			range: [],
			drawLine: false
		}
	},
	computed: {
		line: {
			set(value) {
				this.drawLine = value
			},
			get() {
				return this.drawLine
			}
		}
	},
	watch: {
		data(newData, oldData) {
			this.tweenData(newData, oldData);
		},
		drawLine(newData, oldData) {
			if (oldData === false)
				this.buildPath();
			else 
				this.removePath()
		}
	},
	async mounted() {
		this.buildSVG();
		await this.showDotsgradually()
		this.tweenDots()
			.onComplete(() => {
				this.buildAxis();
				this.buildLines();
			})
	},
	methods: {
		buildLines() {
			const lines = d3.range(5, 30, 5);

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
		buildPath() {
			const path = d3.line().x((d, i) => this.scaleX(i)).y(d => this.scaleY(d))(this.animatedData);
			this.path.attr('d', path);
			const pathLength = this.path.node().getTotalLength();
			this.path.attr('stroke-dasharray', `${pathLength} ${pathLength}`)
				.attr('stroke-dashoffset', pathLength)
				.transition().duration(1000).ease(d3.easeSinOut)
				.attr('stroke-dashoffset', 0)

			const area = d3.area().x((d, i) => this.scaleX(i)).y0(d => this.scaleY(d)).y1(this.scaleY(0))(this.animatedData);
			d3.select(this.$refs.svg).selectAll('path.area').data([null])
				.enter()
				.append('path')
				.attr('class', "area")
				.attr('d', area)
				.attr('opacity', 0)
				.transition().duration(1000).ease(d3.easePolyIn)
				.attr('opacity', 1)
			
		},
		removePath() {
			this.path.attr('d', "");
		},
		buildAxis() {
			const scale = d3.scalePoint().domain(d3.range(5, 26, 5)).range([500 - 500/6, 500/6])

			const y_axis = d3.axisLeft(scale)
				.tickPadding(-6)
				.ticks(5)
				.tickFormat((d) => d+"°")

			const y_axisEl = d3.select(this.$refs.svg).selectAll('g.y_axis').data([null])
			y_axisEl.enter().append('g')
				.attr('class', "y_axis")
				.attr('style', "font-size: 1em")
				.merge(y_axisEl)
				.attr('transform', "translate(35, 0)")
				.call(y_axis)
				.call(g => g.select('.domain').remove())
				.call(g => g.selectAll('line').remove())
			
		},
		buildDots() {
			this.dots = d3.select(this.$refs.svg).selectAll('g.dot')
				.data(this.animatedData);

			// NOTE dots that are no longer here
			this.dots.exit().remove();

			// NOTE new dots
			const g = this.dots.enter()
					.append('g')
					.classed('dot', true)
					.on('mouseover', this.dotMouseover)
					.on('mouseleave', this.dotMouseleave)

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
		dotMouseover(d, i, nodes) {
			console.log('hover')
			d3.select(nodes[i])
				.selectAll('text').data([null]).enter()
				.append('text')
				.text(this.data[i] + "°C")
				.attr('text-anchor', "middle")
				.attr('opacity', 0)
				.attr('pointer-event', "none")
				.transition().duration(500).ease(d3.easePolyOut)
				.attr('opacity', 1)
				.attr('transform', "translate(0, -20)")
		},
		dotMouseleave(d, i, nodes) {
			d3.select(nodes[i])
				.select('text')
				.attr('opacity', 1)
				.transition().duration(500).ease(d3.easePolyOut)
				.attr('opacity', 0)
				.attr('transform', "translate(0, -10)")
				.remove()
		},
		buildSVG() {
			const defs = d3.select(this.$refs.svg).append("defs");

			const gradient = defs.append("linearGradient")
				.attr("id", "svgGradient")
				.attr("gradientUnits", "userSpaceOnUse")
				.attr("x1", "0%")
				.attr("x2", "0%")
				.attr("y1", "0%")
				.attr("y2", "100%");

			gradient.append("stop")
				.attr('class', 'start')
				.attr("offset", "0%")
				.attr("stop-color", "#c45454")
				.attr("stop-opacity", 0.7);

			gradient.append("stop")
				.attr("offset", "80%")
				.attr("stop-color", "#0083c4")
				.attr("stop-opacity", 0.1);

			gradient.append("stop")
				.attr('class', 'end')
				.attr("offset", "100%")
				.attr("stop-color", "#0083c4")
				.attr("stop-opacity", 0);

			this.scaleX = d3.scaleBand().range([50, 590]).domain(this.data.map((el, i) => i))
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
	/*background: lightgray;*/

	path {
		fill: none;
		stroke-width: 4px;
		stroke: lightseagreen;

		&.area {
			fill: url(#svgGradient);
			stroke: none;
		}
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
