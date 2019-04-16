<template>
    <div class="loginContainer">
        <h1>web file browser</h1>
        <h2>login</h2>
        <div class="inputContainer">
            <span>name</span>
            <input type="text" id="inName">
        </div>
        <div class="inputContainer">
            <span>password</span>
            <input type="password" id="inPass">
        </div>
        <div class="submitContainer">
            <button @click="onClickLogin">login</button>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        onClickLogin() {
            const inName = document.getElementById('inName');
            const inPass = document.getElementById('inPass');
            const name = inName.value;
            const password = inPass.value;
            if (name.length === 0 || password.length === 0) {
                return;
            }
            this.$store.dispatch('doLogin', {name, password}).then((resp) => {
                console.log(resp);
                
                this.$router.push('/');
            });
        }
    }
}
</script>
<style scoped>
.loginContainer {
    width: 400px;
    margin: auto;
}
h1, h2 {
    text-align: center;
}
.inputContainer {
    display: grid;
    grid-template-columns: 90px 286px;
    gap: 4px;
    margin-bottom: 6px;
}
.inputContainer span {
    text-align: right;
}
.submitContainer {
    text-align: center;
}
</style>
