import {getDirStructure} from './util';

const state = {
    client: null,
    structure: [],
    directories: [],
    files: []
};

const getters = {
    client: state => state.client,
    structure: state => state.structure,
    directories: state => state.directories,
    files: state => state.files
};

const mutations = {
    setClient(state, payload) {
        state.client = payload.client;
    },
    setStructure(state, payload) {
        state.structure = [...payload.structure];
    },
    setDirectories(state, payload) {
        state.directories = [...payload.directories];
    },
    setFiles(state, payload) {
        state.files = [...payload.files];
    }
};

const actions = {
    setClient({commit}, payload) {
        commit('setClient', {client: payload});
    },
    async setStructure({commit, state}) {
        if (!state.client) return;
        const contents = await state.client.getDirectoryContents('', {deep: true});
        const dirs = contents.filter(e => e.type == 'directory').map(e => e.filename);
        const struct = [{name: '', path: '/', child: getDirStructure(dirs)}];
        commit('setStructure', {structure: struct});
    },
    async setDirectories({commit, state}, path) {
        if (!state.client) return;
        const contents = await state.client.getDirectoryContents(path);
        const dirs = contents.filter(e => e.type == 'directory');
        commit('setDirectories', {directories: dirs});
    },
    async setFiles({commit, state}, path) {
        if (!state.client) return;
        const contents = await state.client.getDirectoryContents(path);
        const files = contents.filter(e => e.type == 'file');
        commit('setFiles', {files});
    },
    uploadFile({state}, {path, file}) {
        if (!state.client) return;
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.addEventListener('load', (ev) => {
                const buf = ev.target.result;
                const fullPath = path + '/' + file.name;
                state.client.putFileContents(fullPath, buf).then((resp) => {
                    resolve(resp);
                });
            });
            fr.readAsArrayBuffer(file);
        });
    },
    async deleteDirFile({state}, {path}) {
        if (!state.client) return;
        await state.client.deleteFile(path);
    },
    getFile({state}, {path}) {
        if (!state.client) return;
        return new Promise((resolve) => {
            state.client.getFileContents(path).then((resp) => {
                resolve(resp);
            });
        });
    }
};

export default {
    state, getters, mutations, actions
};