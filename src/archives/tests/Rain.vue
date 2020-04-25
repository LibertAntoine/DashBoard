<template>
	<div id="app">
		<Rain />
	</div>
</template>

<script>
import Rain from './components/D3/pluviometre.vue'

export default {
	name: 'App',
	components: {
		Rain
	}
}
</script>

<style>
body {
	background-color: white;
}
</style>
