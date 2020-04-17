<template>
    <div class="moonPhase" :style="{'background-color': this.backgroundColor, 'width': this.width}">
        <div class="svgContainter">
            <svg class="svg" viewBox="-2 -2 204 204" preserveAspectRatio="xMinYMin meet">
                <g :transform="'rotate(' + this.waningRotate + ', 100, 100)'">
                    <path d='M 100 0 A 100 100 0 1 1 100 200 Z' :fill="this.emptyColor" class='rightFill'/>
                    <path :d="this.pathRight" :fill="this.fillColor" class='right'/>
                    <path d='M 100 200 A 100 100 0 1 1 100 0 Z' :fill="this.fillColor" class='leftFill'/>
                    <path :d="this.pathLeft" :fill="this.emptyColor" class='left'/>
                </g>
            </svg>
        </div>
    </div>
</template>


<script>

import { bound, JulianDay, moonPhase } from '../services/helpers/math'

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
        this.timePhase = setInterval(() => this.updateDate(new Date()), 23 - new Date().getHours());
    },

    beforeDestroy() { 
        clearInterval(this.timePhase);   
    },

    computed: {
        waning() {
            return this.percentage > 0.5
        },
        waningRotate() {
            return this.waning ? 180 : 0
        },
        sunIntensity() {
            const twice = this.percentage * 2;
            return twice < 1 ? twice : 2 - twice;
        },
        // percentage Between Two New Moon
        percentage() {
            return this.testPercentage !== 0 ? this.testPercentage : moonPhase(JulianDay(this.time.day, this.time.month, this.time.year));
        },
        pathRight () {
            return 'M 100 0 A ' + (100 * bound((this.sunIntensity - 0.5) * 2, 0, 1)) + ' 100 0 1 1 100 200';
        },
        pathLeft () {
            return 'M 100 200 A ' + (100 * (1 - bound(this.sunIntensity * 2, 0, 1))) + ' 100 0 1 1 100 0';
        }
    },

    props: {
        fillColor: {
            type: String,
            default: '#f77a52'
        },
        emptyColor: {
            type: String,
            default: '#555555'
        },
        backgroundColor: {
            type: String,
            default: '#fff'
        },
        width: {
            type: String,
            required: true
        },
        testPercentage: {
            type: Number,
            default: 0,
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
