import VueTestUtils from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import _id from './_id.vue'

describe('profiles/_id', () => {
  let mockUser
  let mockId

  function renderLayout() {
    mockUser = {
      username: 'test',
      firstName: 'lel',
      lastName: 'lol'
    }
    mockId = 'asfdasf'

    return shallowMount(_id, {
      data: mockUser,
      mocks: {
        params: {
          id: mockId
        }
      }
    })
  }
  it('renders properly', () => {
    const wrapper = renderLayout()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('renders properly', () => {
    const wrapper = renderLayout()
    expect(wrapper.html()).toMatchSnapshot()
  })
})
