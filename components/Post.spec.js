import VueTestUtils from '@vue/test-utils'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Post from './Post'
import VueMoment from 'vue-moment'
import flushPromises from 'flush-promises'

VueTestUtils.config.stubs['nuxt-link'] = '<a><slot /></a>'
VueTestUtils.config.stubs['nuxt'] = '<div><slot /></div>'
VueTestUtils.config.stubs['fa'] = '<div><slot /></div>'

describe('Post', () => {
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
        date: new Date(2017, 11, 28).toString(),
        approved: false,
        pinned: false,
        votes: { grade: 1 }
      }
    }
    return shallowMount(Post, {
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

  it('should render unapproved if post is not approved', () => {
    const wrapper = renderLayout({
      title: 'test',
      id: 'asdfasdf',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'test',
      date: new Date(2017, 11, 28).toString(),
      approved: false,
      pinned: false,
      votes: { grade: 1 }
    })

    expect(wrapper.find('.info').exists()).toBe(true)
  })

  it('should render pin if post is pinned', () => {
    const wrapper = renderLayout({
      title: 'test',
      id: 'asdfasdf',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'test',
      date: new Date(2017, 11, 28).toString(),
      approved: true,
      pinned: true,
      votes: { grade: 1 }
    })

    expect(
      wrapper
        .find('.top-right')
        .find('.pin')
        .exists()
    ).toBe(true)

    const wrapper2 = renderLayout({
      title: 'test',
      id: 'asdfasdf',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'test',
      date: new Date(2017, 11, 28).toString(),
      approved: true,
      pinned: false,
      votes: { grade: 1 }
    })

    expect(
      wrapper2
        .find('.top-right')
        .find('.pin')
        .exists()
    ).toBe(false)
  })

  it('should render number of votes next to post', () => {
    const wrapper = renderLayout({
      title: 'test',
      id: 'asdfasdf',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'test',
      date: new Date(2017, 11, 28).toString(),
      approved: false,
      pinned: false,
      votes: { grade: 100 }
    })

    expect(wrapper.find('.details-right').html()).toContain(100)
  })

  it("should link to post's page", () => {
    const wrapper = renderLayout({
      title: 'test',
      id: 'postIdlaksdjflasdf',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'test',
      date: new Date(2017, 11, 28).toString(),
      approved: false,
      pinned: false,
      votes: { grade: 100 }
    })

    expect(wrapper.find('a').attributes('to')).toBe('/posts/postIdlaksdjflasdf')
  })

  it('should show current user vote', () => {
    mockAuth = {
      username: 'test'
    }

    const wrapper = renderLayout({
      title: 'test',
      id: 'postIdlaksdjflasdf',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'test',
      date: new Date(2017, 11, 28).toString(),
      approved: false,
      pinned: false,
      votes: { grade: 100, user: -1 }
    })

    expect(
      wrapper
        .find('#vote-button-down')
        .find('.vote-button-active')
        .exists()
    ).toBe(true)

    const wrapper2 = renderLayout({
      title: 'test',
      id: 'postIdlaksdjflasdf',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'test',
      date: new Date(2017, 11, 28).toString(),
      approved: false,
      pinned: false,
      votes: { grade: 100, user: 1 }
    })

    expect(
      wrapper2
        .find('#vote-button-up')
        .find('.vote-button-active')
        .exists()
    ).toBe(true)
  })

  it('should ignore votes when not logged in', async () => {
    const wrapper = renderLayout()

    wrapper.find('#vote-button-down').trigger('click')
    await flushPromises()

    expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled()
  })

  it('should call vote when vote clicked', async () => {
    mockAuth = {
      username: 'test'
    }

    const wrapper = renderLayout({
      title: 'test',
      id: 'lkdjfsdfsd',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'test',
      date: new Date(2017, 11, 28).toString(),
      approved: false,
      pinned: false,
      votes: { grade: 100, user: 0 }
    })

    wrapper.find('#vote-button-down').trigger('click')
    expect(wrapper.vm.voting).toBe(true)

    await flushPromises()

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('votePost', {
      post: 'lkdjfsdfsd',
      vote: -1
    })
    expect(wrapper.vm.voting).toBe(false)

    wrapper.find('#vote-button-up').trigger('click')
    expect(wrapper.vm.voting).toBe(true)

    await flushPromises()

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('votePost', {
      post: 'lkdjfsdfsd',
      vote: 1
    })
  })

  it('should not allow post to be voting while voting is in progress', async () => {
    mockAuth = {
      username: 'test'
    }

    const wrapper = renderLayout({
      title: 'test',
      id: 'lkdjfsdfsd',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'test',
      date: new Date(2017, 11, 28).toString(),
      approved: false,
      pinned: false,
      votes: { grade: 100, user: 0 }
    })

    wrapper.vm.voting = true
    wrapper.find('#vote-button-up').trigger('click')
    await flushPromises()

    expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled()
  })

  it('should handle voting errors', async () => {
    mockAuth = {
      username: 'test'
    }

    const wrapper = renderLayout({
      title: 'test',
      id: 'lkdjfsdfsd',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'test',
      date: new Date(2017, 11, 28).toString(),
      approved: false,
      pinned: false,
      votes: { grade: 100, user: 0 }
    })

    wrapper.vm.$store.dispatch.mockImplementation(() => {
      throw new Error('Some error')
    })

    wrapper.find('#vote-button-up').trigger('click')
    await flushPromises()

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalled()
  })

  it('should toggle the vote the user has made if they click it again', async () => {
    mockAuth = {
      username: 'test'
    }

    const wrapper = renderLayout({
      title: 'test',
      id: 'lkdjfsdfsd',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'test',
      date: new Date(2017, 11, 28).toString(),
      approved: false,
      pinned: false,
      votes: { grade: 100, user: -1 }
    })

    wrapper.find('#vote-button-down').trigger('click')
    expect(wrapper.vm.voting).toBe(true)

    await flushPromises()

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('votePost', {
      post: 'lkdjfsdfsd',
      vote: 0
    })
  })

  it('renders time since post next to post', () => {
    const wrapper = renderLayout({
      title: 'test',
      id: 'lkdjfsdfsd',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'test',
      date: new Date().toString(),
      approved: false,
      pinned: false,
      votes: { grade: 100, user: -1 }
    })

    expect(wrapper.find('.when').text()).toBe('a few seconds ago')
  })

  it('should render post title', () => {
    const wrapper = renderLayout({
      title: 'titletitle',
      id: 'lkdjfsdfsd',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'test',
      date: new Date().toString(),
      approved: false,
      pinned: false,
      votes: { grade: 100, user: -1 }
    })

    expect(wrapper.find('.title').text()).toBe('titletitle')
  })

  it('should render post content', () => {
    const wrapper = renderLayout({
      title: 'titletitle',
      id: 'lkdjfsdfsd',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'test',
      date: new Date().toString(),
      approved: false,
      pinned: false,
      votes: { grade: 100, user: -1 }
    })

    expect(wrapper.find('.content').text()).toBe('sadfasdfsadf sdsdsdg')
  })

  it('should render post author', () => {
    const wrapper = renderLayout({
      title: 'titletitle',
      id: 'lkdjfsdfsd',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'test',
      date: new Date().toString(),
      approved: false,
      pinned: false,
      votes: { grade: 100, user: -1 }
    })

    expect(wrapper.find('.author').text()).toBe('test')
  })
})
