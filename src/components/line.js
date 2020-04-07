import { Line } from 'vue-chartjs'
 
export default {
  extends: Line,
  props: {
    labels: {type: Array, default: []},
    datasets: {type: Array, default: []}
  },
  watch: { 
    datasets: function() { 
        this.render()
    },
    labels: function() { 
        this.render()
    } 
  },
  mounted () {
    this.render()
  },
    methods: {
        render ()
        {
            // Overwriting base render method with actual data.
            this.renderChart({
                labels: this.labels,
                datasets: this.datasets
            })
        }
    }
}