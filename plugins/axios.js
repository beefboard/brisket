/**
 * When implimented in plugins, this will automatically
 * add our access token to all requests we make via
 * axios
 */
export default function({ $axios, store }) {
  $axios.defaults.baseURL = store.state.API_URL
  $axios.defaults.timeout = 1000

  $axios.onRequest(config => {
    if (store.state.token) {
      config.headers['x-access-token'] = store.state.token
    }
  })
}
