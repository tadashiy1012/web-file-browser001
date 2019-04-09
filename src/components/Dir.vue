<template>
    <ul :class="'dir disabled ' + (root ? 'root': 'child')">
        <template v-for="(val, key, i) in directory">
            <li :key="i">
                <span class="arrow" @click="onClickArrow">
                    <span class="close">▶</span>
                    <span class="open disabled">▼</span>
                </span>
                <span class="path" @click="onClickLabel">{{key}}</span>
                <ul v-if="Object.keys(val).length > 0" class="dir disabled">
                <template v-for="(cval, ckey, ii) in val">
                    <li :key="ii">
                        <span class="arrow" @click="onClickArrow">
                            <span class="close">▶</span>
                            <span class="open disabled">▼</span>
                        </span>
                        <span class="path" @click="onClickLabel">{{ckey}}</span>
                        <dir :directory="cval" :root="false" />
                    </li>
                </template>
                </ul>
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
        },
        onClickLabel(ev) {
            console.log('click!');
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
