import VueTestUtils from '@vue/test-utils'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import PostDetails from './PostDetails'
import VueMoment from 'vue-moment'
import config from '~/nuxt.config'
import flushPromises from 'flush-promises'

VueTestUtils.config.stubs['nuxt-link'] = '<a><slot /></a>'
VueTestUtils.config.stubs['nuxt'] = '<div><slot /></div>'
VueTestUtils.config.stubs['fa'] = '<div><slot /></div>'
VueTestUtils.config.stubs['gallery'] = '<div><slot /></div>'

describe('PostDetails', () => {
  let mockAuth

  function renderLayout(post) {
    const localVue = createLocalVue()
    localVue.use(VueMoment)

    if (!post) {
      post = {
        title: 'test',
        id: 'asdfasdf',
        content: 'sadfasdfsadf sdsdsdg',
        author: 'test',
        date: new Date(2017, 11, 28).toISOString(),
        approved: false,
        pinned: false,
        votes: { grade: 1 }
      }
    }
    return shallowMount(PostDetails, {
      localVue,
      propsData: {
        post: post
      },
      mocks: {
        $store: {
          dispatch: jest.fn(),
          state: {
            auth: mockAuth,
            baseURL: 'https://test.com'
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

  it('should link author to author profile', () => {
    const wrapper = renderLayout({
      title: 'test',
      id: 'asdfasdf',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'slfkgjsdklfg',
      date: new Date(2017, 11, 28).toISOString(),
      approved: false,
      pinned: false,
      votes: { grade: 1 }
    })

    expect(wrapper.find('.author').attributes('to')).toBe(
      '/profiles/slfkgjsdklfg'
    )
  })

  it('should render post date to page', () => {
    const wrapper = renderLayout({
      title: 'test',
      id: 'asdfasdf',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'slfkgjsdklfg',
      date: new Date(2017, 11, 28).toISOString(),
      approved: false,
      pinned: false,
      votes: { grade: 1 }
    })

    expect(wrapper.find('.date').text()).toBe('Thursday, December 28th 2017')
  })

  it('should render title into page', () => {
    const wrapper = renderLayout({
      title: 'test',
      id: 'asdfasdf',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'slfkgjsdklfg',
      date: new Date(2017, 11, 28).toISOString(),
      approved: false,
      pinned: false,
      votes: { grade: 1 }
    })

    expect(wrapper.find('.date').text()).toBe('Thursday, December 28th 2017')
  })

  it('should render title into page', () => {
    const wrapper = renderLayout({
      title: 'test',
      id: 'asdfasdf',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'slfkgjsdklfg',
      date: new Date(2017, 11, 28).toISOString(),
      approved: false,
      pinned: false,
      numImages: 2,
      votes: { grade: 1 }
    })

    expect(wrapper.find('.date').text()).toBe('Thursday, December 28th 2017')
  })
})
