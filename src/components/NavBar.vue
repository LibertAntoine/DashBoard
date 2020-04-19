<template>
  <div id="navBar" class="ui grid container stackable row">
    <div class="four wide">
      <h1 id="mainTitle">Weather Board</h1>
    </div>
    <div id="citySearch" class="ui input four wide">
            <input id="cityInput" v-model="localisation" type="text" placeholder="Enter Location" />
            <button @click="updateLocation" class="ui primary basic button" type="button">Search</button>
    </div> 
    <div class="two wide">
      <SuiModal :title='"test modal with sementic-ui"' ref='dialogueModal'> 
      <sui-modal-description>
        <sui-image floated="left" size="medium" src="logoProfile.png" />
        <sui-header>Default Profile Image</sui-header>
        <p> We've found the following gravatar image associated with your e-mail address.</p>
        <p>Is it okay to use this photo?</p>
      </sui-modal-description>
        <template v-slot:actions>
        <sui-button positive @click.prevent='$refs.dialogueModal.toggle'> CLOSE </sui-button>
      </template>
    </SuiModal>
    <sui-button @click.prevent='$refs.dialogueModal.toggle'>Show Modal</sui-button>
    </div>
  </div>
</template>

<script>
import SuiModal from './SuiModal'

export default {
  name: 'Navbar',
  components: {
    SuiModal
  },
  props: {
        update: {type: Function, require: true}
  },
  data() {
      return {
          localisation : ''
      }
  },
  methods: {
      updateLocation() {
          this.update(this.localisation);
      }
  }
}
</script>

<style>
#navBar {
  background-color : white;
  padding : 5px;
  border-radius: .28571429rem;
  box-shadow: 0 1px 3px 0 #d4d4d5, 0 0 0 1px #d4d4d5;
  margin: 5px;
  margin-bottom : 20px;
}
#colomn {
    padding-top : 0px !important;
    padding-bottom : 0px !important;
}
</style>