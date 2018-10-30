import Vuex from 'vuex'
import auth from './auth'

import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('auth', () => {
  let state
  let actions
  function generateStore() {
    return new Vuex.Store({
      actions,
      state
    })
  }

  beforeEach(() => {
    actions = {}
    state = {}
  })
  it('should do nothing if no token in store', async () => {
    expect.assertions(1)
    const mock = jest.fn()
    actions = {
      async refreshAuth() {
        mock.call()
      }
    }
    state = {
      token: null
    }

    const store = generateStore()
    await auth({ store })
    expect(mock).not.toHaveBeenCalled()
  })

  it('should refreshAuth if token is in store', async () => {
    expect.assertions(1)

    const mock = jest.fn()
    actions = {
      async refreshAuth() {
        mock.call()
      }
    }

    state = {
      token: 'test'
    }
    const store = generateStore()

    await auth({ store })
    expect(mock).toHaveBeenCalled()
  })

  it('should clear session if 401 error thrown', async () => {
    const mock = jest.fn()
    actions = {
      async refreshAuth() {
        const error = {
          response: {
            // 401 Forbidden
            status: 401
          }
        }
        throw error
      },
      clearSession() {
        mock()
      }
    }

    state = {
      token: 'test'
    }
    const store = generateStore()

    await auth({ store })
    expect(mock).toHaveBeenCalled()
  })

  it('should not clear session on other error codes', async () => {
    const mock = jest.fn()
    actions = {
      async refreshAuth() {
        const error = {
          response: {
            // 500 error
            status: 500
          }
        }
        throw error
      },
      clearSession() {
        mock()
      }
    }

    state = {
      token: 'test'
    }
    const store = generateStore()

    await auth({ store })
    expect(mock).not.toHaveBeenCalled()
  })
})
