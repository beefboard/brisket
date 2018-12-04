import flushPromises from 'flush-promises'
import VueTestUtils from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import _id from './_id.vue'

VueTestUtils.config.stubs['fa'] = '<div><slot /></div>'
VueTestUtils.config.stubs['v-dialog'] = '<div><slot /></div>'
VueTestUtils.config.stubs['nuxt-link'] = '<a><slot /></a>'
VueTestUtils.config.stubs['gallery'] = '<div><slot /></div>'

describe('posts/_id.vue', () => {
  let mockPost
  let mockStore
  let mockModal
  let mockRouter

  beforeEach(() => {
    mockPost = {
      id: 'khksgkjgksdfghsdkg',
      title: 'test',
      content: 'test',
      author: 'safsdf',
      approved: true,
      pinned: true
    }
    mockStore = {
      state: {
        auth: {
          admin: false,
          username: 'sfasfdsaf'
        }
      },
      dispatch: jest.fn()
    }

    mockModal = {
      show: jest.fn()
    }

    mockRouter = {
      push: jest.fn()
    }
  })

  function renderLayout() {
    return shallowMount(_id, {
      data() {
        return {
          post: mockPost,
          // Loading is required for the disabled attributes of api buttons
          loading: false
        }
      },
      mocks: {
        $store: mockStore,
        $modal: mockModal,
        $router: mockRouter
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

  it('should load post data from API from id in url', async () => {
    const wrapper = renderLayout()

    mockStore.dispatch.mockImplementation(() => {
      return {
        id: 'sadhasfasdfk',
        title: 'sdfgsfdgsfdg',
        content: 'dsfgsfdg',
        author: 'safsdf',
        approved: true,
        pinned: true
      }
    })

    const params = {
      id: 'sadhasfasdfk'
    }

    const error = {}

    const data = await wrapper.vm.$options.asyncData({
      store: mockStore,
      params,
      error
    })
    expect(mockStore.dispatch).toHaveBeenCalledWith('getPost', 'sadhasfasdfk')

    expect(data.post).toEqual({
      id: 'sadhasfasdfk',
      title: 'sdfgsfdgsfdg',
      content: 'dsfgsfdg',
      author: 'safsdf',
      approved: true,
      pinned: true
    })
  })

  it('should show relevant error, on failure to load data', async () => {
    const wrapper = renderLayout()

    mockStore.dispatch.mockImplementation(() => {
      throw {
        response: {
          status: 404
        }
      }
    })

    const params = {
      id: 'sadhasfasdfk'
    }
    const error = jest.fn()
    await wrapper.vm.$options.asyncData({ store: mockStore, params, error })

    expect(error).toHaveBeenCalledWith({
      statusCode: 404,
      message: 'Post not found'
    })

    mockStore.dispatch.mockImplementation(() => {
      throw new Error('Bad')
    })
    error.mockReset()

    await wrapper.vm.$options.asyncData({ store: mockStore, params, error })
    expect(error).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Unknown error, please try again'
    })
  })

  it('should create a PostDetails component with the post data', () => {
    const wrapper = renderLayout()

    expect(wrapper.find('postdetails-stub').attributes('post')).toBe(
      {}.toString()
    )
  })

  it('should set title to title of post', () => {
    const wrapper = renderLayout()

    wrapper.vm.$options.post = { title: 'A title' }
    const data = wrapper.vm.$options.head()
    expect(data.title).toBe('A title - Beefboard')
  })

  it('should shorten title in of title if too long', () => {
    const wrapper = renderLayout()
    wrapper.vm.$options.post = {
      title: 'A title which is very long, too long infact'
    }
    const data = wrapper.vm.$options.head()
    expect(data.title).toBe('A title which is ver... - Beefboard')
  })

  it('should not show delete button if post is not owned or admin', () => {
    const wrapper = renderLayout()
    expect(wrapper.find('#delete').exists()).toBe(false)
  })

  it('should show delete button if logged in as admin', () => {
    mockStore.state.auth.admin = true
    const wrapper = renderLayout()
    expect(wrapper.find('#delete').exists()).toBe(true)
  })

  it('should show delete button if logged in as author', () => {
    mockStore.state.auth.username = 'sajlksjgsg'
    mockPost.author = 'sajlksjgsg'
    const wrapper = renderLayout()
    expect(wrapper.find('#delete').exists()).toBe(true)
  })

  it('should not show admin buttons when not admin', () => {
    mockStore.state.auth.admin = false
    let wrapper = renderLayout()
    expect(wrapper.find('.admin').exists()).toBe(false)

    mockStore.state.auth.admin = true
    wrapper = renderLayout()
    expect(wrapper.find('.admin').exists()).toBe(true)
  })

  // TEST UTILS FOR ADMIN BUTTONS //

  function testShowAdminButton(id) {
    mockStore.state.auth.admin = true

    const wrapper = renderLayout()
    expect(wrapper.find(id).exists()).toBe(true)
  }

  async function testAdminButtonApiRequest(id, requestKey, requestValue) {
    mockStore.state.auth.admin = true
    const wrapper = renderLayout()
    wrapper.find(id).trigger('click')
    await flushPromises()

    expect(mockStore.dispatch).toHaveBeenCalledWith(requestKey, requestValue)
  }

  async function testAdminApiRemoveButton(id) {
    mockStore.state.auth.admin = true
    mockStore.dispatch.mockImplementation(() => {
      return true
    })

    const wrapper = renderLayout()
    wrapper.find(id).trigger('click')
    await flushPromises()
    expect(wrapper.find(id).exists()).toBe(false)
  }

  function testAdminButtonSpam(id) {
    mockStore.state.auth.admin = true
    const wrapper = renderLayout()
    wrapper.find(id).trigger('click')
    expect(wrapper.find(id).attributes('disabled')).toBeTruthy()
  }

  async function testAdminButtonError(id) {
    mockStore.state.auth.admin = true
    mockStore.dispatch.mockImplementation(() => {
      throw new Error('Wow, how did this happen')
    })

    const wrapper = renderLayout()
    wrapper.find(id).trigger('click')
    await flushPromises()

    // expect the error dialog to be displayed
    expect(mockModal.show).toHaveBeenCalled()

    // expect the button to be renabled after success
    expect(wrapper.find(id).attributes('disabled')).toBeFalsy()
  }

  it('should show approve button when post is not approved', () => {
    mockPost.approved = false
    testShowAdminButton('#approve')
  })

  test('approve button should send approve request to api', async () => {
    mockPost.approved = false
    await testAdminButtonApiRequest('#approve', 'approvePost', mockPost.id)
  })

  test('approve cannot be spammed', () => {
    mockPost.approved = false
    testAdminButtonSpam('#approve')
  })

  test('successful approval should remove approve button', async () => {
    mockPost.approved = false
    await testAdminApiRemoveButton('#approve')
  })

  test('approval failure should show error', async () => {
    mockPost.approved = false
    await testAdminButtonError('#approve')
  })

  it('should show pin button when post is not pinned', () => {
    mockPost.pinned = false
    testShowAdminButton('#pin')
  })

  test('pin button should send pin request to api', async () => {
    mockPost.pinned = false
    await testAdminButtonApiRequest('#pin', 'pinPost', {
      id: mockPost.id,
      pinned: true
    })
  })

  test('pin cannot be spammed', () => {
    mockPost.pinned = false
    testAdminButtonSpam('#pin')
  })

  test('successful pinning should remove pin button', async () => {
    mockPost.pinned = false
    await testAdminApiRemoveButton('#pin')
  })

  test('pin failure should show error', async () => {
    mockPost.pinned = false
    await testAdminButtonError('#pin')
  })

  it('should show unpin button when post is not pinned', () => {
    mockPost.pinned = true
    testShowAdminButton('#unpin')
  })

  test('unpin button should send unpin request to api', async () => {
    mockPost.pinned = true
    await testAdminButtonApiRequest('#unpin', 'pinPost', {
      id: mockPost.id,
      pinned: false
    })
  })

  test('unpin cannot be spammed', () => {
    mockPost.pinned = true
    testAdminButtonSpam('#unpin')
  })

  test('successful unpinning should remove pin button', async () => {
    mockPost.pinned = true
    await testAdminApiRemoveButton('#unpin')
  })

  test('unpin failure should show error', async () => {
    mockStore.pinned = true
    await testAdminButtonError('#unpin')
  })

  test('delete button should open confirmation dialog', async () => {
    mockStore.state.auth.admin = true

    const wrapper = renderLayout()
    wrapper.find('#delete').trigger('click')
    await flushPromises()

    expect(mockModal.show).toHaveBeenCalled()
  })

  test('delete confirmation dialog confirm button should call remove method', async () => {
    mockStore.state.auth.admin = true

    const wrapper = renderLayout()
    wrapper.find('#delete').trigger('click')
    await flushPromises()

    const dialogConfig = mockModal.show.mock.calls[0][1]

    // Find the confirm button
    expect(dialogConfig).toBeTruthy()

    let handler = null
    for (const button of dialogConfig['buttons']) {
      if (button['handler']) {
        handler = button['handler']
        break
      }
    }

    expect(handler).toBe(wrapper.vm.remove)
  })

  test('delete cannot be spammed', async () => {
    mockStore.state.auth.admin = true
    const wrapper = renderLayout()

    // Once remove has been called, the disabled attribute on the button
    // should be set
    wrapper.vm.remove()
    expect(wrapper.find('#delete').attributes('disabled')).toBeTruthy()
  })

  test('successful delete should redirect to home', async () => {
    mockStore.state.auth.admin = true
    const wrapper = renderLayout()

    await wrapper.vm.remove()
    expect(mockRouter.push).toHaveBeenCalledWith('/')
  })

  test('delete failure should show error', async () => {
    mockStore.state.auth.admin = true
    mockStore.dispatch.mockImplementation(() => {
      throw new Error('Couldnt delete anything')
    })

    const wrapper = renderLayout()
    await wrapper.vm.remove()
    expect(mockModal.show).toHaveBeenCalled()

    expect(wrapper.find('#delete').attributes('disabled')).toBeFalsy()
  })
})
