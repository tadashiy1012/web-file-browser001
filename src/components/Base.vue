<template>
    <div class="baseContainer">
        <div class="left">
            <h4>navi</h4>
            <dir :directory="directories" />
        </div>
        <div class="right">
            <router-view />
        </div>
    </div>
</template>
<script>
import Dir from './Dir.vue';
export default {
    components: { Dir },
    computed: {
        directories() {
            const dirs = this.$store.getters.directories;
            return dirs;
        }
    },
    mounted() {
        const ul = this.$el.querySelector('ul');
        ul.classList.remove('disabled');
    }
}
</script>
<style scoped>
.baseContainer {
    width: 90%;
    margin: auto;
    display: flex;
    flex-direction: row;
}
.left {
    width: 260px;
}
.right {
    width: 100%;
}
</style>
