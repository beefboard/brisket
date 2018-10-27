<template>
  <div>
    <div class="title">{{ title }}</div>
    <nuxt-link class="author" :to="'/profiles/' + author">{{ author }}</nuxt-link>
    <div class="content">{{ content }}</div>
  </div>
</template>
<script>
export default {
  async asyncData({ $axios, params, error }) {
    try {
      return (await $axios.get(`/posts/${params.id}`)).data
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
