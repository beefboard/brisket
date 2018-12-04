import VueTestUtils from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import newPostPage from './new.vue'

VueTestUtils.config.stubs['gallery'] = '<div></div>'
VueTestUtils.config.stubs['textarea-autosize'] = '<input>'
VueTestUtils.config.stubs['v-modal'] = '<div></div>'

describe('posts/new.vue', () => {
  let mockStore
  let mockRouter
  let mockModal

  function renderLayout() {
    mockStore = {
      dispatch: jest.fn()
    }
    mockRouter = {
      push: jest.fn()
    }

    mockModal = {
      show: jest.fn()
    }

    return shallowMount(newPostPage, {
      mocks: {
        store: mockStore,
        $router: mockRouter,
        $modal: mockModal
      }
    })
  }

  beforeEach(() => {
    global.URL = { createObjectURL: jest.fn() }
  })

  it('mounts properly', () => {
    const wrapper = renderLayout()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('renders properly', () => {
    const wrapper = renderLayout()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set title to "New post - Beefboard"', () => {
    const wrapper = renderLayout()

    const head = wrapper.vm.$options.head()
    expect(head.title).toBe('New post - Beefboard')
  })

  it('should call api with new post data and disable submit button while loading when submit pressed', async () => {
    const wrapper = renderLayout()

    wrapper.find('.title').setValue('A title')

    // We can't test this :(
    wrapper.vm.content = 'Some huge content'

    wrapper.find('.submit-button').trigger('click')

    expect(wrapper.find('.submit-button').attributes('disabled')).toBeTruthy()

    await flushPromises()

    expect(mockStore.dispatch).toHaveBeenCalledWith('newPost', {
      title: 'A title',
      content: 'Some huge content',
      images: []
    })

    expect(wrapper.find('.submit-button').attributes('disabled')).toBeFalsy()
  })

  it('should navigate to posts page after submission', async () => {
    const wrapper = renderLayout()

    wrapper.find('.title').setValue('A title')
    wrapper.vm.content = 'Some huge content'

    mockStore.dispatch.mockImplementation(() => {
      return 'skgfjsjgsfghfdh'
    })

    wrapper.find('.submit-button').trigger('click')

    await flushPromises()
    expect(mockRouter.push).toHaveBeenCalledWith('/posts/skgfjsjgsfghfdh')
  })

  it('should show failure modal on error', async () => {
    const wrapper = renderLayout()

    wrapper.find('.title').setValue('A title')
    wrapper.vm.content = 'Some huge content'

    mockStore.dispatch.mockImplementation(() => {
      throw new Error('An error')
    })

    wrapper.find('.submit-button').trigger('click')

    await flushPromises()

    expect(mockModal.show).toHaveBeenCalled()
  })

  it('should disable submit button when title and content not filled', async () => {
    const wrapper = renderLayout()
    expect(wrapper.find('.submit-button').attributes('disabled')).toBeTruthy()

    wrapper.find('.title').setValue('A title')
    wrapper.vm.content = 'Some content'

    expect(wrapper.find('.submit-button').attributes('disabled')).toBeFalsy()
  })

  test('Attach button should open attach photos', async () => {
    const wrapper = renderLayout()
    wrapper.vm.$refs.files.click = jest.fn()

    wrapper.find('.upload-button').trigger('click')
    await flushPromises()

    expect(wrapper.vm.$refs.files.click).toHaveBeenCalled()
  })
  it('should display images which are attached', async () => {
    const wrapper = renderLayout()

    wrapper.vm.$refs.files = {
      files: ['file', 'file2']
    }

    URL.createObjectURL.mockImplementation(file => `${file}-data`)

    wrapper.find('.files').trigger('change')
    await flushPromises()

    const domImages = wrapper.findAll('.image')
    expect(domImages.length).toBe(2)

    expect(domImages.at(0).attributes('style')).toBe(
      'background-image: url(file-data);'
    )
    expect(domImages.at(1).attributes('style')).toBe(
      'background-image: url(file2-data);'
    )
  })
})
