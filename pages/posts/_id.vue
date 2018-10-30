<template>
  <div class="container">
    <div class="title">{{ title }}</div>
    <nuxt-link class="author" :to="'/profiles/' + author">{{ author }}</nuxt-link>
    <div class="content">{{ content }}</div>
  </div>
</template>
<script>
export default {
  async asyncData({ store, params, error }) {
    console.log(params.id)
    try {
      return await store.dispatch('getPost', params.id)
    } catch (e) {
      console.log(e)
      error({ statusCode: 404, message: 'Post not found' })
    }
  },
  validate({ redirect, params, $axios }) {
    if (!params.id) {
      return redirect('/')
    }
    return true
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  align-content: center;
  align-items: center;
  text-align: start;
  flex-direction: column;
}
</style>
