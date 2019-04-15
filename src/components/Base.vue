<template>
    <div class="baseContainer">
        <div class="left">
            <h1>web file browser</h1>
            <h3>
                <i class="material-icons">navigation</i>
                <span>navi</span>
            </h3>
            <dir :directory="dirs" :root="true" />
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
        dirs() {
            return this.$store.getters.structure;
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
h1 {
    font-size: 28px;
}
.right {
    width: 100%;
}
</style>
