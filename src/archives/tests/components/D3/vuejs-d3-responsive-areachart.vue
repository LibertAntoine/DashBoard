<template>
	<div>
		<svg @mousemove="mouseover" :width="width" :height="height">
			<g :style="{ transform: `translate(${margin.left}px, ${margin.top}px)` }">
				<path class="area" :d="paths.area" />
				<path class="line" :d="paths.line" />
				<path class="selector" :d="paths.selector" />
			</g>
		</svg>
	</div>
</template>

<script>
import * as d3 from 'd3';
import TWEEN from 'tween';

export default {
	name: 'area-chart',
	props: {
		data: {
			type: Array,
			default() {
				return [ 27, 80, 38, 70, 89, 11, 65, 19, 28, 38, 16, 58, 80, 44, 95, 98, 45, 74, 18, 33, 48, 78, 10, 59, 60 ];
			}
		},
		margin: {
			type: Object,
			default: () => ({
				left: 0,
				right: 0,
				top: 10,
				bottom: 10
			}),
		},
		ceil: {
			type: Number,
			default: 100
		}
	},
	data() {
		return {
			width: 0,
			height: 0,
			paths: {
				area: '',
				line: '',
				selector: ''
			},
			lastHoverPoint: {},
			scaled: {
				x: null,
				y: null
			},
			animatedData: [],
			points: []
		};
	},
	computed: {
		padded() {
			const width = this.width - this.margin.left - this.margin.right;
			const height = this.height - this.margin.top - this.margin.bottom;
			return { width, height };
		}
	},
	mounted() {
		/* NOTE Keep track of the component size in the window */
		window.addEventListener('resize', this.onResize);
		this.onResize();
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.onResize);
	},
	watch: {
		data(newData, oldData) {
			this.tweenData(newData, oldData);
		},
		width() {
			this.initialize();
			this.update();
		}
	},
	methods: {
		/* NOTE Updates the width and height in the component's data according to its size */
		onResize() {
			this.width = this.$el.offsetWidth;
			this.height = this.$el.offsetHeight;
		},

		/* y0 corresponds to the lower part of the area, ususally the base of the graph
			y1 corresponds to the top of the area

			0      x
		 0 +--->--------------+
			|              /||||
			v          /\/||||||
		 y |  /\   /\/|||||||||
			| /||\ /||||||||||||
			|/||||||||||||||||||
			+------------------+
		 */
		/* TODO why is y0 not simply equal to this.height */
		createArea: d3.area().x(d => d.x).y0(d => d.max).y1(d => d.y),
		createLine: d3.line().x(d => d.x).y(d => d.y),
		/* TODO why is y0 not simply equal to this.height */
		createValueSelector: d3.area().x(d => d.x).y0(d => d.max).y1(0),

		initialize() {
			this.scaled.x = d3.scaleLinear().range([0, this.padded.width]);
			this.scaled.y = d3.scaleLinear().range([this.padded.height, 0]);
			d3.axisLeft().scale(this.scaled.x);
			d3.axisBottom().scale(this.scaled.y);
		},

		tweenData(newData, oldData) {
			function animate(time) {
				requestAnimationFrame(animate);
				TWEEN.update(time);
			}
			const vm = this;
			new TWEEN.Tween(oldData)
				.easing(TWEEN.Easing.Quadratic.Out)
				.to(newData, 500)
				.onUpdate(function() {
					vm.animatedData = this;
					debugger
					vm.update();
				})
				.start();
			animate();
		},

		update() {
			this.scaled.x.domain(d3.extent(this.data, (d, i) => i));
			this.scaled.y.domain([0, this.ceil]);
			this.points = [];
			for (const [i, d] of this.animatedData.entries()) {
				this.points.push({
					x: this.scaled.x(i),
					y: this.scaled.x(d),
					max: this.height
				});
			}
			this.paths.area = this.createArea(this.points);
			this.paths.line = this.createLine(this.points);
		},

		mouseover({ offsetX }) {
			if (this.points.length > 0) {
				const x = offsetX - this.margin.left;
				const closestPoint = this.getClosestPoint(x);
				if (this.lastHoverPoint.index !== closestPoint.index) {
					const point = this.points[closestPoint.index];
					this.paths.selector = this.createValueSelector([point]);
					this.$emit('select', this.data[closestPoint.index]);
					this.lastHoverPoint = closestPoint;
				}
			}
		},
		
		getClosestPoint(x) {
			return this.points
				.map((point, index) => ({
					x: point.x,
					diff: Math.abs(point.x - x),
					index
				}))
				.reduce((memo, val) => (memo.diff < val.diff ? memo : val));
		}
	}
}
</script>

<style lang="less">
.area {
	fill: #76BF8A;
}

.line {
	stroke: #4F7F5C;
}

.selector {
	stroke: #28402E;
	stroke-width: 3px;
	fill: none;
}
</style>
