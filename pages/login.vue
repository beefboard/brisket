<template>
  <div class="container">
    <form
      method="post"
      class="login"
      @submit.prevent="login">
      <div>
        <input
          v-model="username"
          type="text"
          placeholder="Username">
        <input
          v-model="password"
          type="password"
          placeholder="Password">
        <div
          v-if="errorMessage"
          class="error">{{ errorMessage }}</div>
      </div>
      <button
        :disabled="loginDisabled"
        type="submit">
        Login
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: null,
      password: null,
      loading: false,
      errorMessage: ''
    }
  },

  async asyncData({ store, redirect }) {
    if (store.state.auth) {
      redirect('/')
    }
  },

  computed: {
    loginDisabled: {
      get() {
        return !this.username || !this.password || this.loading
      }
    }
  },

  methods: {
    async login() {
      if (this.loginDisabled) {
        return
      }
      this.errorMessage = ''
      this.loading = true
      try {
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password
        })
        await this.$router.push('/')
      } catch (e) {
        this.loading = false
        if (e.response) {
          if (e.response.status == 401) {
            this.errorMessage = 'Invalid username or password'
          } else if (e.response.status == 500) {
            this.errorMessage = 'Server error'
          }
        } else {
          this.errorMessage = 'Unknown error'
        }
      }
    }
  }
}
</script>

<style scoped>
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
