import { shallowMount } from '@vue/test-utils'
import index from './index'
import axios from '../plugins/axios'
import flushPromises from 'flush-promises'

jest.mock('axios')

describe('index', () => {
  test('mounts properly', () => {
    const wrapper = shallowMount(index)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders properly', () => {
    const wrapper = shallowMount(index)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should have username input', () => {
    const wrapper = shallowMount(index)
    expect(
      wrapper.html().includes('<input type="text" placeholder="Username">')
    ).toBeTruthy()
  })

  it('should accept login', async () => {
    const wrapper = shallowMount(index)
    wrapper.find('button').trigger('click')
    await flushPromises()
  })
})
