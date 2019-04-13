<template>
    <div>
        <div class="headerMenu">
            <div><h3>current:{{current}}</h3></div>
            <ul class="commandContainer">
                <li><button @click="onClickCreateDir">create dir</button></li>
                <li>
                    <template v-if="isEnabledDeleteDir">
                        <button @click="onClickDeleteDir">delete dir</button>
                    </template>
                    <template v-else>
                        <button disabled>delete dir</button>
                    </template>
                </li>
                <li><button @click="onClickUploadFile">upload file</button></li>
                <li>
                    <template v-if="isEnabledDeleteFile">
                        <button @click="onClickDeleteFile">delete file</button>
                    </template>
                    <template v-else>
                        <button disabled>delete file</button>
                    </template>
                </li>
                <li>
                    <template v-if="isEnabledDownloadFile">
                        <button @click="onClickDownloadFile">download file</button>
                    </template>
                    <template v-else>
                        <button disabled>download file</button>
                    </template>
                </li>
            </ul>
        </div>
        <div id="dirContainer" class="dirContainer">
            <ul class="dir">
                <template v-for="(dir, idx) in dirs">
                    <li :key="idx">
                        <p class="label" @click="onClickDir" @dblclick="onDblClickDir" ref="label">
                            <input type="hidden" class="dirBaseVal" name="dirBaseVal" :value="dir.basename">
                            <span class="labelValue">{{dir.basename}}</span>
                        </p>
                    </li>
                </template>
            </ul>
        </div>
        <div id="fileContainer" class="fileContainer">
            <ul class="file">
                <template v-for="(file, idx) in files">
                    <li :key="idx">
                        <p class="label" @click="onClickFile" ref="label">
                            <input type="hidden" class="fileBaseVal" name="fileBaseVal" :value="file.basename">
                            <span class="labelValue">{{file.basename}}</span>
                        </p>
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
            isEnabledDeleteFile: false,
            isEnabledDownloadFile: false
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
            files.sort((a, b) => a.basename < b.basename);
            this.selectedFile = files.map(e => {
                return {active: false, value: e};
            });
            return files;
        },
        dirs() {
            const dirs = this.$store.getters.directories;
            dirs.sort((a, b) => a.basename < b.basename);
            this.selectedDir = dirs.map(e => {
                return {active: false, value: e};
            });
            return dirs;
        }
    },
    methods: {
        onClickDir(ev) {
            const ul = document.getElementById('dirContainer');
            Array.from(ul.querySelectorAll('li')).forEach(e => {
                e.querySelector('.label').classList.remove('active');
            });
            let tgt = null;
            if (ev.target.tagName === 'SPAN' || ev.target.tagName === 'span') {
                tgt = ev.target.parentNode;
            } else {
                tgt = ev.target;
            }
            const label = tgt.querySelector('.dirBaseVal').value;
            const obj = this.selectedDir.find(e => e.value.basename === label);
            obj.active = !obj.active;
            if (obj.active) {
                tgt.classList.add('active');
            } else {
                tgt.classList.remove('active');
            }
            this.selectedDir.filter(e => e !== obj).forEach(e => e.active = false);
        },
        onDblClickDir(ev) {
            let tgt = null;
            if (ev.target.tagName === 'SPAN' || ev.target.tagName === 'span') {
                tgt = ev.target.parentNode;
            } else {
                tgt = ev.target;
            }
            const hidden = tgt.querySelector('.dirBaseVal');
            const path = hidden.value.replace(/\//gi, '-');
            this.$router.push('/catalog/' + path);
        },
        onClickFile(ev) {
            const ul = document.getElementById('fileContainer');
            Array.from(ul.querySelectorAll('li')).forEach(e => {
                e.querySelector('.label').classList.remove('active');
            });
            let tgt = null;
            if (ev.target.tagName === 'SPAN' || ev.target.tagName === 'span') {
                tgt = ev.target.parentNode;
            } else {
                tgt = ev.target;
            }
            const label = tgt.querySelector('.fileBaseVal').value;
            const obj = this.selectedFile.find(e => e.value.basename === label);
            obj.active = !obj.active;
            if (obj.active) {
                tgt.classList.add('active');
            } else {
                tgt.classList.remove('active');
            }
            this.selectedFile.filter(e => e !== obj).forEach(e => e.active = false);
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
        },
        onClickDeleteDir() {
            const tgt = this.selectedDir.find(e => e.active === true);
            this.$store.dispatch('deleteDirFile', {
                path: tgt.value.filename
            }).then(async (resp) => {
                console.log(resp);
                const labels = this.$el.querySelectorAll('.label');
                const ary = Array.from(labels);
                ary.forEach(e => e.classList.remove('active'));
                await this.$store.dispatch('setStructure');
                await this.$store.dispatch('setDirectories', this.current);
            });
        },
        onClickDeleteFile() {
            const tgt = this.selectedFile.find(e => e.active === true);
            this.$store.dispatch('deleteDirFile', {
                path: tgt.value.filename
            }).then(async (resp) => {
                console.log(resp);
                const labels = this.$el.querySelectorAll('.label');
                const ary = Array.from(labels);
                ary.forEach(e => e.classList.remove('active'));
                await this.$store.dispatch('setFiles', this.current);
            });
        },
        onClickDownloadFile() {
            const tgt = this.selectedFile.find(e => e.active === true);
            this.$store.dispatch('getFile', {
                path: tgt.value.filename
            }).then((resp) => {
                console.log(resp);
                const blob = new Blob([new Uint8Array(resp).buffer], {type: 'application/octet-stream'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.download = tgt.value.basename;
                a.href = url;
                a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
                a.click();
            });
        }
    },
    mounted() {
        this.$store.dispatch('setFiles', this.current);
        this.$store.dispatch('setDirectories', this.current);
    },
    watch: {
        current: function(val, old) {
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
                const active = val.filter(e => e.active === true);
                if (active.length > 0) {
                    this.isEnabledDeleteFile = true;
                    this.isEnabledDownloadFile = true;
                } else {
                    this.isEnabledDeleteFile = false;
                    this.isEnabledDownloadFile = false;
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
