<template>
    <div class="moonPhase" :style="{'background-color': this.backgroundColor, 'width': this.width}">
        <div class="svgContainter">
            <svg class="svg" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet">
                <!-- /* <path d="m 50 10 a 0.9 1 0 0 0 0 60" */ -->
            </svg>
        </div>
    </div>
</template>


<script>

import { bound, quadraticBezierLength, quadraticBezierpos } from '../services/helpers/math'
import {JulianDay, moonPhase} from '../services/helpers/math'

export default {
    
    data() {
        return {
            time: { year: 0, month: 0, day: 0 }
        }
    },
    created() {
        this.updateDate(new Date())
    },

    mounted() {
        this.timePhase = setInterval(() => this.updateTime(new Date()), 24 - new Date().hours());
    },

    beforeDestroy() { 
        clearInterval(this.timePhase);   
    },

    computed: {
        waning() {
            return this.percentage > 0.5
        },
        sunAngle() {
            return (this.percentage - 0.5) / 0.5
        },
        // percentage Between Two New Moon
        percentage() {
            return moonPhase(JulianDay(this.time.day, this.time.month, this.time.year));
        }
    },

    props: {
        fillColor: {
            type: String,
            default: '#f77a52'
        },
        backgroundColor: {
            type: String,
            default: '#fff'
        },
        width: {
            type: String,
            required: true
        }
    },

    methods: {
        updateDate(date) {
            this.time.year = date.getFullYear();
            this.time.month = date.getMonth() + 1;
            this.time.day = date.getDate();
        }
    }
}
</script>

<style scoped>

    .moonPhase {
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

    .svgContainter {
        position: relative;
        height: 0;
        width: 100%;
        padding: 0;
        /* aspect ratio of our viewBox svg; */
        padding-bottom: 100%;
        vertical-align: middle;
        overflow: hidden;
    }

    .svg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        padding: 0;
        margin: 0;
        /* for help debug  */
        border: thin dotted darkgrey;
    }

</style>
