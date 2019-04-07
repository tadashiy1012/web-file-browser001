<template>
    <div class="baseContainer">
        <div class="left">
            <h4>navi</h4>
        </div>
        <div class="right">
            <router-view />
        </div>
    </div>
</template>
<script>
export default {
}
</script>
<style scoped>
.baseContainer {
    width: 90%;
    margin: auto;
    display: flex;
    flex-direction: row;
}
.left {
    width: 200px;
}
.right {
    width: 100%;
}
</style>
