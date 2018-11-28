<template>
  <div class="page-container">
    <div class="form-container">
      <form
        method="post"
        class="login"
        @submit.prevent="login">
        <div class="title">Beefboard</div>
        <div class="inputs">
          <input
            v-model="username"
            type="text"
            placeholder="Username">
          <input
            v-model="password"
            type="password"
            placeholder="Password">
          <div class="error">{{ errorMessage }}</div>
        </div>
        <button
          :disabled="loginDisabled"
          class="beefbutton login-button"
          type="submit">
          Login
        </button>
      </form>
    </div>
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
            this.password = ''
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
.form-container {
  display: flex;
  flex: 1;
  justify-content: center;
}

form {
  display: flex;
  align-items: center;
}

.title {
  text-align: center;
  text-transform: uppercase;
  font-size: 3rem;
  margin: 3rem;
  margin-bottom: 5rem;
}

.inputs {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.error {
  height: 1rem;
  font-size: 1rem;
  color: red;
  text-align: center;
}

input {
  width: 20rem;
  border-style: none;
  font-size: 1rem;
  margin-bottom: 1rem;
  padding: 0.6rem;
  background-color: #f1f1f1;
  border-radius: 0.5rem;
}

input:focus {
  outline: none;
}

.login {
  display: flex;
  flex-direction: column;
}

.login-button {
  width: 100%;
}
</style>
