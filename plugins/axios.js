/**
 * When implimented in plugins, this will automatically
 * add our access token to all requests we make via
 * axios
 */
export default function({ $axios, store }) {
  $axios.defaults.timeout = 3000

  $axios.onRequest(config => {
    config.baseURL = store.state.API_URL
    if (store.state.token) {
      config.headers['x-access-token'] = store.state.token
    }
  })
}
