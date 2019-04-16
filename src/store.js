import {createClient} from 'webdav';
import {getDirStructure} from './util';

const state = {
    logged: false,
    client: null,
    name: null,
    structure: [],
    directories: [],
    files: []
};

const getters = {
    logged: state => state.logged,
    client: state => state.client,
    name: state => state.name,
    structure: state => state.structure,
    directories: state => state.directories,
    files: state => state.files
};

const mutations = {
    setLogged(state, payload) {
        state.logged = payload.logged;
    },
    setClient(state, payload) {
        state.client = payload.client;
    },
    setName(state, payload) {
        state.name = payload.name;
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
    doLogin({dispatch}, payload) {
        return new Promise((resolve, reject) => {
            const client = createClient('http://localhost:3000/webdav', {
                username: payload.name,
                password: payload.password
            });
            client.getDirectoryContents('').then(async () => {
                const fd = new FormData();
                fd.append('name', payload.name);
                fd.append('password', payload.password);
                const opt = {
                    method: 'POST',
                    body: fd
                };
                const resp = await fetch('/login', opt);
                const text = await resp.text();
                console.log(resp);
                if (text !== 'ok') {
                    reject(new Error('login error'));
                }
                await dispatch('setClient', client);
                await dispatch('setName', payload.name);
                await dispatch('setLogged', true);
                resolve(true);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    },
    async fetchLogged({dispatch}) {
        const resp = await fetch('/logged');
        const json = await resp.json();
        console.log(json);
        if (json.name && json.pass) {
            const client = createClient('http://localhost:3000/webdav', {
                username: json.name,
                password: json.pass
            });
            await dispatch('setClient', client);
            await dispatch('setName', json.name);
            await dispatch('setLogged', true);
        }
    },
    async doLogout({dispatch}) {
        const resp = await fetch('/logout');
        const text = await resp.text();
        console.log(text);
        await dispatch('setClient', null);
        await dispatch('setName', null);
        await dispatch('setLogged', false);
        return true;
    },
    setLogged({commit}, payload) {
        commit('setLogged', {logged: payload});
    },
    setClient({commit}, payload) {
        commit('setClient', {client: payload});
    },
    setName({commit}, payload) {
        commit('setName', {name: payload});
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