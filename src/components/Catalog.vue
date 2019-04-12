<template>
    <div>
        <div class="headerMenu">
            <div><h3>current:{{current}}</h3></div>
            <ul class="commandContainer">
                <li><button @click="onClickCreateDir">create dir</button></li>
                <li>
                    <template v-if="isEnabledDeleteDir">
                        <button>delete dir</button>
                    </template>
                    <template v-else>
                        <button disabled>delete dir</button>
                    </template>
                </li>
                <li><button @click="onClickUploadFile">upload file</button></li>
                <li>
                    <template v-if="isEnabledDeleteFile">
                        <button>delete file</button>
                    </template>
                    <template v-else>
                        <button disabled>delete file</button>
                    </template>
                </li>
            </ul>
        </div>
        <div class="dirContainer">
            <ul class="dir">
                <template v-for="(dir, idx) in dirs">
                    <li :key="idx">
                        <p class="label" @click="onClickDir" ref="label">{{dir.basename}}</p>
                    </li>
                </template>
            </ul>
        </div>
        <div class="fileContainer">
            <ul class="file">
                <template v-for="(file, idx) in files">
                    <li :key="idx">
                        <p class="label" @click="onClickFile" ref="label">{{file.basename}}</p>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            selectedDir: [],
            selectedFile: [],
            isEnabledDeleteDir: false,
            isEnabledDeleteFile: false
        };
    },
    computed: {
        current() {
            let path = this.$route.params.path;
            if (path) path = '/' + path.replace(/-/gi, '/');
            return path || '/';
        },
        files() {
            const files = this.$store.getters.files;
            this.selectedFile = files.map(e => {
                return {active: false, value: e};
            });
            return files;
        },
        dirs() {
            const dirs = this.$store.getters.directories;
            this.selectedDir = dirs.map(e => {
                return {active: false, value: e};
            });
            return dirs;
        }
    },
    methods: {
        onClickDir(ev) {
            ev.preventDefault();
            const label = ev.target.innerText;
            const obj = this.selectedDir.find(e => e.value.basename === label);
            obj.active = !obj.active;
            if (obj.active) {
                ev.target.classList.add('active');
            } else {
                ev.target.classList.remove('active');
            }
        },
        onClickFile(ev) {
            ev.preventDefault();
            const label = ev.target.innerText;
            const obj = this.selectedFile.find(e => e.value.basename === label);
            obj.active = !obj.active;
            if (obj.active) {
                ev.target.classList.add('active');
            } else {
                ev.target.classList.remove('active');
            }
        },
        onClickCreateDir() {
            const name = prompt('input name');
            if (!name || name.length === 0) return;
            const client = this.$store.getters.client;
            const path = this.current + '/' + name;
            client.createDirectory(path).then(async (resp) => {
                await this.$store.dispatch('setStructure');
                await this.$store.dispatch('setFiles', this.current);
                await this.$store.dispatch('setDirectories', this.current);
            });
        },
        onClickUploadFile() {
            const infile = document.createElement('input');
            infile.setAttribute('type', 'file');
            infile.setAttribute('name', 'upload');
            infile.addEventListener('change', (ev) => {
                const file = infile.files[0];
                this.$store.dispatch('uploadFile', {
                    path: this.current,
                    file
                }).then(async (resp) => {
                    console.log(resp);
                    await this.$store.dispatch('setFiles', this.current);
                });
            });
            infile.click();
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
                const labels = this.$el.querySelectorAll('.label');
                const ary = Array.from(labels);
                ary.forEach(e => e.classList.remove('active'));
            }
        },
        selectedDir: {
            deep: true,
            handler: function(val, old) {
                console.log(val, old);
                const active = val.filter(e => e.active === true);
                if (active.length > 0) {
                    this.isEnabledDeleteDir = true;
                } else {
                    this.isEnabledDeleteDir = false;
                }
            }
        },
        selectedFile: {
            deep: true,
            handler: function(val, old) {
                console.log(val, old);
                const active = val.filter(e => e.active === true);
                if (active.length > 0) {
                    this.isEnabledDeleteFile = true;
                } else {
                    this.isEnabledDeleteFile = false;
                }
            }
        }
    }
}
</script>
<style scoped>
.headerMenu {
    display: grid;
    grid-template-columns: 300px 1fr;
}
.commandContainer {
    display: flex;
    flex-direction: row;
    justify-content: end;
    list-style-type: none;
    justify-self: right;
    padding: 0px;
}
.commandContainer li {
    text-align: right;
}
.dirContainer, .fileContainer {
    margin: 8px auto;
    border: dashed 1px #999;
}
.dir, .file {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
    list-style-type: none;
    margin: 0px;
    padding: 14px;
}
.label {
    margin: 0px;
}
.label:hover {
    cursor: pointer;
}
.label.active {
    background-color: lightskyblue;
}
</style>
