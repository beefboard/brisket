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
        state: store.state(),
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

      it('should store null if cookie is empty', async () => {
        mockCookiesStore['AUTH_TOKEN'] = undefined

        await store.actions.nuxtServerInit(mockStore, mockContext)
        expect(mockStore.state.token).toBe(null)
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
      it('should request logout from api and clear session', async () => {
        axios.delete.mockResolvedValue({ data: { success: true } })
        await mockStore.dispatch('logout')

        expect(axios.delete).toHaveBeenCalledWith('/me')
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
      it('should get given user details from api', async () => {
        const mockDetails = {
          username: 'test',
          firstName: 'test'
        }
        axios.get.mockResolvedValue({ data: mockDetails })

        const details = await mockStore.dispatch('getUser', 'test')

        expect(details).toBe(mockDetails)
        expect(axios.get).toHaveBeenCalledWith('/accounts/test')

        axios.get.mockReset()
        axios.get.mockResolvedValue({ data: mockDetails })
        await mockStore.dispatch('getUser', 'test1')
        expect(axios.get).toHaveBeenCalledWith('/accounts/test1')
      })
    })

    describe('getPosts', () => {
      it('should request posts from posts api with the provided perams', async () => {
        let mockPosts = [
          {
            title: 'test',
            content: 'test'
          }
        ]
        axios.get.mockResolvedValue({
          data: {
            posts: mockPosts
          }
        })

        const filter = { approved: true }

        const posts = await mockStore.dispatch('getPosts', filter)
        expect(axios.get).toHaveBeenCalledWith('/posts', { params: filter })
        expect(posts).toBe(mockPosts)
      })
    })

    describe('getPost', () => {
      it('should get the post with the given id', async () => {
        const mockPost = {
          title: 'test',
          content: 'test'
        }
        axios.get.mockResolvedValue({
          data: mockPost
        })

        const post = await mockStore.dispatch('getPost', 'test')
        expect(post).toBe(mockPost)
        expect(axios.get).toHaveBeenCalledWith('/posts/test')
      })
    })
  })
})