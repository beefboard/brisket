<template>
  <section class="container">
    <nuxt-link to="/posts/new">New story</nuxt-link>
    <div class="posts">
      <nuxt-link
        :to="'/posts/' + post.id"
        v-for="(post, index) of posts"
        v-bind:key="index">
        <div class="post">
          <div class="title">{{ post.title }}</div>
          <div class="content">{{ post.content }}</div>
          <div class="author">{{ post.author }}</div>
        </div>
      </nuxt-link>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  async asyncData({ store }) {
    if (store.state.auth && store.state.auth.admin) {
      return {
        posts: await store.dispatch('getPosts')
      }
    }
  },
  async mounted() {},
  components: {
    Logo
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.post {
  width: 5rem;
  border: black;
}

.post > .a {
}
</style>
