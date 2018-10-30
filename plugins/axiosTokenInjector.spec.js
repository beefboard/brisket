import axiosTokenInjector from './axiosTokenInjector'

describe('axiosTokenInjector', () => {
  let mockStore
  let mockAxios

  beforeAll(() => {
    mockStore = {
      state: {
        token: null
      }
    }

    mockAxios = {}
  })

  it('should add hook to onRequest', () => {
    mockAxios.onRequest = jest.fn()
    axiosTokenInjector({ $axios: mockAxios, store: mockStore })
    expect(mockAxios.onRequest).toHaveBeenCalled()

    const requestHook = mockAxios.onRequest.mock.calls[0][0]
    expect(requestHook).toEqual(expect.any(Function))
  })

  test('hook should add token from store to config headers', () => {
    mockStore.state.token = 'testtoken'
    mockAxios.onRequest = jest.fn()
    axiosTokenInjector({ $axios: mockAxios, store: mockStore })

    const requestHook = mockAxios.onRequest.mock.calls[0][0]
    const mockConfig = {
      headers: {}
    }
    requestHook(mockConfig)

    expect(mockConfig.headers['x-access-token']).toBe(mockStore.state.token)
  })

  test('hook should not add token when token is not set', () => {
    mockStore.state.token = null
    mockAxios.onRequest = jest.fn()
    axiosTokenInjector({ $axios: mockAxios, store: mockStore })

    const requestHook = mockAxios.onRequest.mock.calls[0][0]
    const mockConfig = {
      headers: {}
    }
    requestHook(mockConfig)

    expect(mockConfig.headers['x-access-token']).toBe(undefined)
  })
})
