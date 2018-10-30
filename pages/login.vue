<template>
  <div class="container">
    <form
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
      <button :disabled="loading">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: null,
      password: null,
      loading: false
    }
  },
  async asyncData({ store, redirect }) {
    if (store.state.auth) {
      redirect('/')
    }
  },
  methods: {
    async login() {
      this.loading = true
      try {
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password
        })
        await this.$router.push('/')
      } catch (e) {
        this.loading = false
        console.log(e)
        console.log('login failed')
      }
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
