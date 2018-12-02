<template>
  <nuxt-link :to="`/posts/${post.id}`">
    <div
      :class="{ pinned: post.pinned }"
      class="post">
      <div
        v-if="post.numImages > 0"
        class="post-img">
        <img :src="`${api}/v1/posts/${post.id}/images/0`">
      </div>
      <div class="details">
        <div class="details-left">
          <div class="top">
            <div class="title">{{ post.title }}</div>
            <div class="top-right">
              <div
                v-if="!post.approved"
                class="info">Awaiting approval</div>
              <fa
                v-if="post.pinned"
                :icon="faMapPin"
                class="pin"/>
            </div>
          </div>
          <div class="content">{{ post.content }}</div>
          <div class="sub-details">
            <div class="author">{{ post.author }}</div>
            <div class="when">{{ new Date(post.date) | moment("from") }}</div>
          </div>
        </div>
        <div class="details-right">
          <div
            id="vote-button-up"
            @click="vote($event, 1)">
            <fa
              :icon="faChevronUp"
              :class="{ 'vote-button-active': voteDirection > 0 }"
              class="vote-button"
            />
          </div>
          <div>{{ post.votes.grade }}</div>
          <div
            id="vote-button-down"
            @click="vote($event, -1)">
            <fa
              :icon="faChevronDown"
              :class="{ 'vote-button-active': voteDirection < 0 }"
              class="vote-button"
            />
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
import {
  faMapPin,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'Post',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data({ $store }) {
    return {
      api: $store.state.API_URL,
      voting: false
    }
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
    voteDirection() {
      if (this.auth) {
        return this.post.votes.user
      }

      return 0
    },
    faMapPin() {
      return faMapPin
    },
    faChevronUp() {
      return faChevronUp
    },
    faChevronDown() {
      return faChevronDown
    }
  },
  methods: {
    vote(event, value) {
      event.preventDefault()
      if (this.voting) {
        return
      }

      // Toggles the current vote they have made
      if (this.post.votes.user == value) {
        value = 0
      }

      if (this.auth) {
        this.voting = true
        this.doVote(value)
      }
    },
    async doVote(value) {
      try {
        await this.$store.dispatch('votePost', {
          post: this.post.id,
          vote: value
        })

        const votes = this.post.votes

        const currentGrading = votes.user
        votes.grade = votes.grade - currentGrading
        votes.grade = votes.grade + value
        votes.user = value
      } catch (e) {
        // An error
      }

      this.voting = false
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

.pin {
  font-size: 20px;
  transform: rotate(20deg);
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

.vote-button-active {
  color: red !important;
}

.vote-button {
  color: grey;
  transition: color 0.2s ease-in-out;
  font-size: 1.3rem;
}

.vote-button:hover {
  color: red;
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
  flex-direction: row;
  justify-content: flex-start;
  flex: 1;
}

.sub-details {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: flex-start;
}

.details-left {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0.5rem;
  margin-top: 0.2rem;
  min-width: 0;
}

.details-left > .top {
  display: flex;
  justify-content: space-between;
}

.details-left > .top > .title {
  font-size: 1.9rem;
  margin-bottom: -0.1rem;
}

.details-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 2rem;
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

.details-left > .content {
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
