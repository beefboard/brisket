import { shallowMount } from '@vue/test-utils'
import register from './register'
import flushPromises from 'flush-promises'
//import NuxtLink from '../.nuxt/components/nuxt-link'

jest.mock('axios')

describe('login', () => {
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
})
