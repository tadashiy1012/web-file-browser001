<template>
    <div class="baseContainer">
        <div class="left">
            <h1>web file browser</h1>
            <div>
                <template v-if="logged">
                    <button @click="onClickLogout">logout</button>    
                </template>    
            </div>
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
        logged() {
            return this.$store.getters.logged;
        },
        current() {
            let path = this.$route.params.path;
            if (path) path = '/' + path.replace(/-/gi, '/');
            return path || '/';
        },
        dirs() {
            return this.$store.getters.structure;
        }
    },
    methods: {
        onClickLogout() {
            this.$store.dispatch('doLogout').then((resp) => {
                this.$router.push('/login');
            });
        }
    },
    mounted() {
        this.$store.dispatch('fetchLogged').then(() => {
            const logged = this.$store.getters.logged;
            console.log(logged);
            if (!logged) {
                this.$router.push('/login');
            } else {
                this.$store.dispatch('setStructure').then(() => {
                    const ul = this.$el.querySelector('ul');
                    ul.classList.remove('disabled');
                });
                this.$store.dispatch('setFiles', this.current);
                this.$store.dispatch('setDirectories', this.current);
            }
        });
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
