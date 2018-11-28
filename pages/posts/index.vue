<template>
  <div class="page-container">
    <div class="filters">
      <div>Filter</div>
      <div>
        <input
          v-model="search"
          type="radio"
          name="filter"
          value="new"
          @change="queryChange"> New
        <div>
          <input
            v-model="search"
            type="radio"
            name="filter"
            value="pinned"
            @change="queryChange"> Pinned
        </div>
        <div v-if="admin">
          <input
            v-model="search"
            type="radio"
            name="filter"
            value="unapproved"
            @change="queryChange"
          > Unapproved
        </div>
      </div>
    </div>
    <div class="posts">
      <post
        v-for="(post, index) of posts"
        :post="post"
        :key="index"/>
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
      admin: false,
      search: 'new'
    }
  },
  async asyncData({ route, error, store }) {
    try {
      const query = route.query
      const admin = store.state.auth && store.state.auth.admin
      let posts = await store.dispatch('getPosts', query)

      let search = 'new'
      if (query.pinned === 'true' || query.pinned == true) {
        posts = posts.filter(post => {
          return post.pinned
        })
        search = 'pinned'
      } else if (query.approved === 'false' || query.approved == false) {
        search = 'unapproved'
      } else {
        posts.forEach(post => {
          post.pinned = false
        })
      }

      posts.sort((p1, p2) => {
        return p2.date.localeCompare(p1.date)
      })

      return {
        posts: posts,
        admin: admin,
        search: search
      }
    } catch (e) {
      console.log(e)
      error('Error loading posts')
    }
  },
  watchQuery: true,
  methods: {
    async queryChange() {
      const query = {}
      if (this.search == 'pinned') {
        query.pinned = true
      } else if (this.search == 'unapproved') {
        query.approved = false
      }

      this.$router.push({ path: './', query: query })
    }
  }
}
</script>

<style scoped>
.posts {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 8rem;
  margin-right: 1rem;
  min-width: 0;
}

.filters {
  margin: 1rem;
  position: fixed;
  display: flex;
  flex-direction: column;
  font-size: 0.7rem;
}

@media screen and (max-width: 600px) {
  .page-container {
    flex-direction: column;
  }
  .filters {
    position: unset;
  }
  .posts {
    margin-left: 1rem;
  }
}
</style>
