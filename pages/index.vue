<template>
  <section class="container">
    <div>
      <logo/>
      <form
        method="post"
        class="login"
        @submit.prevent="register">
        <input
          type="text"
          v-model="username"
          placeholder="Username">
        <input
          type="password"
          v-model="password"
          placeholder="Password">
        <button>Test</button>
      </form>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  methods: {
    async register() {
      await this.$axios.put('me', {
        username: this.username,
        password: this.password
      })
    }
  },
  data() {
    return {}
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.login {
  display: flex;
  flex-direction: column;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
