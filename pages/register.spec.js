import { shallowMount } from '@vue/test-utils'
import register from './register'
import flushPromises from 'flush-promises'

jest.useFakeTimers()

describe('login', () => {
  let mockDispatchResponse
  const mockStore = {
    dispatch: async () => {
      if (mockDispatchResponse) {
        return await mockDispatchResponse()
      }
    }
  }

  beforeEach(() => {
    mockDispatchResponse = async () => {}
  })

  test('mounts properly', () => {
    const wrapper = shallowMount(register)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders properly', () => {
    const wrapper = shallowMount(register)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set page title to "Register - Beefboard"', () => {
    const wrapper = shallowMount(register)

    const head = wrapper.vm.$options.head()
    expect(head.title).toBe('Register - Beefboard')
  })

  it('should only redirect to home if logged in', () => {
    const redirect = jest.fn()
    const mockStore = {
      state: {
        auth: {
          username: 'sgfsdfg'
        }
      }
    }

    const wrapper = shallowMount(register)

    let result = wrapper.vm.$options.validate({ store: mockStore, redirect })
    expect(redirect).toHaveBeenCalledWith('/')
    expect(result).toBe(false)

    mockStore.state.auth = null

    result = wrapper.vm.$options.validate({ store: mockStore, redirect })
    expect(result).toBe(true)
  })

  it('should contain register button', () => {
    const wrapper = shallowMount(register)
    expect(wrapper.find('button')).toBeTruthy()
  })

  it('should contain a registration form', () => {
    const wrapper = shallowMount(register)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('should highlight invalid usernames', () => {
    const wrapper = shallowMount(register, {
      mocks: {
        $store: mockStore
      }
    })
    const form = wrapper.find('form')
    const usernameInput = form.find('[placeholder="Username"]')

    usernameInput.setValue('bad username')
    usernameInput.trigger('keyup', { key: 1 })
    expect(usernameInput.classes()).toContain('bad')

    usernameInput.setValue('goodusername')
    usernameInput.trigger('keyup', { key: 1 })
    expect(usernameInput.classes()).not.toContain('bad')
  })

  it('should not check empty usernames', async () => {
    mockDispatchResponse = async () => {
      return { username: 'takenusername1' }
    }

    const wrapper = shallowMount(register, {
      mocks: {
        $store: mockStore
      }
    })
    const form = wrapper.find('form')
    const usernameInput = form.find('[placeholder="Username"]')
    usernameInput.setValue('')
    // backspace
    usernameInput.trigger('keyup', { keyCode: 20 })

    jest.runAllTimers()

    await flushPromises()
    expect(usernameInput.classes()).not.toContain('bad')
  })

  it('should highlight already existing usernames', async () => {
    mockDispatchResponse = async () => {
      return { username: 'takenusername1' }
    }

    const wrapper = shallowMount(register, {
      mocks: {
        $store: mockStore
      }
    })
    const form = wrapper.find('form')
    const usernameInput = form.find('[placeholder="Username"]')

    usernameInput.setValue('takenusername')
    usernameInput.trigger('keyup', { key: 1 })

    jest.runAllTimers()

    await flushPromises()
    expect(usernameInput.classes()).toContain('bad')

    mockDispatchResponse = async () => {
      throw {
        response: {
          status: 404
        }
      }
    }

    usernameInput.setValue('usernamenottaken')
    usernameInput.trigger('keyup', { key: 1 })

    jest.runAllTimers()
    await flushPromises()
    expect(usernameInput.classes()).not.toContain('bad')
  })

  it('should ignore usernamecheck errors', async () => {
    mockDispatchResponse = async () => {
      throw {
        response: {
          status: 500
        }
      }
    }

    const wrapper = shallowMount(register, {
      mocks: {
        $store: mockStore
      }
    })

    const form = wrapper.find('form')
    const usernameInput = form.find('[placeholder="Username"]')

    usernameInput.setValue('usernametaken')
    usernameInput.trigger('keyup', { key: 1 })

    jest.runAllTimers()
    await flushPromises()
    expect(usernameInput.classes()).not.toContain('bad')
  })

  it('should not perform usercheck if username input has changed', async () => {
    mockDispatchResponse = async () => {
      return { username: 'takenusername1' }
    }

    const wrapper = shallowMount(register, {
      mocks: {
        $store: mockStore
      }
    })
    const form = wrapper.find('form')
    const usernameInput = form.find('[placeholder="Username"]')

    usernameInput.setValue('takenusername')
    usernameInput.trigger('keyup', { key: 1 })
    usernameInput.setValue('takenusernamelel')

    jest.runAllTimers()
    await flushPromises()

    expect(usernameInput.classes()).not.toContain('bad')

    mockDispatchResponse = async () => {
      throw {
        response: {
          status: 404
        }
      }
    }

    wrapper.vm.usernameTaken = true

    usernameInput.setValue('usernamenottaken')
    usernameInput.trigger('keyup', { key: 1 })
    usernameInput.setValue('usernamenottaken2')

    jest.runAllTimers()
    await flushPromises()

    // The username has changed since we started the check, so we still
    // expect the username to be bad
    expect(usernameInput.classes()).toContain('bad')
  })

  it('should ignore usercheck if username input has changed', async () => {
    mockDispatchResponse = async () => {
      return { username: 'takenusername1' }
    }

    const wrapper = shallowMount(register, {
      mocks: {
        $store: mockStore
      }
    })
    const form = wrapper.find('form')
    const usernameInput = form.find('[placeholder="Username"]')

    usernameInput.setValue('takenusername')
    usernameInput.trigger('keyup', { key: 1 })

    jest.runAllTimers()

    usernameInput.setValue('takenusernamelel')
    await flushPromises()

    expect(usernameInput.classes()).not.toContain('bad')

    mockDispatchResponse = async () => {
      throw {
        response: {
          status: 404
        }
      }
    }

    wrapper.vm.usernameTaken = true

    usernameInput.setValue('usernamenottaken')
    usernameInput.trigger('keyup', { key: 1 })

    jest.runAllTimers()
    usernameInput.setValue('takenusernamelel')
    await flushPromises()

    // The username has changed since we started the check, so we still
    // expect the username to be bad
    expect(usernameInput.classes()).toContain('bad')
  })

  it('should highlight invalid emails', async () => {
    const wrapper = shallowMount(register)
    const form = wrapper.find('form')
    const emailInput = form.find('[placeholder="Email"]')

    emailInput.setValue('bad email')
    expect(emailInput.classes()).toContain('bad')

    emailInput.setValue('bademail@someaddress')
    emailInput.trigger('keyup', { key: 1 })
    expect(emailInput.classes()).toContain('bad')

    emailInput.setValue('goodemail@someaddress.com')
    emailInput.trigger('keyup', { key: 1 })
    expect(emailInput.classes()).not.toContain('bad')
  })

  test('repeated password mistype highlighting', () => {
    const wrapper = shallowMount(register)
    const form = wrapper.find('form')

    const passwordInput = form.find('[placeholder="Password"]')
    const retypePasswordInput = form.find('[placeholder="Retype password"]')

    passwordInput.setValue('password')
    retypePasswordInput.setValue('password1')

    expect(passwordInput.classes()).toContain('bad')
    expect(retypePasswordInput.classes()).toContain('bad')

    passwordInput.setValue('password')
    retypePasswordInput.setValue('password')

    expect(passwordInput.classes()).not.toContain('bad')
    expect(retypePasswordInput.classes()).not.toContain('bad')
  })

  test('form submit button should be enable when all information correct', async () => {
    const wrapper = shallowMount(register, {
      mocks: {
        $store: mockStore
      }
    })
    const form = wrapper.find('form')

    const button = form.find('button')
    expect(button.attributes('disabled')).toBe('disabled')

    form.find('[placeholder="Username"]').setValue('username')
    form.find('[placeholder="Username"]').trigger('keyup', { key: 1 })

    jest.runAllTimers()
    await flushPromises()

    form.find('[placeholder="Password"]').setValue('password')
    form.find('[placeholder="Retype password"]').setValue('password')
    form.find('[placeholder="Email"]').setValue('email@email.com')
    form.find('[placeholder="First name"]').setValue('name')
    form.find('[placeholder="Last name"]').setValue('name')

    expect(button.attributes('disabled')).not.toBe('disabled')
  })

  test('form should not allow submission when incomplete', async () => {
    const wrapper = shallowMount(register, {
      mocks: {
        $store: mockStore
      }
    })
    const form = wrapper.find('form')
    form.trigger('submit')

    expect(wrapper.vm.loading).toBe(false)
  })

  test('form submit should disable button, send data to register, login, and navigate to home', async () => {
    const wrapper = shallowMount(register, {
      mocks: {
        $store: {
          dispatch: jest.fn()
        },
        $router: {
          push: jest.fn()
        }
      }
    })
    const form = wrapper.find('form')

    const button = form.find('button')
    form.find('[placeholder="Username"]').setValue('username')
    form.find('[placeholder="Username"]').trigger('keyup', { key: 1 })

    jest.runAllTimers()
    await flushPromises()

    form.find('[placeholder="Password"]').setValue('password')
    form.find('[placeholder="Retype password"]').setValue('password')
    form.find('[placeholder="Email"]').setValue('email@email.com')
    form.find('[placeholder="First name"]').setValue('name1')
    form.find('[placeholder="Last name"]').setValue('name2')

    form.trigger('submit')
    expect(button.attributes('disabled')).toBe('disabled')

    await flushPromises()

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('register', {
      username: 'username',
      password: 'password',
      email: 'email@email.com',
      firstName: 'name1',
      lastName: 'name2'
    })

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('login', {
      username: 'username',
      password: 'password'
    })

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/')
  })

  test('registration submission errors should not navigate, and should display error', async () => {
    let mockError = {
      response: {
        status: 500
      }
    }

    const wrapper = shallowMount(register, {
      mocks: {
        $store: {
          dispatch: async () => {
            throw mockError
          }
        },
        $router: {
          push: jest.fn()
        }
      }
    })

    wrapper.vm.username = 'test'
    wrapper.vm.usernameTaken = false

    wrapper.vm.password = 'test'
    wrapper.vm.password2 = 'test'

    wrapper.vm.email = 'sdafasdf@dfsdf.com'
    wrapper.vm.firstName = 'sasdf'
    wrapper.vm.lastName = 'sadasdf'

    wrapper.find('form').trigger('submit')

    await flushPromises()

    expect(wrapper.vm.$router.push).not.toHaveBeenCalled()
    expect(wrapper.find('.error-message').text()).toBe('Server error')

    mockError = {
      response: {
        status: 422
      }
    }

    wrapper.find('form').trigger('submit')

    await flushPromises()
    expect(wrapper.find('.error-message').text()).toBe('Unknown error')

    mockError = new Error('Random error')
    wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.find('.error-message').text()).toBe('Connection error')
  })
})
