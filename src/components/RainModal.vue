<template>
    <SuiModal class="modal-rain" ref='modal' :title='"Rain gauges for the week"'>
	<div class="pluviometer-modal">
        <div class="pluviometers-container">
		  	  <div class="pluviometer-day" v-for="(day, index) in forecast.daily.data" :key="index" >
			  	  <Pluviometre :max="maxVal" :mm="day.precipIntensityMax * 24" ref='pluviometre'/>
				  <div class="day">{{ time(day) }}</div>
			  </div>
        </div>
		  	  <div class="slider">
		  	  	0  <input type="range" v-model="max" id="volume" min="5" max="40">  40
				<br>
		  	  	range goes from 0 to {{ this.maxVal }}mm
		  	  </div>
	</div>
        <template v-slot:actions>
            <sui-button positive @click.prevent='close'> Close </sui-button>
            <sui-button positive @click.prevent='animate'> Animate </sui-button>
        </template>
    </SuiModal>
</template>

<script>
import SuiModal from './SuiModal'
import Pluviometre from './D3/Pluviometre'

import { dayTimeToDate } from '@/services/helpers/conversion'

export default {
    
    name: 'mapModal',
    components: {
        Pluviometre,
        SuiModal,
    },
	data() {
		return {
			maxVal: 40,
		}
	},
	computed: {
		max: {
			set(newMax) {
				this.maxVal = parseInt(newMax);
			},
			get() {
				return this.maxVal;
			}
		}
	},
	props: {
		forecast: {
			type: Object,
			default: () => {}
		} 
	},
	methods: {
		time(data) {
			const date = new Date(data.time * 1000);
			const week = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
			const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			// DEBUG TODO weekdays are shifted
			return week[date.getDay()]+" "+date.getUTCDate()+" "+months[date.getMonth()]
		},
		animate() {
			this.$refs.pluviometre.forEach(rain => rain.setTo0())
			this.$refs.pluviometre.forEach((rain, i) => {
				setTimeout(rain.updateWater,  800 - i*50)
			})
		},
		close() {
			this.$refs.modal.toggle();
			this.$refs.pluviometre.forEach(rain => rain.updateWater(0))
		},
		toggle() {
			console.log(this.forecast)
			this.$refs.modal.toggle()
			this.$refs.pluviometre.forEach((rain, i) => {
				setTimeout(rain.updateWater,  800 - i*50)
			})
		}
	}
}
</script>

<style lang="less">

.modal-rain .ui.modal {
	width: auto;
}

.pluviometer-modal {
	width: 100%;

	.pluviometers-container {
		display: flex;
		justify-content: space-around;

		.pluviometer-day {

			.pluviometre {
				margin: 5px 20px;

				svg {
					width: 90px;
				}
			}

			div.day {
				text-align: center;
			}
		}

	}
	.slider {
		text-align: center;
		margin-top: 25px;

		#volume {
			margin: 0 10px;
		}
	}
}

</style>
