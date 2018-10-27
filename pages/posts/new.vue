<template>
  <div>
    <form @submit.prevent="post">
      <input v-model="title" type="text" placeholder="Title">
      <input v-model="content" type="text" placeholder="Content">
      <button>Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  middleware: ['authenticated'],
  data() {
    return {
      title: '',
      content: ''
    }
  },
  methods: {
    async post() {
      if (!this.title || !this.content) {
        return
      }

      const response = await this.$axios.post('/posts', {
        title: this.title,
        content: this.content
      })

      const id = response.data.id

      this.$router.push(`/posts/${id}`)
    }
  }
}
</script>

<style>
</style>
