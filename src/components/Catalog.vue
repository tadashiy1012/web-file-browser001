<template>
    <div>
        <h3>main</h3>
        <h4>{{current}}</h4>
        <p>{{dirs.map(e => e.basename)}}</p>
        <p>{{files.map(e => e.basename)}}</p>
    </div>
</template>
<script>
export default {
    computed: {
        current() {
            let path = this.$route.params.path;
            if (path) path = '/' + path.replace(/-/gi, '/');
            return path || '/';
        },
        files() {
            const files = this.$store.getters.files;
            console.log(files);
            return files;
        },
        dirs() {
            const dirs = this.$store.getters.directories;
            console.log(dirs);
            return dirs;
        }
    },
    mounted() {
        this.$store.dispatch('setFiles', this.current);
        this.$store.dispatch('setDirectories', this.current);
    },
    watch: {
        current: function(val, old) {
            console.log(val, old);
            if (val !== old) {
                this.$store.dispatch('setFiles', this.current);
                this.$store.dispatch('setDirectories', this.current);
            }
        }
    }
}
</script>
