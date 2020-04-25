<template>
  <div>
    <sui-modal v-model='open' id='content'>
      <sui-modal-header> {{ title }} </sui-modal-header>
      <sui-modal-content image>
          <slot></slot>
      </sui-modal-content>
      <sui-modal-actions>
          <slot name="actions"></slot>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
export default {
  name: 'ModalExample',
  data() {
    return { open: false };
  },
  props: {
        title: {
            type: String,
            default: 'default modal title'
        },
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
  },
};
</script>

<style>
  @media (max-width: 1024px) {
  
  #content > div:first-child{
  width: 90%;
  }
  }
</style>