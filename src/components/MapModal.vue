<template>
    <SuiModal ref='modal' :title='"Location Selection"'>

        <div class='mapContainer' :style="{'height': this.height}">
            <div class="info" style='height: 15%'>
                <span>Center: {{ center }}</span>
                <span>Zoom: {{ zoom }}</span>
                <span>Bounds: {{ bounds }}</span>
            </div>
            <LMap class='map'
                style="height: 80%; width: 100%"
                :zoom='zoom'
                :center='center'
                @update:zoom='zoomUpdated'
                @update:center='centerUpdated'
                @update:bounds='boundsUpdated'
            >
                <LTileLayer :url='url' />
                <LCircleMarker :lat-lng='selectedLocation' :radius='circleMakerRadius' color='red' />
                <!-- <l-marker :lat-lng='selectedLocation' :icon='markerIcon'></l-marker> -->
            </LMap>
        </div>
        <template v-slot:actions>
            <sui-button positive @click.prevent='$refs.modal.toggle'> CLOSE </sui-button>
        </template>
    </SuiModal>
</template>

<script>
import DataApi from '../services/Api/Data'
import SuiModal from './SuiModal'

import { latLng, icon } from "leaflet";
import { LMap, LTileLayer, LCircleMarker } from 'vue2-leaflet';

export default {
    
    name: 'mapModal',
    components: {
        SuiModal,
        LMap, 
        LTileLayer,
        LCircleMarker
        
    },
    data() {
        return {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            zoom: 3,
            center: latLng(47.413220, -1.219482),
            bounds: null,
            selectedLocation: latLng(0, 0),
            markerIcon: icon({
                iconUrl: '../assets/map-marker-solid.sv',
                iconSize: [32, 37],
                iconAnchor: [16, 37]
            }),
            circleMakerRadius: 4
        };
    },
    mounted() {
        // this.geolocate();
    },
    props: {
        width: {
            type: String,
            default: '800px'
        },
        height: {
            type:  String,
            default: '500px'
        },
        overlayColor: {
            type: String,
            default: '#000000'
        },
        overlayOpacity: {
            type: Number,
            default: 0.3,
            validator: function (v) {
                return v >= 0 && v <= 1;
            }
        },
        backgroundColor: {
            type: String,
            default: '#ffffff'
        },
        clickToClose: {
            type: Boolean,
            default: true
        },
        delay: {
            type: Number,
            default: 200
        }
    },
    methods: {
        zoomUpdated (zoom) {
            this.zoom = zoom;
        },
        centerUpdated (center) {
            this.center = center;
        },
        boundsUpdated (bounds) {
            this.bounds = bounds;
        },
        toggle () {
            this.$refs.modal.toggle();
        },

        goToSelectedLocation () {
            this.center = latLng(this.selectedLocation.lat, this.selectedLocation.lng)
            
        },
        setNewLocation(lat, lng) {
            this.$emit('selectedLocUpdated', this.selectedLocation);
        },
        async geolocate() {
            const location = await DataApi.getLocation();
            console.log('location:', location)
            // navigator.geolocation.getCurrentPosition(position => {
            // this.center = {
            //     lat: position.coords.latitude,
            //     lng: position.coords.longitude
            // };
            this.center = latLng(location.latitude || 0, location.longitude || 0)
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
