import VueTestUtils from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import Post from './Post'
import flushPromises from 'flush-promises'

VueTestUtils.config.stubs['nuxt-link'] = '<a><slot /></a>'
VueTestUtils.config.stubs['nuxt'] = '<div><slot /></div>'
VueTestUtils.config.stubs['fa'] = '<div><slot /></div>'

describe('Post', () => {
  let mockAuth

  function renderLayout(post) {
    if (!post) {
      post = {
        title: 'test',
        id: 'asdfasdf',
        content: 'sadfasdfsadf sdsdsdg',
        author: 'test',
        date: new Date(2017, 11, 28).toString(),
        approved: false,
        pinned: false,
        votes: { grade: 1 }
      }
    }
    return shallowMount(Post, {
      propsData: {
        post: post
      },
      mocks: {
        $store: {
          dispatch: jest.fn(),
          state: {
            auth: mockAuth
          }
        },
        $router: {
          push: jest.fn(),
          beforeEach: jest.fn()
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
})
