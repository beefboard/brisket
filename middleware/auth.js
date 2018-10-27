export default async function({ store }) {
  // When the page changes, we get our current auth details
  if (store.state.token) {
    await store.dispatch('getAuth')
  }
}
