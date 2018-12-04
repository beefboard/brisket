<template>
  <div class="page-container">
    <div class="main-posts">
      <div class="title">Posts</div>
      <div class="posts">
        <div
          v-if="pinnedPosts.length > 0"
          class="top-pinned">
          <post
            v-for="(post, index) of pinnedPosts"
            :post="post"
            :key="index"/>
        </div>
        <div
          v-if="posts.length < 1"
          class="no-posts">
          <div>No new posts</div>
        </div>
        <post
          v-for="(post, index) of posts"
          :post="post"
          :key="index"/>
      </div>
    </div>
    <div class="sidebar">
      <div
        v-if="pinnedPosts.length > 0"
        class="posts pinned">
        <post
          v-for="(post, index) of pinnedPosts"
          :post="post"
          :key="index"/>
        <nuxt-link
          to="/posts/?pinned=true">
          More...
        </nuxt-link>
      </div>
      <div
        v-if="pinnedPosts.length < 1"
        class="info-message">
        No pinned posts
      </div>
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
      pinnedTruncated: false
    }
  },

  head() {
    return {
      title: 'Home - Beefboard'
    }
  },

  async asyncData({ store, error }) {
    try {
      const posts = await store.dispatch('getPosts')
      posts.sort((p1, p2) => {
        return p2.date.localeCompare(p1.date)
      })

      let pinned = posts.filter(post => post.pinned)

      let pinnedTruncated = false
      if (pinned.length > 2) {
        pinned = pinned.slice(0, 2)
        pinnedTruncated = true
      }

      const unpinned = posts.filter(post => {
        return !post.pinned
      })

      return {
        posts: unpinned,
        pinnedPosts: pinned,
        pinnedTruncated: pinnedTruncated
      }
    } catch (e) {
      console.log(e)
      error('Error loading posts')
    }
  },
  watchQuery: true
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
  font-weight: lighter;
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

.no-posts {
  flex: 1;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: grey;
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

a {
  color: black;
  text-decoration: none;
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
