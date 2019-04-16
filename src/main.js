import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import store from './store';
import {Base, Catalog, Login} from './components';
import 'material-design-icons/iconfont/material-icons.css';

Vue.use(Vuex);
Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '/', component: Base, children: [
            {path: '/', component: Catalog},
            {path: '/catalog', component: Catalog},
            {path: '/catalog/:path', component: Catalog}
        ]},
        {path: '/home', component: Base},
        {path: '/login', component: Login}
    ]
})

const app = new Vue({
    store: new Vuex.Store(store),
    router,
    template: '<router-view />',
    mounted() {}
}).$mount('#app');

console.log(app);
