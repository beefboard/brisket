import { shallowMount } from '@vue/test-utils'
import index from './index.vue'

console.log = jest.fn()

describe('posts/index.vue', () => {
  let mockRouter
  let mockStore

  beforeEach(() => {
    mockRouter = {
      push: jest.fn()
    }

    mockStore = {
      state: {
        auth: {
          admin: true
        }
      },
      dispatch: jest.fn()
    }
  })

  function renderLayout() {
    return shallowMount(index, {
      data() {
        return {
          posts: [
            {
              title: 'Ok',
              content: 'This is the final frontier, a new test'
            },
            {
              title: 'Great',
              content: 'This is the final frontier, the last test'
            },
            {
              title: 'Wow',
              content: 'This is the final frontier, a test'
            }
          ],
          // default search is for new posts
          search: 'new'
        }
      },
      mocks: {
        $router: mockRouter,
        $store: mockStore
      }
    })
  }
  it('mounts properly', () => {
    const wrapper = renderLayout()

    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('renders properly', () => {
    const wrapper = renderLayout()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('sets pages title to "Browse - Beefboard"', () => {
    const wrapper = renderLayout()

    const head = wrapper.vm.$options.head()
    expect(head.title).toBe('Browse - Beefboard')
  })

  it('should render posts into page', () => {
    const wrapper = renderLayout()

    expect(wrapper.findAll('.browse-post').length).toBe(3)
  })

  it('should watch the url query', () => {
    const wrapper = renderLayout()

    expect(wrapper.vm.$options.watchQuery).toBeTruthy()
  })

  it('should only show unapproved filter when logged in as admin', () => {
    mockStore.state.auth.admin = true
    const wrapper = renderLayout()

    expect(wrapper.find('#unapproved').exists()).toBe(true)

    mockStore.state.auth.admin = false
    expect(wrapper.find('#unapproved').exists()).toBe(false)
  })

  it('should change url query when radio buttons change', () => {
    const wrapper = renderLayout()

    const pinnedButton = wrapper.find('#pinned')
    pinnedButton.trigger('click')

    expect(mockRouter.push).toHaveBeenCalledWith({
      path: './',
      query: {
        pinned: true
      }
    })

    const unapproved = wrapper.find('#unapproved')
    unapproved.trigger('click')

    expect(mockRouter.push).toHaveBeenCalledWith({
      path: './',
      query: {
        approved: false
      }
    })

    const newButton = wrapper.find('#new')
    newButton.trigger('click')
    expect(mockRouter.push).toHaveBeenCalledWith({
      path: './',
      query: {}
    })
  })

  test('asyncData should load posts with the given query', async () => {
    const wrapper = renderLayout()
    const error = {}
    const route = {
      query: {
        approved: false
      }
    }

    mockStore.dispatch.mockImplementation(() => {
      return []
    })

    await wrapper.vm.$options.asyncData({ error, route, store: mockStore })

    expect(mockStore.dispatch).toHaveBeenCalledWith('getPosts', {
      approved: false
    })
  })

  test('asyncData should order posts by date', async () => {
    const wrapper = renderLayout()
    const error = {}
    const route = {
      query: {
        approved: false
      }
    }
    mockStore.dispatch.mockImplementation(() => {
      return [
        {
          title: '2',
          content: 'This is the final frontier, a new test2',
          date: new Date(2012).toISOString()
        },
        {
          title: '1',
          content: 'This is the final frontier, a new test',
          date: new Date().toISOString()
        }
      ]
    })

    const data = await wrapper.vm.$options.asyncData({
      error,
      route,
      store: mockStore
    })

    expect(data.posts).toHaveLength(2)
    expect(data.posts[0].title).toBe('1')
  })

  test('asyncData should set search property based on query', async () => {
    const wrapper = renderLayout()
    const error = {}
    const route = {
      query: {
        approved: false
      }
    }

    mockStore.dispatch.mockImplementation(() => {
      return []
    })

    let data = await wrapper.vm.$options.asyncData({
      error,
      route,
      store: mockStore
    })

    expect(data.search).toBe('unapproved')

    route.query = {}

    data = await wrapper.vm.$options.asyncData({
      error,
      route,
      store: mockStore
    })
    expect(data.search).toBe('new')

    route.query = {
      pinned: true
    }
    data = await wrapper.vm.$options.asyncData({
      error,
      route,
      store: mockStore
    })
    expect(data.search).toBe('pinned')
  })

  test('asyncData removes pinned attribute from posts if new posts query', async () => {
    const wrapper = renderLayout()
    const error = {}
    const route = {
      query: {}
    }

    mockStore.dispatch.mockImplementation(() => {
      return [
        {
          pinned: true
        }
      ]
    })

    let data = await wrapper.vm.$options.asyncData({
      error,
      route,
      store: mockStore
    })

    expect(data.posts[0].pinned).toBe(false)
  })

  test('asyncData should get pinned posts by filtering results', async () => {
    const wrapper = renderLayout()
    const error = {}
    const route = {
      query: {
        pinned: true
      }
    }
    mockStore.dispatch.mockImplementation(() => {
      return [
        {
          title: '2',
          content: 'This is the final frontier, a new test2',
          date: new Date(2012).toISOString()
        },
        {
          title: '1',
          content: 'This is the final frontier, a new test',
          date: new Date().toISOString(),
          pinned: true
        }
      ]
    })

    const data = await wrapper.vm.$options.asyncData({
      error,
      route,
      store: mockStore
    })

    expect(data.posts).toHaveLength(1)
  })

  test('asyncData should call error when api error occurs', async () => {
    const wrapper = renderLayout()
    const error = jest.fn()
    const route = {
      query: {
        pinned: true
      }
    }
    mockStore.dispatch.mockImplementation(() => {
      throw new Error('HOW??')
    })

    await wrapper.vm.$options.asyncData({
      error,
      route,
      store: mockStore
    })

    expect(error).toHaveBeenCalledWith('Error loading posts')
  })
})
