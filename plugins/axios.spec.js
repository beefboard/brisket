import axios from './axios'

describe('plugins/axios', () => {
  let mockStore
  let mockAxios

  beforeEach(() => {
    mockStore = {
      state: {
        token: null
      }
    }

    mockAxios = {
      defaults: {},
      onRequest: jest.fn()
    }
  })

  it('should add hook to onRequest', () => {
    axios({ $axios: mockAxios, store: mockStore })
    expect(mockAxios.onRequest).toHaveBeenCalledWith(expect.any(Function))
  })

  test('hook should add token from store to config headers', () => {
    mockStore.state.token = 'testtoken'
    axios({ $axios: mockAxios, store: mockStore })

    const requestHook = mockAxios.onRequest.mock.calls[0][0]
    const mockConfig = {
      headers: {}
    }
    requestHook(mockConfig)

    expect(mockConfig.headers['x-access-token']).toBe(mockStore.state.token)
  })

  test('hook should not add token when token is not set', () => {
    mockStore.state.token = null
    axios({ $axios: mockAxios, store: mockStore })

    const requestHook = mockAxios.onRequest.mock.calls[0][0]
    const mockConfig = {
      headers: {}
    }
    requestHook(mockConfig)

    expect(mockConfig.headers['x-access-token']).toBe(undefined)
  })

  test('hook should add store state API_URL to baseURL', () => {
    mockStore.state.API_URL = 'https://testing123.com'
    axios({ $axios: mockAxios, store: mockStore })

    const requestHook = mockAxios.onRequest.mock.calls[0][0]
    const mockConfig = {
      headers: {}
    }
    requestHook(mockConfig)

    expect(mockConfig.baseURL).toBe(mockStore.state.API_URL)
  })

  it('should add timeout 3000 to defaults', () => {
    axios({ $axios: mockAxios, store: mockStore })
    expect(mockAxios.defaults.timeout).toBe(3000)
  })
})
