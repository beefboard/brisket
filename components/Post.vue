<template>
  <nuxt-link
    :to="`/posts/${post.id}`">
    <div class="post" v-bind:class="{ pinned: post.pinned }">
      <div class="post-img" v-if="post.numImages > 0">
        <img :src="`${api}/v1/posts/${post.id}/images/0`"/>
      </div>
      <div class="details">
        <div class="top">
          <div class="title">{{ post.title }}</div>
          <div class="top-right">
            <div v-if="!post.approved" class="info">Awaiting approval</div>
            <fa v-if="post.pinned" :icon="faMapPin" style="font-size: 20px; transform: rotate(20deg)"/>
          </div>
        </div>
        <div class="content">{{ post.content }}</div>
        <div class="sub-details">
          <div class="author">{{ post.author }}</div>
          <div class="when">{{ new Date(post.date) | moment("from") }}</div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
import config from '~/nuxt.config'
import { faMapPin } from '@fortawesome/free-solid-svg-icons'
export default {
  name: 'recursive-list',
  props: {
    post: {
      type: Object,
      required: true
    },
    colour: {
      type: String,
      required: false,
      default: 'white'
    }
  },
  data() {
    return {
      api: config.axios.baseURL
    }
  },
  computed: {
    faMapPin() {
      return faMapPin
    }
  }
}
</script>

<style scoped>
.post {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.pinned {
  box-shadow: 0 4px 9px rgba(255, 0, 0, 0.12), 0 4px 9px rgba(255, 0, 0, 0.24);
}

.top-right {
  display: flex;
  align-items: flex-start;
  right: 1rem;
}

.post:hover {
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.22);
}

.info {
  background-color: red;
  color: white;
  padding: 0.2rem;
  text-align: center;
  border-radius: 0.5rem;
  font-size: 0.7rem;
}

.details {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0.5rem;
  margin-top: 0.2rem;
}

.sub-details {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: flex-start;
}

.details > .top {
  display: flex;
  justify-content: space-between;
}

.details > .top > .title {
  font-size: 1.9rem;
  margin-bottom: -0.1rem;
}

.sub-details > .when {
  font-style: italic;
  font-size: 0.7rem;
  color: rgb(119, 119, 119);
}

.sub-details > .author {
  font-size: 0.7rem;
  color: black;
}

.pin-container {
  margin-left: 0.2rem;
}

.details > .content {
  height: 1rem;
  flex: 1;
  min-width: 0;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: rgb(109, 109, 109);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

a {
  color: black;
  text-decoration: none;
}

.post-img {
  height: 15rem;
  background-color: rgb(209, 209, 209);
  position: relative;
  overflow: hidden;
}

.post-img > img {
  position: absolute;
  top: -9999px;
  left: -9999px;
  right: -9999px;
  bottom: -9999px;
  margin: auto;
  width: 100%;
}
</style>
