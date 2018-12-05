<template>
  <div class="container">
    <div class="top">
      <div class="details">
        <nuxt-link
          :to="`/profiles/${post.author}`"
          class="author">{{ post.author }}</nuxt-link>
        <div class="date">{{ new Date(post.date) | moment("dddd, MMMM Do YYYY") }}</div>
        <div
          v-if="!post.approved"
          class="info">Awaiting approval</div>
      </div>
      <div
        v-if="images.length > 0"
        class="images">
        <no-ssr>
          <gallery
            :images="images"
            :index="index"
            class="gallery"
            @close="closeImage"/>
          <flickity
            ref="flickity"
            :options="flickityOptions"
            class="carousel">
            <div
              v-for="(image, imageIndex) in images"
              :key="imageIndex"
              class="carousel-cell">
              <img
                :src="image"
                class="carousel-cell-image"
                @click="openImage(imageIndex)"
              >
            </div>
          </flickity>
        </no-ssr>
      </div>
    </div>
    <div class="title">{{ post.title }}</div>
    <div class="main">
      <div class="content">
        <div
          v-for="(paragraph, index) of post.content.split('\n')"
          :key="index">{{ paragraph }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostDetails',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data({ $store }) {
    const images = []

    for (let i = 0; i < this.post.numImages; i++) {
      images.push(
        `${$store.state.API_URL}/v1/posts/${this.post.id}/images/${i}`
      )
    }

    return {
      images: images,
      index: null,
      flickityOptions: {
        initialIndex: 0,
        prevNextButtons: this.post.numImages > 1,
        wrapAround: true,
        autoPlay: true,
        draggable: false
      }
    }
  },
  methods: {
    openImage(index) {
      this.index = index
    },
    closeImage() {
      this.index = null
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
  margin-bottom: 1rem;
}

.main {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.info {
  background-color: red;
  color: white;
  padding: 0.2rem;
  text-align: center;
  border-radius: 0.5rem;
  font-size: 0.7rem;
}

.content {
  max-width: 70rem;
  margin-top: 2rem;
  font-size: 1.2rem;
}

.content > div {
  margin: 1rem;
  word-break: break-all;
  word-wrap: break-word;
}

.carousel {
  flex: 1;
  max-width: 30rem;
  height: 15rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  overflow: hidden;
}
.carousel-cell {
  cursor: zoom-in;
  width: 66%;
  height: 15rem;
  margin-right: 10px;
}

.carousel-cell-image {
  display: block;
  max-height: 100%;
  margin: 0 auto;
  max-width: 100%;
}

@media screen and (max-width: 600px) {
  .top {
    flex-direction: column;
  }
  .carousel {
    max-width: unset;
    width: 100%;
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
  align-items: flex-start;
  flex-direction: column;
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
</style>
