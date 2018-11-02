import { shallowMount } from '@vue/test-utils'
import register from './register'
import flushPromises from 'flush-promises'

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

  it('should contain login button', () => {
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

    // Wait a second for the check to be triggered
    await new Promise(resolve => {
      setTimeout(resolve, 100)
    })
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

    // Wait a second for the check to be triggered
    await new Promise(resolve => {
      setTimeout(resolve, 100)
    })
    await flushPromises()

    expect(usernameInput.classes()).not.toContain('bad')
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

    // Wait a second for the check to be triggered
    await new Promise(resolve => {
      setTimeout(resolve, 100)
    })
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

  test('form submit should send data to register, login, and navigate to home', async () => {
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

    // Wait a second for the check to be triggered
    await new Promise(resolve => {
      setTimeout(resolve, 100)
    })
    await flushPromises()

    form.find('[placeholder="Password"]').setValue('password')
    form.find('[placeholder="Retype password"]').setValue('password')
    form.find('[placeholder="Email"]').setValue('email@email.com')
    form.find('[placeholder="First name"]').setValue('name')
    form.find('[placeholder="Last name"]').setValue('name')

    form.trigger('submit')

    const a = 1

    if (5 === a) {
    }
  })
})
