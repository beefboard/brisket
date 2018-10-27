export default async function({ store }) {
  // When the page changes,
  await store.dispatch('getAuth')
}
