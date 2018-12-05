<template>
  <div class="page-container">
    <div class="filters">
      <div>Filter</div>
      <div>
        <input
          id="new"
          v-model="search"
          type="radio"
          name="filter"
          value="new"
          @change="queryChange"> New
        <div>
          <input
            id="pinned"
            v-model="search"
            type="radio"
            name="filter"
            value="pinned"
            @change="queryChange"> Pinned
        </div>
        <div v-if="isAdmin">
          <input
            id="unapproved"
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
        :key="index"
        class="browse-post"/>
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
      search: 'new'
    }
  },

  head() {
    return {
      title: `Browse - Beefboard`
    }
  },

  async asyncData({ route, error, store }) {
    try {
      const query = route.query
      let posts = await store.dispatch('getPosts', query)

      let search = 'new'

      if (query.pinned != undefined && query.pinned.toString() === 'true') {
        posts = posts.filter(post => {
          return post.pinned
        })
        search = 'pinned'
      } else if (
        query.approved != undefined &&
        query.approved.toString() === 'false'
      ) {
        search = 'unapproved'
      } else {
        // Don't show posts any posts as pinned
        posts.forEach(post => {
          post.pinned = false
        })
      }

      posts.sort((p1, p2) => {
        return p2.date.localeCompare(p1.date)
      })

      return {
        posts: posts,
        search: search
      }
    } catch (e) {
      console.log(e)
      error('Error loading posts')
    }
  },
  watchQuery: true,
  computed: {
    isAdmin() {
      return this.$store.state.auth && this.$store.state.auth.admin
    }
  },
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
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: start;
  flex: 1;
  margin-left: 8rem;
  margin-right: 1rem;
  min-width: 0;
}

.browse-post {
  width: 20rem;
  margin-right: 1rem;
  margin-left: 1rem;
}

.filters {
  margin: 1rem;
  position: fixed;
  display: flex;
  flex-direction: column;
  font-size: 0.7rem;
}

@media screen and (max-width: 800px) {
  .posts {
    flex-direction: column;
    flex-wrap: unset;
    justify-content: stretch;
  }

  .browse-post {
    width: 100%;
    margin-left: 0rem;
    margin-right: 0rem;
  }
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
