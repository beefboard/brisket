<template>
  <div class="container">
    <form @submit.prevent="register">
      <input
        v-model="username"
        v-bind:class="{ bad: !validUser }"
        @keyup="checkUsername"
        type="text"
        placeholder="Username">
      <input
        v-model="password"
        v-bind:class="{ bad: password && password2 && password != password2 }"
        type="password"
        placeholder="Password">
      <input
        v-model="password2"
        v-bind:class="{ bad: password && password2 && password != password2 }"
        type="password"
        placeholder="Retype password">
      <input
        v-model="email"
        v-bind:class="{ bad: !validEmail }"
        @keyup="checkEmail"
        type="text"
        placeholder="Email">
      <input
        v-model="firstName"
        type="text"
        placeholder="First name">
      <input
        v-model="lastName"
        type="text"
        placeholder="Last name">
      <button :disabled="!validForm || loading">Register</button>
    </form>
  </div>
</template>

<script>
import emailValidator from 'email-validator'
export default {
  data() {
    return {
      username: null,
      password: null,
      password2: null,
      firstName: null,
      lastName: null,
      email: null,
      loading: false,
      timeout: null,
      validEmail: true,
      validUser: true
    }
  },
  validate({ store, redirect }) {
    if (store.state.auth) {
      redirect('/')
      return false
    }
    return true
  },
  methods: {
    async register() {
      this.loading = true
      try {
        await this.$axios.post('/accounts', {
          username: this.username,
          password: this.password,
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName
        })
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password
        })
        await this.$router.push('/')
      } catch (e) {
        this.loading = false
        console.log(e)
        console.log('registration error')
      }
    },
    checkEmail() {
      this.validEmail = emailValidator.validate(this.email)
    },
    checkUsername() {
      if (!this.username) {
        return
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(async () => {
        try {
          await this.$axios.get(`/accounts/${this.username}`, {
            progress: false
          })
          this.validUser = false
        } catch (e) {
          if (e.response && e.response.status == 404) {
            this.validUser = true
          }
        }
      }, 500)
    }
  },
  computed: {
    validForm() {
      if (
        !this.username ||
        !this.password ||
        !this.email ||
        !this.firstName ||
        !this.lastName
      ) {
        return false
      }

      if (!this.validUser || !this.validEmail) {
        return false
      }

      return true
    }
  }
}
</script>

<style>
.container {
}

input {
  animation: linear 0.3s ease-in-out;
}
.bad {
  border-color: red;
}
</style>
