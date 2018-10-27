<template>
  <section class="container">
    <nuxt-link to="/posts/new">New story</nuxt-link>
    <template v-for="post in posts">
      <div v-bind:key="post">
        {{ post }}
      </div>
    </template>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  async asyncData({ store, $axios }) {
    if (store.state.auth.admin) {
      return (await $axios.get('/posts', {
        params: {
          approved: false
        }
      })).data.posts
    }
  },
  components: {
    Logo
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
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
</style>
