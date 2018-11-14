<template>
  <div class="page-container">
    <div class="error" v-if="errorMessage">{{ errorMessage }}</div>
    <form @submit.prevent="register">
      <input
        v-model="username"
        :class="{ bad: invalidUser || usernameTaken }"
        type="text"
        placeholder="Username"
        @keyup="checkUsername">
      <input
        v-model="password"
        :class="{ bad: badPasswords }"
        type="password"
        placeholder="Password">
      <input
        v-model="password2"
        :class="{ bad: badPasswords }"
        type="password"
        placeholder="Retype password">
      <input
        v-model="email"
        :class="{ bad: invalidEmail }"
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
      <button class="beefbutton" :disabled="!validForm || loading">Register</button>
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
      validUser: true,
      usernameTaken: false,
      errorMessage: null
    }
  },

  validate({ store, redirect }) {
    if (store.state.auth) {
      redirect('/')
      return false
    }
    return true
  },
  computed: {
    validForm() {
      return (
        this.username &&
        !this.invalidUser &&
        this.password &&
        this.password2 &&
        !this.badPasswords &&
        !this.invalidEmail &&
        this.email &&
        this.firstName &&
        this.lastName
      )
    },

    badPasswords() {
      return this.password && this.password2 && this.password != this.password2
    },

    invalidEmail() {
      return this.email && !emailValidator.validate(this.email)
    },

    invalidUser() {
      return this.username && this.username.indexOf(' ') > -1
    }
  },

  methods: {
    async register() {
      if (!this.validForm) {
        return
      }

      this.loading = true
      this.errorMessage = null
      try {
        // register the account, and then login
        await this.$store.dispatch('register', {
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
        if (e.response && e.response.status) {
          if (e.response.status == 500) {
            this.errorMessage = 'Server error'
          } else {
            this.errorMessage = 'Unknown error'
          }
        } else {
          this.errorMessage = 'Connection error'
        }
      }
    },

    async checkUsername() {
      if (!this.username) {
        return
      }

      if (this.invalidUser) {
        return
      }

      const username = this.username
      await new Promise(resolve => setTimeout(resolve, 100))
      if (this.username != username) {
        return
      }

      try {
        await this.$store.dispatch('getUser', username)
        if (this.username == username) {
          this.usernameTaken = true
        }
      } catch (e) {
        if (e.response && e.response.status == 404) {
          if (this.username == username) {
            this.usernameTaken = false
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
input {
  animation: linear 0.3s ease-in-out;
}
.bad {
  border-color: red;
}
</style>
