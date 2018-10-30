import VueTestUtils from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import index from './index'

VueTestUtils.config.stubs['nuxt-link'] = '<a><slot /></a>'

describe('index', () => {
  let mockData
  const data = () => {
    return mockData
  }

  beforeAll(() => {
    mockData = {
      posts: []
    }
  })

  test('mounts properly', () => {
    const wrapper = shallowMount(index, { data })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders properly', () => {
    const wrapper = shallowMount(index, { data })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should show posts', () => {
    const wrapper = shallowMount(index, { data })
    expect(wrapper.find('.posts').exists()).toBe(true)
  })

  it('should render posts from api', () => {
    mockData = {
      posts: [{ title: 'Test post', content: 'test', author: 'cunt' }]
    }
    const wrapper = shallowMount(index, { data })
    const posts = wrapper.find('.posts')
    expect(posts.findAll('.post').length).toBe(1)
  })

  it('should render data into post', () => {
    mockData = {
      posts: [{ title: 'Test post', content: 'test', author: 'cunt' }]
    }
    const wrapper = shallowMount(index, { data })
    const post = wrapper.find('.post')
    expect(post.html()).toBeTruthy()
  })
})
