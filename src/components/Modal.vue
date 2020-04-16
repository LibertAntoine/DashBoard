<template>
  <transition name="overlayTransition">
    <div 
        class="modalOverlay" 
        @touchstart.self="handleBackgroundClick" 
        @mousedown.self="handleBackgroundClick"
        :style="{'background-color': this.overlayHexColor }"
        v-if="visibility.overlay"
    >
        <transition name="modalTransition">
            <div
                class="modal" 
                role="dialog" 
                aria-labelledby="modalTitle" 
                aria-describedby="modalDescription"
                v-if="visibility.modal"
                :style="{'background-color': this.backgroundColor}"
            >
                <header class="modalHeader">
                    <h1 class="modalTitle">{{ this.title }} </h1>
                    <button type="button" class="modalCloseBtn" @click="close" aria-label="Close modal">x</button>
                    <br/>
                </header>
                <section class="modalBody">
                    <slot></slot> <!-- default slot -->
                </section>
            </div>
        </transition>
    </div>
  </transition>
</template>

<script>
export default {
    name: "modal",

    data() {
        return {
            visible: false,
            visibility: {
                modal: false,
                overlay: false
            }
        }
    },
    props: {
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
        title: {
            type: String,
            default: 'default modal title'
        },
        // click on background to close
        clickToClose: {
            type: Boolean,
            default: true
        },
        delay: {
            type: Number,
            default: 200
        }
    },
    computed: {
        overlayHexColor() {
            return this.overlayColor + Number(~~(this.overlayOpacity*255)).toString(16).padStart(2, '0').toUpperCase();
        }
    },
    watch: {
        visible (value) {
            if (value) {
                this.visibility.overlay = true;
                setTimeout(() => { this.visibility.modal = true; }, this.delay)
            } else {
                this.visibility.modal = false;
                setTimeout(() => { this.visibility.overlay = false; }, this.delay)
            }
        }
    },
    methods: {
        handleBackgroundClick() {
            if (this.clickToClose) {
                this.toggle(false);
            }
        },
        toggle (nextState) {
            if (this.visible === nextState) {
                return;
            } else {
                this.visible = nextState;
            }
        },
        open () {
            this.$emit('open');
            this.toggle(true);
        },
        close () {
            this.$emit('close');
            this.toggle(false);
        }
    }
}
</script>

<style lang="scss" scoped>

$green: #4aae9b;
.modalOverlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
}

.modal {
  display: flex;
  flex-direction: column;
}

.modalHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid #eeeeee;
    padding: 5px 15px;
    .modalTitle {
        margin: 0;
        color: $green;
        justify-content: center;
    }
    .modalCloseBtn {
        font-size: 20px;
        border: none;
        cursor: pointer;
        font-weight: bold;
        color: $green;
        background: transparent;
        margin-left: auto;
    }
}

.modalBody {
    padding: 5px 5px;
}


.overlayTransition-enter-active,
.overlayTransition-leave-active,
.modalTransition-enter-active,
.modalTransition-leave-active {
  transition: opacity 0.5s ease;
}

.overlayTransition-enter,
.overlayTransition-leave-active,
.modalTransition-enter,
.modalTransition-leave-active {
  opacity: 0;
}

.modalTransition-enter-active,
.modalTransition-leave-active {
  transition: transform 0.5s;
}

.modalTransition-enter,
.modalTransition-leave-active {
  transform: scale(1.05);
}
</style>
