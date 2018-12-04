import VueTestUtils from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import index from './index'

VueTestUtils.config.stubs['nuxt-link'] = '<a><slot /></a>'

console.log = jest.fn()

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
      posts: [{ title: 'Test post', content: 'test', author: 'me' }]
    }
    const wrapper = shallowMount(index, { data })
    const posts = wrapper.find('.posts')
    expect(posts.findAll('post-stub').length).toBe(1)
  })

  it('should render pinned posts', () => {
    mockData = {
      posts: [{ title: 'Test post', content: 'test', author: 'me' }],
      pinnedPosts: [
        { title: 'Test post pinned', content: 'test', author: 'me' }
      ]
    }
    const wrapper = shallowMount(index, { data })
    const posts = wrapper.find('.posts.pinned')
    expect(posts.findAll('post-stub').length).toBe(1)
  })

  test('asyncData should fetch posts from store', async () => {
    const mockStore = {
      dispatch: jest.fn()
    }
    mockStore.dispatch.mockImplementation(() => [])

    const errorFunction = jest.fn()
    const wrapper = shallowMount(index, {
      data
    })

    await wrapper.vm.$options.asyncData({
      store: mockStore,
      error: errorFunction
    })
    expect(mockStore.dispatch).toHaveBeenCalledWith('getPosts')
  })

  test('asyncData should filter pinned posts', async () => {
    const date = new Date(2018, 11, 28).toISOString()
    const mockStore = {
      dispatch: async () => {
        return [
          {
            title: 'Test post pinned',
            content: 'test',
            author: 'me',
            pinned: true,
            date: date
          },
          {
            title: 'Test post',
            content: 'test',
            author: 'me',
            pinned: false,
            date: date
          }
        ]
      }
    }
    const errorFunction = jest.fn()
    const wrapper = shallowMount(index, {
      data
    })

    const data = await wrapper.vm.$options.asyncData({
      store: mockStore,
      error: errorFunction
    })

    expect(data.posts).toEqual([
      {
        title: 'Test post',
        content: 'test',
        author: 'me',
        pinned: false,
        date: date
      }
    ])
    expect(data.pinnedPosts).toEqual([
      {
        title: 'Test post pinned',
        content: 'test',
        author: 'me',
        pinned: true,
        date: date
      }
    ])
  })

  test('asyncData should call error on getPosts error', async () => {
    const mockStore = {
      dispatch: async () => {
        throw new Error('Oops')
      }
    }
    const errorFunction = jest.fn()
    const wrapper = shallowMount(index, {
      data
    })

    await wrapper.vm.$options.asyncData({
      store: mockStore,
      error: errorFunction
    })
    expect(errorFunction).toHaveBeenCalledWith('Error loading posts')
  })

  test('asyncData should limit number of pinned posts to 2', async () => {
    const date = new Date(2018, 11, 28).toISOString()
    const mockStore = {
      dispatch: async () => {
        return [
          {
            title: 'Test post pinned',
            content: 'test',
            author: 'me',
            pinned: true,
            date: date
          },
          {
            title: 'Test post pinned',
            content: 'test',
            author: 'me',
            pinned: true,
            date: date
          },
          {
            title: 'Test post pinned',
            content: 'test',
            author: 'me',
            pinned: true,
            date: date
          },
          {
            title: 'Test post',
            content: 'test',
            author: 'me',
            pinned: false,
            date: date
          }
        ]
      }
    }
    const errorFunction = jest.fn()
    const wrapper = shallowMount(index, {
      data
    })

    const data = await wrapper.vm.$options.asyncData({
      store: mockStore,
      error: errorFunction
    })

    expect(data.pinnedPosts.length).toBe(2)
  })

  it('should set title to "Home - Beefboard"', () => {
    const wrapper = shallowMount(index, { data })

    const headData = wrapper.vm.$options.head()
    expect(headData.title).toBe('Home - Beefboard')
  })
})
