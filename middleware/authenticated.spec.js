import authenticated from './authenticated'

describe('authenticated', () => {
  it('should redirect to home if no auth in store', () => {
    const store = {
      state: {
        auth: null
      }
    }

    const redirectMock = jest.fn()

    authenticated({ store, redirect: redirectMock })
    expect(redirectMock).toHaveBeenCalled()
  })

  it('should do nothing if auth in store', () => {
    const store = {
      state: {
        auth: {
          username: 'test'
        }
      }
    }

    const redirectMock = jest.fn()

    authenticated({ store, redirect: redirectMock })
    expect(redirectMock).not.toHaveBeenCalled()
  })
})
