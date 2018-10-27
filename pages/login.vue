<template>
  <div class="container">
    <form
      v-if="!$store.state.auth"
      method="post"
      class="login"
      @submit.prevent="login">
      <input
        v-model="username"
        type="text"
        placeholder="Username">
      <input
        v-model="password"
        type="password"
        placeholder="Password">
      <button>Login</button>
    </form>
    <div>Me: {{ $store.state.auth }}</div>
    <div>Token: {{ $store.state.token }} </div>
    <button
      v-if="$store.state.auth"
      @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password
        })
        await this.$store.dispatch('getAuth')
      } catch (e) {}
    },
    async logout() {
      try {
        await this.$store.dispatch('logout')
      } catch (e) {}
    }
  }
}
</script>

<style>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login {
  display: flex;
  flex-direction: column;
}
</style>
