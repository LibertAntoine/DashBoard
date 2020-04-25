<!--Inspired by
Composing D3 Visualizations With Vue.js
https://medium.com/tyrone-tudehope/composing-d3-visualizations-with-vue-js-c65084ccb686K-->

<script>
// NOTE '* as d3' is necessary!
import * as d3 from 'd3';
const data = [99, 71, 78, 25, 36, 92];

export default {
	name: 'non-vue-line-chart',
	template: '<div class="d3-linechart-container"></div>',
	mounted() {
		const svg = d3.select(this.$el)
			.append('svg')
			.attr('width', 500)
			.attr('height', 270)
			.append('g')
			.attr('transform', 'translate(0, 10)');

		const x = d3.scaleLinear().range([0, 430]);
		const y = d3.scaleLinear().range([210, 0]);

		// TODO what is the point of all this? We generate the axis but don't even show them up on screen
		//d3.axisLeft().scale(x);
		//d3.axisTop().scale(y);

		x.domain(d3.extent(data, (d, i) => i));
		//x.domain([0, data.length - 1]); // NOTE similar as the previous one
		y.domain(d3.extent(data, d => d));

		const createPath = d3.line()
			.x((d, i) => x(i))
			.y(d => y(d));

		svg.append('path').attr('d', createPath(data));
		
	}
}
</script>

<style lang="less">
svg {
	margin: 25px;

	path {
		fill: none;
		stroke: #76BF8A;
		stroke-width: 3px;
	}
}
</style>

