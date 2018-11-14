<template>
  <div class="page-container">
    <div class="page">
      <div class="top">
        <nuxt-link class="back" to="/">
          <fa :icon="faChevronLeft"/>Back to posts
        </nuxt-link>
        <div v-if="admin" class="admin">
          <button class="approve-button beefbutton" v-if="!post.approved" @click="approve">Approve</button>
          <button class="beefbutton" v-if="post.approved && !post.pinned" @click="pin">Pin</button>
          <button class="beefbutton" v-if="post.approved && post.pinned" @click="unpin">Unpin</button>
          <button class="beefbutton" @click="confirmRemove"><fa :icon="faTrashAlt"/></button>
        </div>
      </div>
      <post-details
        :post="post"
      />
    </div>
    <v-dialog/>
  </div>
</template>
<script>
import config from '~/nuxt.config'
import PostDetails from '~/components/PostDetails'
import { faChevronLeft, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

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
        this.post.approved = true
      } catch (e) {}
    },
    async pin() {
      try {
        await this.$store.dispatch('pinPost', {
          id: this.id,
          pinned: true
        })
        this.post.pinned = true
      } catch (_) {}
    },
    async unpin() {
      try {
        await this.$store.dispatch('pinPost', {
          id: this.id,
          pinned: false
        })
        this.post.pinned = false
      } catch (_) {}
    },
    async remove() {
      try {
        await this.$store.dispatch('deletePost', this.id)
        this.$router.push('/')
      } catch (_) {}
    },
    async confirmRemove() {
      this.$modal.show('dialog', {
        title: 'Delete post',
        text: 'Are you sure you want to delete this post?',
        buttons: [
          {
            title: 'Confirm',
            handler: this.remove
          },
          {
            title: 'Cancel'
          }
        ]
      })
    }
  },
  computed: {
    faChevronLeft() {
      return faChevronLeft
    },
    faTrashAlt() {
      return faTrashAlt
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

.top {
  margin: 1rem;
  display: flex;
  justify-content: space-between;
}

a {
  display: flex;
  align-items: center;
  color: black;
  text-decoration: none;
}

button {
  font-size: 1rem;
}
</style>
