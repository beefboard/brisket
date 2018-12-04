<template>
  <div class="page-container">
    <div class="form">
      <div>
        <div
          v-if="images.length > 0"
          class="images">
          <gallery
            :images="images"
            :index="clickedImage"
            @close="clickedImage = null"/>
          <div
            v-for="(image, imageIndex) in images"
            :key="imageIndex"
            :style="{ backgroundImage: `url(${image})`}"
            class="image"
            @click="clickedImage = imageIndex"
          />
        </div>
        <div class="top">
          <input
            v-model="title"
            class="title"
            type="text"
            placeholder="Title">
          <input
            id="files"
            ref="files"
            type="file"
            class="files"
            multiple
            @change="handleAttachFiles()">
          <button
            class="beefbutton upload-button"
            @click="attachFileClicked">Attach photo(s)</button>
        </div>
        <textarea-autosize
          v-model="content"
          :min-height="300"
          class="content"
          placeholder="Type something here..."
          style="border: none; outline: none; font-size: 1rem;"
          @blur.native="onBlurTextarea"
        />
        <button
          :disabled="submitDisabled"
          class="beefbutton submit-button"
          @click="post">Submit</button>
      </div>
    </div>
    <v-dialog/>
  </div>
</template>

<script>
export default {
  middleware: ['authenticated'],
  data() {
    return {
      title: '',
      content: '',
      clickedImage: null,
      files: [],
      images: [],
      loading: false
    }
  },

  head() {
    return {
      title: `New post - Beefboard`
    }
  },

  computed: {
    submitDisabled() {
      return !this.title || !this.content || this.loading
    }
  },

  methods: {
    async post() {
      this.loading = true
      try {
        const id = await this.$store.dispatch('newPost', {
          title: this.title,
          content: this.content,
          images: this.files
        })

        this.$router.push(`/posts/${id}`)
        return
      } catch (e) {
        this.$modal.show('dialog', {
          title: 'Posting error',
          text: 'Unknown error uploading post, please try again',
          buttons: [
            {
              title: 'Ok'
            }
          ]
        })
      }

      this.loading = false
    },

    attachFileClicked() {
      this.$refs.files.click()
    },

    handleAttachFiles() {
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

.upload-button {
  width: 8rem;
}

textarea {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
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
