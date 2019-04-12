<template>
    <ul class="dir disabled" :root="root" :current="current">
        <template v-for="(val, idx) in directory">
            <li :key="idx">
                <span class="arrow" @click="onClickArrow">
                    <span class="close">▶</span>
                    <span class="open disabled">▼</span>
                </span>
                <span :class="'path ' + ((current === val.path.substring(1).replace(/\//gi, '-') + val.name) ? 'current' : '')">
                    <router-link :to="'/catalog/' + val.path.substring(1).replace(/\//gi, '-') + val.name">
                        {{val.name !== '' ? val.name : '/'}}
                    </router-link>
                </span>
                <template v-if="val.child.length > 0">
                    <ul class="dir disabled">
                    <template v-for="(cval, ii) in val.child">
                        <li :key="ii">
                            <span class="arrow" @click="onClickArrow">
                                <span class="close">▶</span>
                                <span class="open disabled">▼</span>
                            </span>
                            <span :class="'path ' + ((current === cval.path.substring(1).replace(/\//gi, '-') + cval.name) ? 'current' : '')">
                                <router-link :to="'/catalog/' + cval.path.substring(1).replace(/\//gi, '-')  + cval.name">
                                    {{cval.name}}
                                </router-link>
                            </span>
                            <dir :directory="cval.child" :root="false" />
                        </li>
                    </template>
                    </ul>
                </template>
            </li>
        </template>
    </ul>
</template>
<script>
import Dir from './Dir.vue';
export default {
    name: 'dir',
    components: { Dir },
    props: ['root', 'directory'],
    computed: {
        current() {
            return this.$route.params.path;
        }
    },
    methods: {
        onClickArrow(ev) {
            const arrow = ev.target.parentNode;
            const open = arrow.querySelector('.open');
            const close = arrow.querySelector('.close');
            const child = ev.target.parentNode.parentNode.querySelector('ul');
            open.classList.toggle('disabled');
            close.classList.toggle('disabled');
            if (child) {
                child.classList.toggle('disabled');
            }
        }
    },
    updated() {
        const target = this.$el.querySelector('span.path.current');
        for (let elm = target, count = 0; count < 100; count += 1) {
            if (!elm) break;
            const parent = elm.parentNode;
            if (!parent) break;
            if (parent.tagName === 'UL') {
                parent.classList.remove('disabled');
            }
            elm = parent;
        }
    }
}
</script>
<style scoped>
ul {
    padding-left: 14px;
    list-style-type: none;
}
.arrow {
    font-size: 12px;
    padding-right: 4px;
}
.arrow > .disabled {
    display: none;
}
.dir.disabled {
    display: none;
}
.path.current {
    background-color: lightskyblue;
}
</style>
