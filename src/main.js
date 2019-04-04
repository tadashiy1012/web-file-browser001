import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

Vue.use(Vuex);
Vue.use(VueRouter);

const app = new Vue({
    template: '<h1>index</h1>'
}).$mount('#app');

console.log(app);