import {getDirStructure} from './util';

const state = {
    client: null,
    directories: {}
};

const getters = {
    client: state => state.client,
    directories: state => state.directories
};

const mutations = {
    setClient(state, payload) {
        state.client = payload;
    },
    setDirectories(state, payload) {
        state.directories = payload;
    }
};

const actions = {
    setClient({commit}, payload) {
        commit('setClient', payload);
    },
    async setDirectories({commit, state}) {
        if (!state.client) return;
        const contents = await state.client.getDirectoryContents('', {deep: true});
        const dirs = contents.filter(e => e.type == 'directory').map(e => e.filename);
        const struct = getDirStructure(dirs);
        commit('setDirectories', struct);
    }
};

export default {
    state, getters, mutations, actions
};