<template>
  <div class="container">
    <div class="profile-container">
      <div class="username">
        {{ username }}
      </div>
      <div class="name">{{ firstName }} {{ lastName }}</div>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ params, $axios, store, error }) {
    if (params.id == store.state.auth.username) {
      return store.state.auth
    }

    try {
      return (await $axios.get(`/accounts/${params.id}`)).data
    } catch (e) {
      error({ statusCode: 404, message: 'User not found' })
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

<style>
.container {
  margin: 1rem;
  display: flex;
  align-content: center;
  align-items: center;
  text-align: start;
  flex-direction: column;
}

.username {
  font-size: 3rem;
}

.name {
  font-size: 1rem;
}
</style>
