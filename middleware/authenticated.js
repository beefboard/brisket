/**
 * Any page which impliments this will
 * redirect to login if the user is not authenticated
 */
export default async function({ store, redirect }) {
  // If the user is not authenticated, go to login
  if (!store.state.auth) {
    await store.dispatch('logout')
    await redirect('/login')
  }
}
