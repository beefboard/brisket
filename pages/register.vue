<template>
  <div class="page-container">
    <div class="form-container">
      <form @submit.prevent="register">
        <input
          v-model="username"
          :class="{ bad: invalidUser || usernameTaken }"
          type="text"
          placeholder="Username"
          @keyup="checkUsername">
        <div class="password-input">
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
        </div>
        <input
          v-model="email"
          :class="{ bad: invalidEmail }"
          type="text"
          placeholder="Email">
        <div class="name-input">
          <input
            v-model="firstName"
            type="text"
            placeholder="First name">
          <input
            v-model="lastName"
            type="text"
            placeholder="Last name">
        </div>
        <div class="error-message">
          {{ errorMessage }}
        </div>
        <button
          :disabled="!validForm || loading"
          class="beefbutton register-button">Register</button>
      </form>
    </div>
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
      response: null
    }
  },

  head() {
    return {
      title: 'Register - Beefboard'
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
    },

    errorMessage() {
      if (this.response) {
        return this.response
      }

      let messages = []
      if (this.badPasswords) {
        messages.push('Passwords do not match')
      }

      if (this.invalidEmail) {
        messages.push('Email is not valid')
      }

      if (this.invalidUser) {
        messages.push('Invalid user')
      }

      if (this.usernameTaken) {
        messages.push('Username already exists')
      }

      return messages.join(', ')
    }
  },

  methods: {
    async register() {
      if (!this.validForm) {
        return
      }

      this.loading = true
      this.response = null
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
            this.response = 'Server error'
          } else {
            this.response = 'Unknown error'
          }
        } else {
          this.response = 'Connection error'
        }
      }
    },

    async doUsernameCheck(username) {
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
    },

    checkUsername() {
      if (!this.username) {
        return
      }

      if (this.invalidUser) {
        return
      }

      const username = this.username
      setTimeout(() => {
        this.doUsernameCheck(username)
      }, 100)
    }
  }
}
</script>

<style scoped>
.page-container {
  margin: 1rem;
}

.form-container {
  display: flex;
  flex: 1;
  justify-content: center;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  transition: all 0.3s ease-in-out;
  width: 20rem;
  border-style: solid;
  border-color: #f1f1f1;
  font-size: 1rem;
  margin-bottom: 1rem;
  padding: 0.6rem;
  background-color: #f1f1f1;
  border-radius: 0.5rem;
  margin: 0.5rem;
}

input:focus {
  outline: none;
}

.password-input {
  margin-bottom: 2rem;
}

.name-input {
  margin-bottom: 2rem;
}

.register-button {
  width: 5rem;
}

.error-message {
  height: 1rem;
  color: red;
  margin-bottom: 1rem;
}

.bad {
  border-color: red;
}
</style>
