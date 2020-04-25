<template>
    <SuiModal ref='modal' :title='"Location Selection"'>
        <div class='mapContainer'>
            <LMap class='map'
                :zoom='zoom'
                :center='center'
                @update:zoom='zoomUpdated'
                @update:center='centerUpdated'
                @update:bounds='boundsUpdated'
                @ready='mapReady'
            >
                <LTileLayer :url='url' />
                <LMarker :lat-lng='selectedLocation' ></LMarker>
            </LMap>
        </div>
        <template v-slot:actions>
            <sui-button positive @click.prevent="btnSelect"> Select </sui-button>
            <sui-button positive @click.prevent='$refs.modal.toggle'> Close </sui-button>
            
        </template>
    </SuiModal>
</template>

<script>
import IpGeo from '../services/Api/IpGeo'
import SuiModal from './SuiModal'

import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';

export default {
    
    name: 'mapModal',
    components: {
        SuiModal,
        LMap, 
        LTileLayer,
        LMarker
        
    },
    data() {
        return {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            zoom: 6,
            center: latLng(this.defaultLoc.lat, this.defaultLoc.lng),
            bounds: null,
            selectedLocation: latLng(this.defaultLoc.lat, this.defaultLoc.lng),
            updateMapDisplay: undefined
        };
    },
    async mounted() {
        this.geolocate();
    },
    props: {
        defaultLoc: { 
            type: Object,
            default: () => {return {lat: 48.8534, lng: 2.3488}},
            validator: (v) => v.lat !== undefined && v.lng !== undefined && typeof v.lat === 'number' && typeof v.lng === 'number'
        }
    },
    watch: {
        selectedLocation: function () {
            // set center to selected location
            this.center = latLng(this.selectedLocation.lat, this.selectedLocation.lng)
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
            if(this.updateMapDisplay) {
                setTimeout(this.updateMapDisplay, 150); // update invalid size display
                this.updateMapDisplay = undefined; // disable update
            }
        },
        btnSelect() {
            this.$emit('select', this.selectedLocation.lat, this.selectedLocation.lng);
            this.toggle();
        },
        clickEvent (e) {
            this.setSelectedLocation(e.latlng.lat, e.latlng.lng);
        },
        mapReady (map) {
            map.on('click', this.clickEvent); // registerClickEvent
            this.updateMapDisplay = () => map.invalidateSize();
        },
        setSelectedLocation(lat, lng) {
            this.selectedLocation = latLng(lat, lng);
            this.$emit('updated', this.selectedLocation.lat, this.selectedLocation.lng);
        },
        async geolocate() {
            const location = await IpGeo.getLocation();
            if (location) { 
                this.setSelectedLocation(location.lat, location.lng);
            }
        }
    }
}
</script>

<style lang="scss" scoped>

.mapContainer {
    height: 400px; 
    width: 100%;
}

.map {
    height: 100%; 
    width: 100%;
}
</style>
