import VueTestUtils from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import defaultLayout from './default'
import flushPromises from 'flush-promises'

VueTestUtils.config.stubs['nuxt-link'] = '<a><slot /></a>'
VueTestUtils.config.stubs['nuxt'] = '<div><slot /></div>'

describe('layout', () => {
  let mockAuth

  function renderLayout() {
    return shallowMount(defaultLayout, {
      mocks: {
        $store: {
          dispatch: jest.fn(),
          state: {
            auth: mockAuth
          }
        },
        $router: {
          push: jest.fn()
        }
      }
    })
  }

  beforeEach(() => {
    mockAuth = null
  })
  test('mounts properly', () => {
    const wrapper = renderLayout()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders properly', () => {
    const wrapper = renderLayout()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should have a top bar', () => {
    const wrapper = renderLayout()
    const topbar = wrapper.find('.top-bar')

    expect(topbar.is('.top-bar')).toBe(true)
  })

  it('should only show link to login when not logged in', () => {
    let wrapper = renderLayout()
    let links = wrapper.find('.links')
    expect(links.find('[to="/login"]').exists()).toBe(true)

    mockAuth = {
      username: 'test'
    }
    wrapper = renderLayout()
    links = wrapper.find('.links')
    expect(links.find('[to="/login"]').exists()).toBe(false)
  })

  it('should only show link to register when not logged in', () => {
    let wrapper = renderLayout()
    let links = wrapper.find('.links')
    expect(links.find('[to="/register"]').exists()).toBe(true)

    mockAuth = {
      username: 'test'
    }
    wrapper = renderLayout()
    links = wrapper.find('.links')
    expect(links.find('[to="/register"]').exists()).toBe(false)
  })

  it('should only show link to logout when logged in', () => {
    let wrapper = renderLayout()
    let links = wrapper.find('.links')
    expect(links.find('[class="logout"]').exists()).toBe(false)

    mockAuth = {
      username: 'test'
    }

    wrapper = renderLayout()
    links = wrapper.find('.links')
    expect(links.find('[class="logout"]').exists()).toBe(true)
  })

  it('should only show link to profile when logged in', () => {
    let wrapper = renderLayout()
    let links = wrapper.find('.links')
    expect(links.find('[to="/profiles/test"]').exists()).toBe(false)

    mockAuth = {
      username: 'test'
    }

    wrapper = renderLayout()
    links = wrapper.find('.links')
    expect(links.find('[to="/profiles/test"]').exists()).toBe(true)
  })

  test('profile should link to profile for the username', () => {
    mockAuth = {
      username: 'test'
    }

    let wrapper = renderLayout()
    let links = wrapper.find('.links')
    expect(links.find('[to="/profiles/test"]').exists()).toBe(true)

    mockAuth = {
      username: 'test1'
    }

    wrapper = renderLayout()
    links = wrapper.find('.links')
    expect(links.find('[to="/profiles/test1"]').exists()).toBe(true)
  })

  test('logout link calls store logout', async () => {
    mockAuth = {
      username: 'test'
    }

    const wrapper = renderLayout()
    const links = wrapper.find('.links')
    const button = links.find('[class="logout"]')

    button.trigger('click')
    await flushPromises()

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('logout')
  })

  test('logout link routes to / after logout', async () => {
    mockAuth = {
      username: 'test'
    }

    const wrapper = renderLayout()
    const links = wrapper.find('.links')
    const button = links.find('[class="logout"]')

    button.trigger('click')
    await flushPromises()

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/')
  })
})
