<template>
  <div class="page-container">
    <div class="page">
      <div v-if="admin" class="admin">
        <button v-if="!post.approved" class="approve-button" @click="approve">Approve</button>
        <button v-if="post.approved" @click="pin">Pin</button>
      </div>
      <nuxt-link class="back" to="/">
        <fa :icon="faChevronLeft"/>Back to posts
      </nuxt-link>
      <post-details
        :post="post"
      />
    </div>
  </div>
</template>
<script>
import config from '~/nuxt.config'
import PostDetails from '~/components/PostDetails'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

export default {
  components: {
    PostDetails
  },
  async asyncData({ store, params, error, router }) {
    try {
      const post = await store.dispatch('getPost', params.id)
      const admin = store.state.auth && store.state.auth.admin

      return {
        id: params.id,
        api: config.axios.baseURL,
        admin: admin,
        post: post
      }
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
    },
    async pin() {
      try {
        await this.$store.dispatch('pinPost', {
          id: this.id,
          pinned: true
        })
        this.pinned = true
      } catch (_) {}
    },
    async unpin() {
      try {
        await this.$store.dispatch('pinPost', {
          id: this.id,
          pinned: false
        })
        this.pinned = false
      } catch (_) {}
    }
  },
  computed: {
    faChevronLeft() {
      return faChevronLeft
    }
  }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  flex: 1;
}

a {
  margin: 1rem;
  display: flex;
  align-items: center;
  color: black;
  text-decoration: none;
}
</style>
