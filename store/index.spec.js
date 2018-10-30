import * as store from './'
import Vuex from 'vuex'
import axios from 'axios'
import { createLocalVue } from '@vue/test-utils'

jest.mock('axios')

const localVue = createLocalVue()
localVue.use(Vuex)

let mockCookiesStore = {}

/**
 * Cookies is only designed to
 * store our session token
 */
const mockCookies = {
  get: key => {
    return mockCookiesStore[key]
  },
  set: (key, value) => {
    mockCookiesStore[key] = value
  }
}

describe('store', () => {
  let mockStore
  let mockContext

  describe('actions', () => {
    // Resest the mocks
    beforeEach(() => {
      mockCookiesStore = {}
      mockStore = new Vuex.Store({
        state: {
          token: null,
          auth: null
        },
        mutations: store.mutations,
        actions: store.actions
      })
      mockStore.$axios = axios
      mockStore.$cookies = mockCookies

      mockContext = {
        app: {
          $cookies: mockCookies
        }
      }
    })

    describe('nuxtServerInit', () => {
      it('should read token from cookies on init', async () => {
        mockCookiesStore['AUTH_TOKEN'] = 'token'

        await store.actions.nuxtServerInit(mockStore, mockContext)
        expect(mockStore.state.token).toBe('token')
      })
    })

    describe('login', () => {
      it('should save token to cookies and state', async () => {
        axios.put.mockResolvedValue({ data: { token: 'testtoken' } })

        await mockStore.dispatch('login', {
          username: 'test',
          password: 'test'
        })
        expect(mockCookiesStore['AUTH_TOKEN']).toBe('testtoken')
        expect(mockStore.state.token).toBe('testtoken')
      })

      it('should throw error on bad credentials', async () => {
        axios.put.mockImplementation(async () => {
          throw new Error('test error')
        })

        let threw = false
        try {
          await mockStore.dispatch('login', {
            username: 'test',
            password: 'test'
          })
        } catch (e) {
          threw = true
        }

        expect(threw).toBe(true)
      })
    })

    describe('refreshAuth', () => {
      it('should request auth details', async () => {
        const mockAuth = { username: 'test', firstName: 'test' }
        axios.get.mockResolvedValue({ data: mockAuth })

        await mockStore.dispatch('refreshAuth')

        expect(axios.get).toHaveBeenCalled()
      })

      it('should save auth details in state', async () => {
        const mockAuth = { username: 'test', firstName: 'test' }
        axios.get.mockResolvedValue({ data: mockAuth })

        await mockStore.dispatch('refreshAuth')

        expect(mockStore.state.auth).toBe(mockAuth)
      })

      it('should throw an error on failure to retreive details', async () => {
        axios.get.mockImplementation(async () => {
          throw new Error('test error')
        })

        let threw = false
        try {
          await mockStore.dispatch('refreshAuth')
        } catch (e) {
          threw = true
        }

        expect(threw).toBe(true)
      })
    })

    describe('logout', () => {
      it('should request logout from api', async () => {
        axios.delete.mockResolvedValue({ data: { success: true } })
        await mockStore.dispatch('logout')

        expect(axios.delete).toHaveBeenCalled()
      })

      it('should clear session', async () => {
        axios.delete.mockResolvedValue({ data: { success: true } })
        mockCookiesStore['AUTH_TOKEN'] = 'mytoken'
        mockStore.state.token = 'mytoken'

        await mockStore.dispatch('logout')

        expect(mockCookiesStore['AUTH_TOKEN']).toBe(null)
        expect(mockStore.state.auth).toBe(null)
        expect(mockStore.state.token).toBe(null)
      })

      it('should ignore failed api logout request', async () => {
        axios.delete.mockImplementation(async () => {
          throw new Error('test error')
        })
        await mockStore.dispatch('logout')
      })
    })
  })
})
