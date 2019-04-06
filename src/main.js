import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import {createClient} from 'webdav';
import store from './store';

Vue.use(Vuex);
Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
    ]
})

const app = new Vue({
    store: new Vuex.Store(store),
    router,
    template: '<h1>index</h1>',
    created: async function() {
        const client = createClient('http://localhost:3000/webdav');
        this.$store.dispatch('setClient', client);
        const contents = await client.getDirectoryContents('', {deep: true});
        const dirs = contents.filter(e => e.type == 'directory').map(e => e.filename);
        console.log(dirs);
        function find(dirs) {
            let dir = {};
            for (;;) {
                let next = dirs.shift()
                if (!next) break;
                if (next.lastIndexOf('/') > 0) {
                    const parent = next.substring(1).split('/')[0];
                    const child = next.substring(next.indexOf(parent) + parent.length);
                    console.log(next, parent, child);
                    if (!dir[parent]) dir[parent] = {};
                    dir[parent] = Object.assign(dir[parent], find([child]));
                } else {
                    dir[next.substring(1)] = {};
                }
            }
            return dir;
        }
        console.log(find(dirs));
    }
}).$mount('#app');

console.log(app);
