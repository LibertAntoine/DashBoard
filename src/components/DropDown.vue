<template>
    <div class="dropdown">
        <div @click="toggleMenu()" class="dropdownToggle">
          {{ selectedOption || placeholderText }}
          <span class="arrowDown"></span>
        </div>

        <ul class="dropdownMenu" v-if="showMenu">
            <li v-for="option in options" :key="option" @click.prevent="updateOption(option)"> {{ option }} </li>
        </ul>
    </div>
</template>

<script>

export default {
    data() {
        return {   
            selectedOption: '',
            showMenu: false,
        }
    },
    props: {
        options: {
            type: [Array, String],
            required: true
        },
        selected: {
            type: [String],
            default: '',
        },
        placeholderText: {
            type: [String],
            default: 'Please select an item',
        },
        closeOnOutsideClick: {
            type: [Boolean],
            default: true,
        },
    },

    mounted() {
        this.selectedOption = this.selected;
        if (this.closeOnOutsideClick) { document.addEventListener('click', this.clickHandler) } // add document click event 
    },

    beforeDestroy() { 
        document.removeEventListener('click', this.clickHandler) // remove doc click event
    },

    methods: {
        updateOption(option) {
            this.selectedOption = option
            this.showMenu = false
            this.$emit('update', this.selectedOption)
        },

        toggleMenu() { this.showMenu = !this.showMenu },

        clickHandler(event) {
            const { target } = event
            const { $el } = this

            if (!$el.contains(target)) { this.showMenu = false }
        },
    }
}
</script>

<style scoped>

.dropdown {
    position: relative;
    min-width: 160px;
    height: 40px;
    margin: 10px 1px;
    display: inline-block;
    color: #333333;
}

.dropdownToggle {
    color: #636b6f;
    min-width: 160px;
    padding: 10px 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    /* Box */
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.dropdownToggle:hover {
    background: #e1e1e1;
    cursor: pointer;
}

.dropdownMenu {
    position: absolute;
    padding-left: 0;
    margin: 5px 0;
    z-index: 10;
    min-width: 160px;
    list-style: none;
    text-align: left;
    /* Box */
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
}

.dropdownMenu > li {
    padding: 10px 30px;
    text-overflow: ellipsis;
    list-style: none;
}

.dropdownMenu > li:hover {
    background: #efefef;
}

.arrowDown {
    position: absolute;
    vertical-align: middle;
    top: 20px;
    right: 10px;
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid;
}

</style>
