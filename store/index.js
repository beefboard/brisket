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
  // When creating the store, we try
  async nuxtServerInit(store, context) {
    const token = context.app.$cookies.get('AUTH_TOKEN')
    store.state.token = token
  },

  async login({ commit }, data) {
    const response = await this.$axios.put('/me', {
      username: data.username,
      password: data.password
    })
    this.$cookies.set('AUTH_TOKEN', response.data.token)
    commit('token', response.data.token)
  },

  async getAuth({ commit }) {
    let me
    try {
      const response = await this.$axios.get('/me')
      me = response.data
    } catch (e) {
      console.log(e.error)
      me = null
    }

    commit('auth', me)
  },

  async logout({ commit }) {
    try {
      await this.$axios.delete('/me')
    } catch (e) {
      console.log(e.error)
    }

    this.$cookies.set('AUTH_TOKEN', null)
    commit('token', null)
    commit('auth', null)
  }
}
