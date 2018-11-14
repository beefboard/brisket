<template>
  <div class="page-container">
    <div class="form">
      <div>
        <div class="images" v-if="images.length > 0">
          <gallery :images="images" :index="index" @close="index = null"></gallery>
          <div
            class="image"
            v-for="(image, imageIndex) in images"
            :key="imageIndex"
            @click="index = imageIndex"
            :style="{ backgroundImage: 'url(' + image + ')', width: '300px', height: '200px' }"
          ></div>
        </div>
        <div class="top">
          <input
            class="title"
            v-model="title"
            type="text"
            placeholder="Title"/>
          <input
            type="file"
            id="files"
            class="files"
            ref="files"
            multiple
            v-on:change="handleFilesUpload()"/>
          <button class="beefbutton upload-button" @click="uploadFile">Attach photo(s)</button>
        </div>
        <textarea-autosize
          placeholder="Type something here..."
          v-model="content"
          :min-height="300"
          @blur.native="onBlurTextarea"
          style="border: none; outline: none; font-size: 1rem;"
        ></textarea-autosize>
        <button @click="post" class="beefbutton submit-button">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['authenticated'],
  data() {
    return {
      title: '',
      content: '',
      files: [],
      images: []
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

    uploadFile() {
      this.$refs.files.click()
    },

    handleFilesUpload() {
      const files = this.$refs.files.files
      for (const file of files) {
        this.images.push(URL.createObjectURL(file))
        this.files.push(file)
      }
    }
  }
}
</script>

<style scoped>
.form {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
}

.form > div {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.form .top {
  display: flex;
  justify-content: space-between;
}

.form .title {
  font-size: 1.4rem;
  font-weight: bold;
  width: 100%;
  margin-bottom: 1rem;
  border: none;
  outline: none;
}

.files {
  display: none;
}

.images {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.submit-button {
  align-self: flex-start;
  margin-top: auto;
}

.image {
  cursor: zoom-in;
  width: 7rem !important;
  height: 5rem !important;
  float: left;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border: 1px solid #ebebeb;
  margin: 0.3rem;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.22);
}
</style>
