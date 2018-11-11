<template>
  <div class="container">
    <div class="title">{{ title }}</div>
    <nuxt-link
      :to="`/profiles/${author}`"
      class="author">{{ author }}</nuxt-link>
    <div class="content">{{ content }}</div>
    <div>
      <img
        class="post-image"
        v-for="(n,index) in numImages"
        :key="index" :src="`${api}/v1/posts/${id}/images/${index}`"/>
    </div>
    <button v-if="admin && approved == false" @click="approve">Approve</button>
  </div>
</template>
<script>
import config from '../../nuxt.config'
export default {
  async asyncData({ store, params, error }) {
    try {
      const data = await store.dispatch('getPost', params.id)
      const admin = store.state.auth && store.state.auth.admin

      return Object.assign(
        { id: params.id, api: config.axios.baseURL, admin: admin },
        data
      )
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
  },
  methods: {
    async approve() {
      try {
        await this.$store.dispatch('approvePost', this.id)
        this.approved = true
      } catch (e) {}
    }
  }
}
</script>

<style scoped>
.post-image {
  width: 200px;
}
.container {
  height: 100%;
  display: flex;
  align-content: center;
  align-items: center;
  text-align: start;
  flex-direction: column;
}
</style>
