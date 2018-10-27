/**
 * When implimented in plugins, this will automatically
 * add our access token to all requests we make via
 * axios
 */
export default function({ $axios, redirect, store }) {
  $axios.onRequest(config => {
    config.headers['x-access-token'] = store.state.token
  })

  $axios.onError(error => {})
}
