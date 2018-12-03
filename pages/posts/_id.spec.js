import VueTestUtils from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import _id from './_id.vue'

describe('posts/_id.vue', () => {
  function renderLayout() {
    return shallowMount(_id, {})
  }
  it('mounts properly', () => {
    const wrapper = renderLayout()
  })
})
