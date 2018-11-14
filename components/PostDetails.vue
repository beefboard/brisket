<template>
  <div class="container">
    <div class="top">
      <div class="details">
        <nuxt-link :to="`/profiles/${post.author}`" class="author">{{ post.author }}</nuxt-link>
        <div class="date">{{ new Date(post.date) | moment("dddd, MMMM Do YYYY") }}</div>
      </div>
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
    </div>
    <div class="title">{{ post.title }}</div>
    <div class="main">
      <div class="content">
        <div
          v-for="(paragraph, index) of post.content.split('\n')"
          :key="index">
          {{ paragraph }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '~/nuxt.config'

export default {
  name: 'post-details',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    const images = []

    for (let i = 0; i < this.post.numImages; i++) {
      images.push(
        `${config.axios.baseURL}/v1/posts/${this.post.id}/images/${i}`
      )
    }

    return {
      images: images,
      index: null
    }
  }
}
</script>

<style scoped>
.container {
  flex: 1;
  margin: 1rem;
}

.top {
  display: flex;
  flex-direction: row;
}

.main {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.content {
  max-width: 70rem;
  margin-top: 2rem;
  font-size: 1.2rem;
}

.content > div {
  margin: 1rem;
}

@media screen and (max-width: 600px) {
  .top {
    flex-direction: column;
  }
  .image {
    width: 7rem !important;
    height: 5rem !important;
  }
}

.title {
  font-size: 2.4rem;
  font-weight: bold;
  color: rgb(59, 59, 59);
  text-align: center;
}

.details {
  display: flex;
  flex-direction: column;
  flex: 1;
  font-size: 0.8rem;
}

.author {
  text-transform: capitalize;
}

.images {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.image {
  cursor: zoom-in;
  width: 15rem !important;
  height: 10rem !important;
  float: left;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border: 1px solid #ebebeb;
  margin: 1rem;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.22);
}
</style>

