<template>
  <section class="container">
    <nuxt-link to="/posts/new">New story</nuxt-link>
    <div class="posts">
      <nuxt-link
        v-for="(post, index) of posts"
        :to="'/posts/' + post.id"
        :key="index">
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
export default {
  async asyncData({ store, error }) {
    try {
      return {
        posts: await store.dispatch('getPosts')
      }
    } catch (e) {
      error('Error loading posts')
    }
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
