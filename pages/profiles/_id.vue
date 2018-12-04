<template>
  <div class="page-container">
    <div class="profile-container">
      <div>
        <div class="username">
          {{ username }}
        </div>
        <div class="name">{{ firstName }} {{ lastName }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ params, store, error }) {
    if (
      store.state.auth &&
      params.id.toLowerCase() == store.state.auth.username
    ) {
      return store.state.auth
    }

    try {
      return await store.dispatch('getUser', params.id)
    } catch (e) {
      if (e.response && e.response.status == 404) {
        error({ statusCode: 404, message: 'User not found' })
      } else {
        error({ statusCode: 500, message: 'Unknown error' })
      }
    }
  },

  head() {
    return {
      title: `${this.username}'s profile - Beefboard`
    }
  },

  validate({ redirect, params }) {
    if (!params.id) {
      return redirect('/')
    }

    return true
  }
}
</script>

<style scoped>
.profile-container {
  display: flex;
  align-content: center;
  justify-content: center;
  flex: 1;
}

.username {
  font-size: 3rem;
}

.name {
  font-size: 1rem;
}
</style>
