import VueTestUtils from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import _id from './_id.vue'

describe('profiles/_id', () => {
  let mockUser
  let mockId

  beforeEach(() => {
    mockUser = {
      username: 'test',
      firstName: 'lel',
      lastName: 'lol'
    }
    mockId = 'asfdasf'
  })

  function renderLayout() {
    return shallowMount(_id, {
      data() {
        return mockUser
      },
      mocks: {
        params: {
          id: mockId
        }
      }
    })
  }
  it('mounts properly', () => {
    const wrapper = renderLayout()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('renders properly', () => {
    const wrapper = renderLayout()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('displays user details in page', () => {
    mockUser = {
      username: 'auser',
      firstName: 'aname',
      lastName: 'alastname'
    }

    const wrapper = renderLayout()
    expect(wrapper.find('.username').text()).toBe('auser')
    expect(wrapper.find('.name').text()).toBe('aname alastname')
  })

  it('Sets the page title to profile name', () => {
    const wrapper = renderLayout()

    // Mock this.username in head()
    wrapper.vm.$options.username = 'aname'

    const headData = wrapper.vm.$options.head()
    expect(headData.title).toBe("aname's profile - Beefboard")
  })

  it('navigates to home if no username in address', () => {
    const redirect = jest.fn()
    const mockParams = {}

    const wrapper = renderLayout()

    wrapper.vm.$options.validate({ redirect, params: mockParams })
    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('does not navigate home if id in address', () => {
    const redirect = jest.fn()
    const mockParams = { id: 'asdasd' }

    const wrapper = renderLayout()

    redirect.mockReset()
    wrapper.vm.$options.validate({ redirect, params: mockParams })
    expect(redirect).not.toHaveBeenCalled()
  })

  test('asyncData uses current auth data if profile is our own', async () => {
    const wrapper = renderLayout()

    const error = jest.fn()
    const params = { id: 'testusername' }
    const mockStore = {
      state: {
        auth: {
          username: 'testusername',
          firstName: 'expectedFirstname'
        }
      },
      dispatch: jest.fn()
    }

    const userDetails = await wrapper.vm.$options.asyncData({
      store: mockStore,
      params,
      error
    })

    expect(userDetails.firstName).toBe('expectedFirstname')
  })

  test('asyncData gets user data from store', async () => {
    const wrapper = renderLayout()

    const error = jest.fn()
    const params = { id: 'testusername' }
    const mockStore = {
      state: {},
      dispatch: jest.fn()
    }

    await wrapper.vm.$options.asyncData({ store: mockStore, params, error })
    expect(mockStore.dispatch).toHaveBeenCalledWith('getUser', 'testusername')
  })

  test('asyncData calls 404 error if no user details found for id', async () => {
    const wrapper = renderLayout()

    const error = jest.fn()
    const params = { id: 'testusername' }
    const mockStore = {
      state: {},
      dispatch: async () => {
        throw {
          response: {
            status: 404
          }
        }
      }
    }

    await wrapper.vm.$options.asyncData({ store: mockStore, params, error })
    expect(error).toHaveBeenCalledWith({
      statusCode: 404,
      message: 'User not found'
    })
  })

  test('asyncData calls 500 error if api fails', async () => {
    const wrapper = renderLayout()

    const error = jest.fn()
    const params = { id: 'testusername' }
    const mockStore = {
      state: {},
      dispatch: async () => {
        throw new Error('any error')
      }
    }

    await wrapper.vm.$options.asyncData({ store: mockStore, params, error })
    expect(error).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Unknown error'
    })
  })
})
