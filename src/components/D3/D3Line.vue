<template>
	<div class="line-chart-container">
		<div class="toggle">
			<input type="checkbox" v-model="drawLine">Toggle overlay
		</div>
		<svg ref="svg" id="svg">
		</svg>
	</div>
</template>

<script>
import * as d3 from 'd3'
import TWEEN from '@tweenjs/tween.js'
import easingFunctions from '../../services/helpers/easingFunctions'

export default {
	name: 'D3Line',
	props: { 
		data: {
			type: Array,
			required: true
		},
		timestamp: {
			type: Array,
			require: true
		},
		height: {
			type: Number,
			default: 400
		},
		width: {
			type: Number,
			default: 600
		}
	},

	computed: {
		aspect () { return this.width / this.height },
		time() {
			if ( this.timestamp.length > 0) {
				const dates = this.timestamp.map(ts => new Date(ts * 1000));
				const week = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
				const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
				return dates.map(d => `${week[d.getDay()]} ${d.getDate()}`);
			} else {
				return []
			}
			
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
			drawLine: false,
			animationInProgress: false
		}
	},

	watch: {
		async data(newData, oldData) {
			// console.log('data changed : ', newData);
			const waintingCallAnim = () => { 
				if ( !this.animationInProgress ) { // wait until current animation was done
					this.animData();
				}else {
					setTimeout(() => waintingCallAnim(), 100);
				}
			}
			waintingCallAnim(newData);
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
		// prevent animation & wrong scale if data is empty
		if (this.data.length > 0) { this.animData(); }
	},
	methods: {
		async animData() {
			this.animatedData = [] // reset animatedData
			this.animationInProgress = true; // lock for new incoming data
			this.scaleX = d3.scaleBand().range([50, this.width + 50]).domain(this.data.map((el, i) => i))
			await this.showDotsgradually();
			// console.log('after showDotsgradually');
			this.tweenDots().onComplete(() => {
				// console.log('after tweenDots');
				this.buildAxis();
				this.buildLines();
				this.animationInProgress = false; // unlock
			})
		},
		buildLines() {

			d3.select(this.$refs.svg).selectAll(".line").remove();
			const lines = d3.range(5, 40, 5);

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
			const constPushValue = (i) => {
				this.animatedData.push(15);
				// console.log(`${i}:animatedData`, this.animatedData);
				this.buildDots();
			}
			const timeOffset = 500;
			const animationDuration = 3000;
			return new Promise(resolve => {
				setTimeout(() => {
					for (let i = 0; i < this.data.length; i++) {
						// console.log('delay:',(animationDuration / this.data.length) * easingFunctions.outSine(i / this.data.length));
						setTimeout(() => constPushValue(i), (animationDuration / this.data.length) * easingFunctions.outSine(i / this.data.length));		
					}
					setTimeout( () => resolve(), animationDuration / this.data.length);
				}, timeOffset);
			})
		},
		buildPath() {
			const path = d3.line().x((d, i) => this.scaleX(i)).y(d => this.scaleY(d))(this.data);
			this.path.attr('d', path);
			const pathLength = this.path.node().getTotalLength();
			this.path.attr('stroke-dasharray', `${pathLength} ${pathLength}`)
				.attr('stroke-dashoffset', pathLength)
				.transition().duration(1000).ease(d3.easeSinOut)
				.attr('stroke-dashoffset', 0)

			const area = d3.area().x((d, i) => this.scaleX(i)).y0(d => this.scaleY(d)).y1(this.scaleY(0))(this.data);

			//const tempZone = d3.select(this.$refs.svg)
				//.selectAll('path.area')
				//.data([null])
			d3.select(this.$refs.svg).select('path.area')
				.remove()

			d3.select(this.$refs.svg)
				.append('path')
				.attr('class', "area")
				.attr('d', area)
				.attr('opacity', 0)
				.transition().duration(1000).ease(d3.easePolyIn)
				.attr('opacity', 1)
			
		},
		removePath() {
			const pathLength = this.path.node().getTotalLength();

			this.path
				.transition().duration(1000).ease(d3.easeSinOut)
				.attr('stroke-dashoffset', -pathLength);

			this.path
				.attr('stroke-dashoffset', pathLength);

			d3.select(this.$refs.svg)
				.select('path.area')
				.transition().duration(1000).ease(d3.easePolyIn)
				.attr('opacity', 0)
				//.remove()
		},
		buildAxis() {

			d3.select(this.$refs.svg).selectAll(".x_axis").remove();
			const scale = d3.scalePoint().domain(d3.range(5, 40, 5)).range([this.height - this.height/8, this.height/8])

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

			const dateScale = d3.scaleBand().range([10, this.width + 10]).domain(this.time);			

			d3.select(this.$refs.svg).append('g')
				.attr('class', "x_axis")
				.attr('transform', `translate(0, ${this.height - 30})`)
				.call(d3.axisBottom(dateScale))
				.call(g => g.select('.domain').remove())
		},
		buildDots() {
			this.dots = d3.select(this.$refs.svg).selectAll('g.dot').data(this.animatedData);
			//console.log('this.dots', this.dots);
			
			this.dots.exit().remove();
			
			const newDotGroup = this.dots.enter() // NOTE new dot
					.append('g')
					.classed('dot', true)
					.on('mouseover', this.dotMouseover)
					.on('mouseleave', this.dotMouseleave)

			newDotGroup.append('circle') // NOTE second dot (not visible dot)
				.attr('class', "hover") 
			//.attr('r', 0)
			//.transition().duration(800)
				.attr('r', 11)
				.attr('opacity', 0.1)

			newDotGroup.append('circle') // NOTE first dot (visible dot)
					.attr('class', "visible")
					.attr('r', 9)
					.transition().duration(800)
					.attr('r', 4)

			this.dots.merge(newDotGroup).attr('transform', (d, i) => { // NOTE update dots
					// console.log(`d: ${d} i:${i}`);
					return `translate(${this.scaleX(i)}, ${this.scaleY(d)})`
			})
		},
		dotMouseover(d, i, nodes) {
			d3.select(nodes[i]).select(".hover")
				.transition().duration(200)
				.attr('opacity', 1)

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

			d3.select(nodes[i]).select(".hover")
				.transition().duration(800)
				.attr('opacity', 0.1)
		},
		buildSVG() {
			const svg = d3.select(this.$refs.svg);
			const container = d3.select('.line-chart-container');
			svg.attr("viewBox", "0 0 " + this.width + " " + this.height)
				.attr("preserveAspectRatio", "xMinYMid")
				.call(this.resizeSvg);
			d3.select(window).on("resize." + container.attr("id"), () => this.resizeSvg(svg));

			const defs = svg.append("defs");

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
				.attr("stop-color", "#ff3b3b")
				.attr("stop-opacity", 0.7);

			gradient.append("stop")
				.attr('class', 'start')
				.attr("offset", "26%")
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

			this.rangeY = d3.scaleLinear().range([this.height, 0]);
			this.scaleY = this.rangeY.domain([0, 40]);
			this.path = svg.append('path');
		},

		resizeSvg(svg) {
			console.log('resizeSvg');
			const targetWidth = parseInt(d3.select('.line-chart-container').node().getBoundingClientRect().width);
			svg.attr("width", targetWidth);
			svg.attr("height", Math.round(targetWidth / this.aspect));
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
.line-chart-container {
	.toggle {
		margin: auto;
		input {
			margin-right: 15px;
		}
	}

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
					cursor: pointer;
				}
			}

		}

		line {
			stroke: gray;
			stroke-width: 1px;
		}
	}
}
</style>
