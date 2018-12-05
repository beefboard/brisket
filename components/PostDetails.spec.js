import VueTestUtils from '@vue/test-utils'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import PostDetails from './PostDetails'
import VueMoment from 'vue-moment'

VueTestUtils.config.stubs['nuxt-link'] = '<a><slot /></a>'
VueTestUtils.config.stubs['nuxt'] = '<div><slot /></div>'
VueTestUtils.config.stubs['fa'] = '<div><slot /></div>'
VueTestUtils.config.stubs['gallery'] = '<div><slot /></div>'
VueTestUtils.config.stubs['flickity'] = '<div><slot /></div>'
VueTestUtils.config.stubs['no-ssr'] = '<div><slot /></div>'

describe('PostDetails', () => {
  let mockAuth
  let mockRefs

  beforeEach(() => {
    mockRefs = {}
  })

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
        numImages: 3,
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
            API_URL: 'https://test.com'
          }
        },
        $router: {
          push: jest.fn(),
          beforeEach: jest.fn()
        },
        $refs: mockRefs
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
      title: 'sdfadsffdgh',
      id: 'asdfasdf',
      content: 'sadfasdfsadf sdsdsdg',
      author: 'slfkgjsdklfg',
      date: new Date(2017, 11, 28).toISOString(),
      approved: false,
      pinned: false,
      votes: { grade: 1 }
    })

    expect(wrapper.find('.title').text()).toBe('sdfadsffdgh')
  })

  it('should render content into page', () => {
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

    expect(wrapper.find('.content').text()).toBe('sadfasdfsadf sdsdsdg')
  })

  it('should render content on new lines', () => {
    const wrapper = renderLayout({
      title: 'test',
      id: 'asdfasdf',
      content: 'sadfasdfsadf\nsdsdsdg',
      author: 'slfkgjsdklfg',
      date: new Date(2017, 11, 28).toISOString(),
      approved: false,
      pinned: false,
      numImages: 2,
      votes: { grade: 1 }
    })

    // Includes the parents, so three
    expect(wrapper.find('.content').findAll('div').length).toBe(3)
  })

  it('should render images into page', () => {
    const wrapper = renderLayout({
      title: 'test',
      id: 'asdfasdf',
      content: 'sadfasdfsadf\nsdsdsdg',
      author: 'slfkgjsdklfg',
      date: new Date(2017, 11, 28).toISOString(),
      approved: false,
      pinned: false,
      numImages: 5,
      votes: { grade: 1 }
    })

    expect(wrapper.findAll('.carousel-cell-image').length).toBe(5)
  })

  test('clicking on an image should set it to fullscreen', () => {
    const wrapper = renderLayout({
      title: 'test',
      id: 'asdfasdf',
      content: 'sadfasdfsadf\nsdsdsdg',
      author: 'slfkgjsdklfg',
      date: new Date(2017, 11, 28).toISOString(),
      approved: false,
      pinned: false,
      numImages: 5,
      votes: { grade: 1 }
    })

    wrapper.find('.carousel-cell-image').trigger('click')
    expect(wrapper.vm.index).not.toBe(null)
  })

  test('clicking close should close the image', () => {
    const wrapper = renderLayout({
      title: 'test',
      id: 'asdfasdf',
      content: 'sadfasdfsadf\nsdsdsdg',
      author: 'slfkgjsdklfg',
      date: new Date(2017, 11, 28).toISOString(),
      approved: false,
      pinned: false,
      numImages: 5,
      votes: { grade: 1 }
    })

    wrapper.vm.index = 0
    wrapper.vm.closeImage()

    expect(wrapper.vm.index).toBe(null)
  })

  test('arrows on image slideshow should be set to false if only 1 image', () => {
    let wrapper = renderLayout({
      title: 'test',
      id: 'asdfasdf',
      content: 'sadfasdfsadf\nsdsdsdg',
      author: 'slfkgjsdklfg',
      date: new Date(2017, 11, 28).toISOString(),
      approved: false,
      pinned: false,
      numImages: 1,
      votes: { grade: 1 }
    })

    expect(wrapper.vm.flickityOptions.prevNextButtons).toBe(false)

    wrapper = renderLayout({
      title: 'test',
      id: 'asdfasdf',
      content: 'sadfasdfsadf\nsdsdsdg',
      author: 'slfkgjsdklfg',
      date: new Date(2017, 11, 28).toISOString(),
      approved: false,
      pinned: false,
      numImages: 2,
      votes: { grade: 1 }
    })

    expect(wrapper.vm.flickityOptions.prevNextButtons).toBe(true)
  })
})
