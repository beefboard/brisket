import VueTestUtils from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import defaultLayout from './default'
import { wrap } from 'module'

VueTestUtils.config.stubs['nuxt-link'] = '<a><slot /></a>'
VueTestUtils.config.stubs['nuxt'] = '<div><slot /></div>'

const mockAuth = {
  username: 'test'
}

function renderLayout() {
  return shallowMount(defaultLayout, {
    computed: {
      auth: {
        get() {
          return mockAuth
        }
      }
    }
  })
}

describe('layout', () => {
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
})
