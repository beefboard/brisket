import { shallowMount } from '@vue/test-utils'
import login from './login'
import flushPromises from 'flush-promises'
//import NuxtLink from '../.nuxt/components/nuxt-link'

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

  it('should contain login button', () => {
    const wrapper = shallowMount(login)
    expect(wrapper.find('button')).toBeTruthy()
  })
})
