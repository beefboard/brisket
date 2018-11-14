export const state = () => ({
  token: null,
  auth: null
})

export const mutations = {
  token(state, data) {
    state.token = data
  },
  auth(state, data) {
    state.auth = data
  }
}

export const actions = {
  // When creating the store, we try to retreive the current
  // auth token from our cookies, and place it in the store
  // state
  async nuxtServerInit(store, context) {
    const token = context.app.$cookies.get('AUTH_TOKEN')
    store.state.token = token || null
  },

  /**
   * Clear the current session
   */
  clearSession({ commit }) {
    this.$cookies.set('AUTH_TOKEN', null)
    commit('token', null)
    commit('auth', null)
  },

  /**
   * Perform login, with the given login details.
   *
   * Throws error on failure. On success token will be
   * stored
   */
  async login({ commit }, details) {
    const response = await this.$axios.put('/v1/me', details)
    this.$cookies.set('AUTH_TOKEN', response.data.token)
    commit('token', response.data.token)
  },

  /**
   * Perform logout. After informing server,
   * clear session details from our cookie and store
   */
  async logout() {
    try {
      await this.$axios.delete('/v1/me')
    } catch (_) {}
    this.dispatch('clearSession')
  },

  /**
   * Try and refresh our current auth details, storing
   * them in auth
   */
  async refreshAuth({ commit }) {
    const response = await this.$axios.get('/v1/me', { progress: false })
    commit('auth', response.data)
  },

  /**
   * Perform registration on the api, with the given
   * login details
   */
  async register(_, details) {
    await this.$axios.post('/v1/accounts', details)
  },

  /**
   * Get details of the given user with id
   */
  async getUser(_, id) {
    const response = await this.$axios.get(`/v1/accounts/${id}`)
    return response.data
  },

  /**
   * Get posts with the given query
   */
  async getPosts(_, filter) {
    const response = await this.$axios.get('/v1/posts', {
      params: filter
    })

    return response.data.posts
  },

  async getPost(_, id) {
    const response = await this.$axios.get(`/v1/posts/${id}`)
    return response.data
  },

  async approvePost(_, id) {
    const response = await this.$axios.put(`/v1/posts/${id}/approved`, {
      approved: true
    })
    return response.data.success
  },

  async pinPost(_, { id, pinned }) {
    const response = await this.$axios.put(`/v1/posts/${id}/pinned`, {
      pinned: pinned
    })

    return response.data.success
  },

  async deletePost(_, id) {
    const response = await this.$axios.delete(`/v1/posts/${id}`)
    return response.data.success
  }
}
