<template>
  <div class="container">
    <div class="title">{{ title }}</div>
    <nuxt-link
      :to="'/profiles/' + author"
      class="author">{{ author }}</nuxt-link>
    <div class="content">{{ content }}</div>
    <div>
      <img
        v-for="index in numImages"
        :key="index" :src="'http://localhost:2832/v1/posts/' + id + '/images/' + (index - 1)"/>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ store, params, error, $axios }) {
    try {
      const data = await store.dispatch('getPost', params.id)

      return Object.assign({ id: params.id }, data)
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
