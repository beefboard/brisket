export default async function({ store }) {
  // When the page changes, we get our current auth details
  if (store.state.token) {
    try {
      await store.dispatch('refreshAuth')
    } catch (e) {
      if (e.response && e.response.status === 401) {
        // Unauthorised. Clear our session
        store.dispatch('clearSession')
      } else {
        //console.log(e.message)
      }
    }
  }
}
