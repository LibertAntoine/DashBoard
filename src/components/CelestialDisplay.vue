<template>
    <div class="display" :style="{'background-color': this.backgroundColor, 'width': this.width}">
        <p class="title"> {{ title }} </p>
        <p class="time"> {{ this.formatDate }} </p>
        <div class="svgContainter">
            <svg class="sunSvg" viewBox="0 2 200 40" preserveAspectRatio="xMinYMin meet">
                <path class="curveFill" :d="this.path"/>
                <path 
                    class="curve" :d="this.path"
                    :style="{'stroke': this.fillColor, 'stroke-dasharray': this.length, 'strokeDashoffset': this.strokeDashoffset }" 
                />
                <circle class="circle" :style="{'fill': this.fillColor, 'stroke': 'none'}" :cx="this.circlePos.x" :cy="this.circlePos.y" r="4"/>
            </svg>
        </div>
        <div class="sunriseHours"> {{ this.sunriseHours }} </div>
        <div class="sunsetHours"> {{ this.sunsetHours }} </div>
    </div>
</template>

<script>

import { bound, quadraticBezierLength, quadraticBezierpos } from '../services/helpers/math'
const p0 = {x: 5, y:35};
const p1 = {x: 95, y:-15};
const p2 = {x: 195, y:35};

export default {
    
    data() {
        return {
            length: quadraticBezierLength(p0, p1, p2),
            path: '',
            time: { hours: 0, minutes: 0, seconds: 0 }
        }
    },
    created() {
        this.updateTime(new Date())
        this.length = quadraticBezierLength(p0, p1, p2); // compute length
        this.path = 'M '+ p0.x + ' ' + p0.y + ' Q '+ p1.x + ' ' + p1.y + ' ' + p2.x + ' ' + p2.y;
    },

    mounted() {
        this.timeUpdate = setInterval(() => this.updateTime(new Date()), 60 - new Date().getSeconds());
    },

    beforeDestroy() { 
        clearInterval(this.timeUpdate);   
    },

    computed: {
        strokeDashoffset() {
            return this.length * (1 - this.percentage);
        },
        sunriseMinCount() {
            return this.sunriseHours.split(":").map(Number).reduce((a, v) => a * 60 + v, 0);
        },
        sunsetMinCount() {
            return this.sunsetHours.split(":").map(Number).reduce((a, v) => a * 60 + v, 0);
        },
        percentage() {
            return   bound((this.time.hours * 60 + this.time.minutes - this.sunriseMinCount) / (this.sunsetMinCount - this.sunriseMinCount));
        },
        formatDate() {
            return [this.time.hours, this.time.minutes, this.time.seconds].map(x => ((x > 9) ? '' : '0') + x).join(':')
        },
        circlePos() {
            return quadraticBezierpos(p0, p1, p2, this.percentage*1.035);
        }
    },

    props: {
        sunriseHours: {
            type: String,
            required: true
        },
        sunsetHours: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        fillColor: {
            type: String,
            default: '#f4901e'
        },
        backgroundColor: {
            type: String,
            default: '#fff'
        },
        width: {
            type: String,
            default: 'auto'
        }
    },

    methods: {
        updateTime(date) {
            this.time.hours = date.getHours();
            this.time.minutes = date.getMinutes();
            this.time.seconds = date.getSeconds();
        }
    }
}
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Playfair+Display&display=swap');

  .display {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  /* offset-x | offset-y | blur-radius | color */
  box-shadow: 2vw 2vw 6vw #dddddd;
  padding: 2em;

  }

  .title, .time, .sunriseHours, .sunsetHours {
  position: absolute;
  margin: 0;
  font-family: Karla;
  font-size: calc(1.5em + 0.1vw);
  color: #2b2b3a;
  }

  .title {
  top: 5%;
  }
  .time {
  top: 40%;
  }
  .sunriseHours {
  left: 5%;
  bottom: 5%;
  }
  .sunsetHours {
  right: 5%;
  bottom: 5%;
  }

  .svgContainter {
  position: relative;
  height: 0;
  width: 100%;
  padding: 0;
  padding-bottom: 20%; /* aspect ratio of our viewBox svg; */
  vertical-align: middle;
  overflow: hidden;
  }

  .sunSvg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 0;
  margin: 0;
  /* border: thin dotted darkgrey;  for help debug*/
  }
  .curve, .curveFill {
  fill: none;
  stroke-width: 5px;
  stroke-linecap: round;
  }

  .curve {
  transition-duration: 1s;
  transition-property: strokeDashoffset;
  }

  .curveFill {
  stroke: #f4f5f6;
  }

  @media (max-width: 1024px) {
  .display{
  padding: 1.5em;
  }
  }

  @media (max-width: 450px) {
  .display{
  width: 100%;
  height: 50%;
  padding: 0;
  }

  .title{
  font-size: 0.8em;
  top: 25%;
  }

  .time{
  font-size: 0.8em;
  top: 50%;
  }

  .sunriseHours{
  font-size: 0.5em;
  left: 0;
  }

  .sunsetHours{
  font-size: 0.5em;
  right: 0;
  }
  }

</style>
