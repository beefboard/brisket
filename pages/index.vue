<template>
  <section class="container">
    <div class="main-posts">
      <div class="posts">
        <nuxt-link
          v-for="(post, index) of posts"
          :to="`/posts/${post.id}`"
          :key="index">
          <div class="post">
            <div class="post-img">
              <img
                v-if="post.numImages && post.numImages > 0"
                :src="`${api}/v1/posts/${post.id}/images/0`"/>
            </div>
            <div class="details">
              <div class="title">{{ post.title }}</div>
              <div class="when">{{ new Date(post.date) | moment("from") }}</div>
              <div class="content">{{ post.content }}</div>
              <div class="author">{{ post.author }}</div>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
    <div class="sidebar">
      <div class="posts">
        <div class="post">
          tadsfsdf
        </div>
      </div>
      <nuxt-link to="/posts/new">New story</nuxt-link>
      <button
        v-if="admin"
        @click="viewNew">
        Review new stories
      </button>
    </div>
  </section>
</template>

<script>
import config from '../nuxt.config'
import moment from 'moment'
export default {
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
      return {
        posts: posts,
        unapproved: query.approved === 'false',
        admin: admin,
        api: config.axios.baseURL
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
.container {
  height: 100%;
  display: flex;
  overflow: scroll;
}

.main-posts {
  width: 100%;
  display: flex;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
.posts {
  display: flex;
  flex-direction: column;
  width: 100%;
}

@media screen and (max-width: 600px) {
  .sidebar {
    display: none !important;
  }
}

.sidebar {
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
  margin-right: 0.5rem;

  top: 1rem;
  position: sticky;
  height: 40rem;
  width: 40rem;
}

.sidebar > .posts {
  margin-left: 0rem;
}

.post {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.post:hover {
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.22);
}

.post > .details {
  padding: 0.5rem;
}

.post > .details > .title {
  font-size: 2rem;
}

.post > .details > .when {
  font-size: 0.7rem;
  color: rgb(119, 119, 119);
  margin-bottom: 0.4rem;
}

.post > .details > .content {
  font-size: 0.8rem;
  color: rgb(109, 109, 109);
}
.posts > a {
  color: black;
  text-decoration: none;
}

.post-img {
  height: 9rem;
  background-color: rgb(209, 209, 209);
  position: relative;
  overflow: hidden;
}

.post-img > img {
  position: absolute;
  top: -9999px;
  left: -9999px;
  right: -9999px;
  bottom: -9999px;
  margin: auto;
}
</style>
