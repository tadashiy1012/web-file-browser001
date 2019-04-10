<template>
    <ul :class="'dir disabled ' + (root ? 'root': 'child')">
        <template v-for="(val, idx) in directory">
            <li :key="idx">
                <span class="arrow" @click="onClickArrow">
                    <span class="close">▶</span>
                    <span class="open disabled">▼</span>
                </span>
                <span class="path">
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
                            <span class="path">
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
</style>
