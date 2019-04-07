<template>
    <ul>
        <template  v-for="(val, key, i) in directory">
            <li :key="i">
                {{key}}
                <template v-if="Object.keys(val).length > 0">
                    <ul>
                    <template v-for="(cval, ckey, ii) in val">
                        <li :key="ii">
                            {{ckey}}
                            <dir :directory="cval" />
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
    props: ['directory']
}
</script>
