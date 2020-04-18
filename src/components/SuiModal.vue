<template>
  <div>
    <sui-button @click.native='toggle'>Show Modal</sui-button>
    <sui-modal v-model='open'>
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

<style lang="scss" scoped>
</style>