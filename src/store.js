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
    }
};

export default {
    state, getters, mutations, actions
};