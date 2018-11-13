<template>
  <div class="page-container">
    <div class="main-posts">
      <div class="title">Posts</div>
      <div class="posts">
        <div
          class="top-pinned"
          v-if="pinnedPosts.length > 0">
          <post
            :post="post"
            v-for="(post, index) of pinnedPosts"
            :key="index"/>
        </div>
        <post
          :post="post"
          v-for="(post, index) of posts"
          :key="index"/>
      </div>
    </div>
    <div class="sidebar">
      <div
        class="posts pinned"
        v-if="pinnedPosts.length > 0">
        <post
          :post="post"
          v-for="(post, index) of pinnedPosts"
          :key="index"/>
      </div>
      <div
        class="info-message"
        v-if="pinnedPosts.length < 1">
        No pinned posts
      </div>
      <button
        v-if="admin"
        @click="viewNew">
        Review new stories
      </button>
    </div>
  </div>
</template>

<script>
import Post from '~/components/Post.vue'

export default {
  components: {
    Post
  },
  data() {
    return {
      posts: [],
      pinnedPosts: [],
      unapproved: false,
      admin: false
    }
  },
  async asyncData({ store, error, route }) {
    try {
      const query = {}
      const admin = store.state.auth && store.state.auth.admin

      if (route.query.approved !== undefined && admin) {
        query.approved = route.query.approved
      }
      const posts = await store.dispatch('getPosts', query)
      posts.sort((p1, p2) => {
        return p2.date.localeCompare(p1.date)
      })

      let pinned =
        posts.filter(post => {
          return post.pinned
        }) || []

      if (pinned.length > 2) {
        pinned = pinned.slice(0, 2)
      }

      const unpinned = posts.filter(post => {
        return !post.pinned
      })
      return {
        posts: unpinned,
        pinnedPosts: pinned,
        unapproved: query.approved === 'false',
        admin: admin
      }
    } catch (e) {
      console.log(e)
      error('Error loading posts')
    }
  },
  watchQuery: true,
  methods: {
    async viewNew() {
      this.$router.push({ path: '/', query: { approved: false } })
    }
  }
}
</script>

<style scoped>
.main-posts {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-right: 28rem;
  min-width: 0;
}

.title {
  margin-left: 0.5rem;
  font-size: 5rem;
  font-weight: bold;
  color: black;
  margin-bottom: 1rem;
}

.posts {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 1rem;
  margin-right: 1rem;
  min-width: 0;
}

.top-pinned {
  margin-bottom: 1rem;
  display: none;
}

.sidebar {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 9.5rem;
  right: 1.5rem;
  height: 40rem;
  width: 25rem;
}

.pinned-title {
  color: rgb(168, 168, 168);
  margin-left: 1rem;
}

@media screen and (max-width: 800px) {
  .sidebar {
    display: none !important;
  }

  .main-posts {
    padding-right: 0rem;
  }

  .top-pinned {
    display: block;
  }
}
</style>
