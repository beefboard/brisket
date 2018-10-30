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
    afterEach(() => {
      // Reset axios mocks
      axios.get.mockClear()
      axios.post.mockClear()
      axios.delete.mockClear()
      axios.put.mockClear()
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
    })

    describe('refreshAuth', () => {
      it('should request auth details from api, with progress disabled', async () => {
        const mockAuth = { username: 'test', firstName: 'test' }
        axios.get.mockResolvedValue({ data: mockAuth })

        await mockStore.dispatch('refreshAuth')

        expect(axios.get).toHaveBeenCalledWith('/me', { progress: false })
      })

      it('should save auth details in state', async () => {
        const mockAuth = { username: 'test', firstName: 'test' }
        axios.get.mockResolvedValue({ data: mockAuth })

        await mockStore.dispatch('refreshAuth')

        expect(mockStore.state.auth).toBe(mockAuth)
      })
    })

    describe('logout', () => {
      it('should request logout from api', async () => {
        axios.delete.mockResolvedValue({ data: { success: true } })
        await mockStore.dispatch('logout')

        expect(axios.delete).toHaveBeenCalledWith('/me')
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

    describe('register', () => {
      it('should send details to registration api', async () => {
        axios.post.mockResolvedValue({ data: { success: true } })

        const details = {
          username: 'test',
          password: 'test'
        }
        await mockStore.dispatch('register', details)

        expect(axios.post).toHaveBeenCalledWith('/accounts', details)
      })
    })

    describe('getUser', () => {
      it('should return details', async () => {
        const mockDetails = {
          username: 'test',
          firstName: 'test'
        }
        axios.get.mockResolvedValue({ data: mockDetails })

        const username = 'test'
        const details = await mockStore.dispatch('getUser', username)

        expect(details).toBe(mockDetails)
      })

      it('should request details of given user', async () => {
        const mockDetails = {
          username: 'test',
          firstName: 'test'
        }
        axios.get.mockResolvedValue({ data: mockDetails })

        await mockStore.dispatch('getUser', 'test')

        expect(axios.get).toHaveBeenCalledWith('/accounts/test')
      })
    })

    describe('getPosts', () => {
      it('should request from posts api', async () => {
        axios.get.mockResolvedValue({
          data: {
            posts: []
          }
        })

        await mockStore.dispatch('getPosts', {})
        expect(axios.get).toHaveBeenCalledWith('/posts', { params: {} })
      })
      it('should return posts', async () => {
        const mockDetails = {
          username: 'test',
          firstName: 'test'
        }
        axios.get.mockResolvedValue({ data: mockDetails })

        const username = 'test'
        const details = await mockStore.dispatch('getUser', username)

        expect(details).toBe(mockDetails)
      })
    })
  })
})
