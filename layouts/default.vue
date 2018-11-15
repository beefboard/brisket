<template>
  <div class="main-container">
    <div class="menu-closer" v-if="menuOpen" @click="closeMenu"></div>
    <div class="menu" v-bind:class="{ 'menu-closed': !menuOpen }">
      <div class="menu-main-links">
        <nuxt-link
          to="/" exact>
          Home
        </nuxt-link>
        <nuxt-link
          to="/posts/" exact>
          Browse
        </nuxt-link>
        <nuxt-link
          v-if="auth"
          to="/posts/new">Create
        </nuxt-link>
      </div>
      <div class="menu-profile-links">
        <nuxt-link
          v-if="!auth"
          to="/login">Login</nuxt-link>
        <nuxt-link
          v-if="!auth"
          to="/register">Register</nuxt-link>
        <nuxt-link
          v-if="auth"
          :to="`/profiles/${auth.username}`">
          {{ auth.username }}
        </nuxt-link>
        <a
          v-if="auth"
          class="logout"
          @click="logout">Logout</a>
      </div>
    </div>
    <div class="top-bar">
      <div class="menu-button" @click="openMenu">
        <fa :icon="faBars" style="font-size: 2rem;"/>
      </div>
      <nuxt-link to="/">
        <div class="logo">
          <div class="img-wrapper">
            <img src="/img/meat.jpg"/>
          </div>
          <div class="logo-text">
            <div>Beefboard</div>
            <div class="sub-heading">Your local beef</div>
          </div>
        </div>
      </nuxt-link>
      <div class="links">
        <div class="main-link">
          <nuxt-link
            to="/" exact>
            Home
          </nuxt-link>
          <nuxt-link
            to="/posts/" exact>
            Browse
          </nuxt-link>
          <nuxt-link
            v-if="auth"
            to="/posts/new">
            Create
          </nuxt-link>
        </div>

        <div class="profile-links">
          <nuxt-link
            v-if="!auth"
            to="/login">Login</nuxt-link>
          <nuxt-link
            v-if="!auth"
            to="/register">Register</nuxt-link>
          <nuxt-link
            v-if="auth"
            :to="`/profiles/${auth.username}`">
            {{ auth.username }}
          </nuxt-link>
          <a
            v-if="auth"
            class="logout"
            @click="logout">Logout</a>
        </div>
      </div>
    </div>
    <div class="top-bar-spacer"></div>
    <nuxt/>
  </div>
</template>

<script>
import { faBars } from '@fortawesome/free-solid-svg-icons'

export default {
  data({ $router }) {
    $router.beforeEach((to, from, next) => {
      this.menuOpen = false
      next()
    })
    return {
      menuOpen: false
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('logout')
      this.menuOpen = false
      await this.$router.push('/')
    },
    openMenu() {
      this.menuOpen = true
    },
    closeMenu() {
      this.menuOpen = false
    }
  },
  computed: {
    faBars() {
      return faBars
    },
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
  position: fixed;
  z-index: 500;
  flex-direction: row;
  align-items: center;
  background-color: rgb(255, 255, 255);
  width: 100%;
  height: 4rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.top-bar-spacer {
  height: 4rem;
}

.logo {
  display: flex;
  flex-direction: row;
  padding-left: 1rem;
  font-size: 2rem;
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
  -webkit-user-drag: none;
}

.logo-text {
  margin-left: 0.3rem;
}

img {
  margin-top: 0.7rem;
  width: 3rem;
}

.sub-heading {
  font-size: 0.8rem;
  margin-top: -0.2rem;
  padding-left: 0.2rem;
}

.logout {
  cursor: pointer;
}

a {
  padding: 0.1rem;
  margin-right: 20px;
  font-size: 14px;
  color: rgb(61, 61, 61);
  text-decoration: none;
  text-transform: uppercase;
  padding-top: 2px;
  padding-bottom: 2px;
  transition: color 0.25s;
  transition: font-weight 0.1s ease-in-out;
  font-weight: 400;
  line-height: normal;
}
a:hover {
  color: black;
}

.links a.nuxt-link-active {
  color: rgb(255, 0, 0);
  font-weight: 600;
}

.menu a.nuxt-link-active {
  color: rgb(255, 0, 0);
  font-weight: 600;
}

.links {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.menu-button {
  display: none;
  margin: 1rem;
  cursor: pointer;
}

.menu {
  position: fixed;
  display: none;
  flex-direction: column;
  padding: 1rem;
  height: 100vh;
  left: 0;
  width: 10rem;
  background-color: white;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.22);
  z-index: 99999;
  transition: left 0.2s ease-in-out;
}

.menu.menu-closed {
  left: -13rem;
}

.menu-closer {
  position: fixed;
  left: 11.5rem;
  width: calc(100vw - 11.5rem);
  height: 100vh;
}

.menu-main-links {
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
}

.menu-profile-links {
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
}

.menu a {
  margin: 1rem;
}

@media screen and (max-width: 700px) {
  .menu-button {
    display: block;
  }

  .menu {
    display: flex;
  }

  .menu-closer {
    display: block;
  }

  .links {
    display: none;
  }
}
</style>
