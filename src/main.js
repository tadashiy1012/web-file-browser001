import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import {createClient} from 'webdav';
import store from './store';
import {Base, Catalog} from './components';

Vue.use(Vuex);
Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '/', component: Base, children: [
            {path: '/', component: Catalog},
            {path: '/catalog', component: Catalog}
        ]},
        {path: '/home', component: Base}
    ]
})

const app = new Vue({
    store: new Vuex.Store(store),
    router,
    template: '<router-view />',
    created: async function() {
        const client = createClient('http://localhost:3000/webdav');
        await this.$store.dispatch('setClient', client);
        await this.$store.dispatch('setDirectories');
    }
}).$mount('#app');

console.log(app);
