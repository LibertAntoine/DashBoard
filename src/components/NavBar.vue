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
  @font-face {
  font-family: 'Butler';
  src: url('../../ressources/font/Butler-Medium.woff2') format('woff2'),
  url('../../ressources/font/Butler-Medium.woff') format('woff');
  font-weight: 500;
  font-style: normal;
  }

  @font-face {
  font-family: 'Butler';
  src: url('../../ressources/font/Butler-Black.woff2') format('woff2'),
  url('../../ressources/font/Butler-Black.woff') format('woff');
  font-weight: 900;
  font-style: normal;
  }

  /*GENERAL*/

  #navBar {
  padding : 5px;
  margin: 5px;
  margin-bottom : 20px;
  display: flex;
  justify-content: space-between;
  }
  .wide:nth-child(1)  {
  order: 1;
  }
  .wide:nth-child(2) {
  order: 3;
  }
  .wide:nth-child(3) {
  order: 2;
  }

  /*TITLE*/

  h1{
  font-family: Butler !important;
  font-size: 3em !important;
  color: #254558;
  }

  /*SEARCH BAR*/

  #citySearch button{
  color: #254558 !important;
  box-shadow: 0 0 0 1px #254558 inset!important;
  }

  #citySearch button:hover{
  background-color: #254558!important;
  color: #f4f5f6 !important;
  box-shadow: 0 0 0 1px #f4f5f6 inset!important;
  }
</style>