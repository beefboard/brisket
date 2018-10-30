<template>
  <div class="main-container">
    <div class="top-bar">
      <div class="logo">
        <nuxt-link to="/">Beefboard</nuxt-link>
      </div>
      <div class="links">
        <nuxt-link to="/login" v-if="!auth">Login</nuxt-link>
        <nuxt-link to="/register" v-if="!auth">Register</nuxt-link>
        <nuxt-link
          :to="'/profiles/'+auth.username"
          v-if="auth">
          {{ auth.username }}
        </nuxt-link>
        <a class="logout" @click="logout" v-if="auth">Logout</a>
      </div>
    </div>
    <nuxt/>
  </div>
</template>

<script>
export default {
  methods: {
    async logout() {
      await this.$store.dispatch('logout')
      await this.$router.push('/')
    }
  },
  computed: {
    auth() {
      return this.$store.state.auth
    }
  }
}
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(223, 223, 223);
  width: 100%;
  height: 4rem;
}

.logo > a {
  padding: 1rem;
  font-size: 2rem;
}

.logout {
  cursor: pointer;
}

a {
  margin-right: 20px;
  font-size: 14px;
  color: rgb(61, 61, 61);
  text-decoration: none;
  text-transform: uppercase;
  padding-top: 2px;
  padding-bottom: 2px;
  transition: color 0.25s;
  font-weight: 400;
  line-height: normal;
}
a:hover {
  color: #333;
}
.links > a.nuxt-link-active {
  color: rgb(20, 20, 20);
  font-weight: 600;
}
</style>
