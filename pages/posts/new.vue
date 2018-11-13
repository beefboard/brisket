<template>
  <div class="page-container">
    <form @submit.prevent="post">
      <input
        v-model="title"
        type="text"
        placeholder="Title">
      <input
        v-model="content"
        type="text"
        placeholder="Content">
      <input
        type="file"
        id="files"
        ref="files"
        multiple
        v-on:change="handleFilesUpload()"/>
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
      content: '',
      files: []
    }
  },
  methods: {
    async post() {
      if (!this.title || !this.content) {
        return
      }

      const formData = new FormData()
      formData.append('title', this.title)
      formData.append('content', this.content)

      for (const file of this.files) {
        formData.append('images', file)
      }

      const response = await this.$axios.post('/v1/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const id = response.data.id

      this.$router.push(`/posts/${id}`)
    },

    handleFilesUpload() {
      this.files = this.$refs.files.files
    }
  }
}
</script>

<style scoped>
</style>
