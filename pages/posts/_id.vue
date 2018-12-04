<template>
  <div class="page-container">
    <div class="page">
      <div class="top">
        <nuxt-link
          class="back"
          to="/">
          <fa :icon="faChevronLeft"/>Back to posts
        </nuxt-link>
        <div class="buttons">
          <div
            v-if="isAdmin"
            class="admin">
            <button
              v-if="!post.approved"
              id="approve"
              :disabled="loading"
              class="approve-button beefbutton"
              @click="approve">Approve</button>
            <button
              v-if="post.approved && !post.pinned"
              id="pin"
              :disabled="loading"
              class="beefbutton"
              @click="pin">Pin</button>
            <button
              v-if="post.approved && post.pinned"
              id="unpin"
              :disabled="loading"
              class="beefbutton"
              @click="unpin">Unpin</button>
          </div>
          <button
            v-if="isAdmin || isOwner"
            id="delete"
            :disabled="loading"
            class="beefbutton"
            @click="confirmRemove">
            <fa :icon="faTrashAlt"/>
          </button>
        </div>
      </div>
      <post-details :post="post"/>
    </div>
    <v-dialog/>
  </div>
</template>
<script>
import PostDetails from '~/components/PostDetails'
import { faChevronLeft, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

export default {
  components: {
    PostDetails
  },
  data() {
    return {
      loading: false
    }
  },
  async asyncData({ store, params, error }) {
    try {
      const post = await store.dispatch('getPost', params.id)

      return {
        post: post
      }
    } catch (e) {
      if (e.response && e.response.status == 404) {
        error({ statusCode: 404, message: 'Post not found' })
      } else {
        error({ statusCode: 500, message: 'Unknown error, please try again' })
      }
    }
  },

  head() {
    let title = this.post.title
    if (title.length > 20) {
      title = title.substring(0, 20) + '...'
    }

    return {
      title: `${title} - Beefboard`
    }
  },

  computed: {
    faChevronLeft() {
      return faChevronLeft
    },

    faTrashAlt() {
      return faTrashAlt
    },

    isAdmin() {
      return this.$store.state.auth && this.$store.state.auth.admin
    },

    isOwner() {
      return (
        this.$store.state.auth &&
        this.$store.state.auth.username == this.post.author
      )
    }
  },
  methods: {
    async approve() {
      this.loading = true
      try {
        await this.$store.dispatch('approvePost', this.post.id)
        this.post.approved = true
      } catch (_) {
        this.showError(
          'Approval error',
          'An error occured approving post, please try again'
        )
      }
      this.loading = false
    },

    async pin() {
      this.loading = true
      try {
        await this.$store.dispatch('pinPost', {
          id: this.post.id,
          pinned: true
        })
        this.post.pinned = true
      } catch (_) {
        this.showError(
          'Pin error',
          'An error occured pinning post, please try again'
        )
      }
      this.loading = false
    },

    async unpin() {
      this.loading = true
      try {
        await this.$store.dispatch('pinPost', {
          id: this.post.id,
          pinned: false
        })
        this.post.pinned = false
      } catch (_) {
        this.showError(
          'Pin error',
          'An error occured unpinning post, please try again'
        )
      }
      this.loading = false
    },

    async remove() {
      this.loading = true
      try {
        await this.$store.dispatch('deletePost', this.post.id)
        this.$router.push('/')
      } catch (_) {
        this.showError(
          'Pin error',
          'An error occured removing post, please try again'
        )
      }
      this.loading = false
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
    },

    showError(title, text) {
      this.$modal.show('dialog', {
        title,
        text,
        buttons: [
          {
            title: 'Ok'
          }
        ]
      })
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
  margin: 0.2rem;
}

.buttons {
  display: flex;
  flex-direction: row;
}
</style>
