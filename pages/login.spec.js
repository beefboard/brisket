import { shallowMount } from '@vue/test-utils'
import login from './login'
import flushPromises from 'flush-promises'

jest.mock('axios')

describe('login', () => {
  test('mounts properly', () => {
    const wrapper = shallowMount(login)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders properly', () => {
    const wrapper = shallowMount(login)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should contain a login button', () => {
    const wrapper = shallowMount(login)
    expect(wrapper.find('button')).toBeTruthy()
  })

  test('login button should be disabled on load', () => {
    const wrapper = shallowMount(login)
    expect(wrapper.find('button').attributes('disabled')).toBe('disabled')
  })

  test('error message should not be visible on load', () => {
    const wrapper = shallowMount(login)
    expect(wrapper.find('.error').text()).toBe('')
  })

  test('entering username and password enables login button', () => {
    const wrapper = shallowMount(login)
    const usernameInput = wrapper.find('[placeholder="Username"]')
    const passwordInput = wrapper.find('[placeholder="Password"]')
    usernameInput.setValue('test')
    passwordInput.setValue('test')

    expect(wrapper.find('button').attributes('disabled')).toBe(undefined)
  })

  test('submitting form without credentials does nothing', async () => {
    const wrapper = shallowMount(login, {
      mocks: {
        $store: {
          dispatch: jest.fn()
        },
        $router: {
          push: jest.fn()
        }
      }
    })

    wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled()
  })

  test('submitting form logs in with credentials and navigates to /', async () => {
    const wrapper = shallowMount(login, {
      mocks: {
        $store: {
          dispatch: jest.fn()
        },
        $router: {
          push: jest.fn()
        }
      }
    })

    const usernameInput = wrapper.find('[placeholder="Username"]')
    const passwordInput = wrapper.find('[placeholder="Password"]')
    usernameInput.setValue('test')
    passwordInput.setValue('test')

    wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('login', {
      username: 'test',
      password: 'test'
    })
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/')
  })

  it('should display error messages on failed login', async () => {
    const wrapper = shallowMount(login, {
      mocks: {
        $store: {
          dispatch: jest.fn()
        },
        $router: {
          push: jest.fn()
        }
      }
    })

    let mockError = {}
    wrapper.vm.$store.dispatch.mockImplementation(async () => {
      throw mockError
    })

    const usernameInput = wrapper.find('[placeholder="Username"]')
    const passwordInput = wrapper.find('[placeholder="Password"]')

    mockError = {
      response: {
        status: 401
      }
    }
    usernameInput.setValue('test')
    passwordInput.setValue('test')
    wrapper.find('form').trigger('submit')

    await flushPromises()

    expect(wrapper.find('.error').html()).toContain(
      'Invalid username or password'
    )

    mockError = {
      response: {
        status: 500
      }
    }
    usernameInput.setValue('test')
    passwordInput.setValue('test')
    wrapper.find('form').trigger('submit')

    await flushPromises()

    expect(wrapper.find('.error').html()).toContain('Server error')

    mockError = new Error('Something else')
    usernameInput.setValue('test')
    passwordInput.setValue('test')
    wrapper.find('form').trigger('submit')

    await flushPromises()

    expect(wrapper.find('.error').html()).toContain('Unknown error')
  })
})
