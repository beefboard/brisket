const puppeteer = require('puppeteer')
const request = require('supertest')
const { toMatchImageSnapshot } = require('jest-image-snapshot')

expect.extend({ toMatchImageSnapshot })

const HOST = process.env.ACCEPTENCE_SERVER || 'http://localhost:3000'

jest.setTimeout(60000)

let browser = null

async function createBrowser(size) {
  return await puppeteer.launch({
    slowMo: 0,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      '--disable-dev-shm-usage'
    ]
  })
}

async function createPage(images = false) {
  const page = await browser.newPage()
  if (!images) {
    await page.setRequestInterception(true)
    page.on('request', request => {
      if (request.resourceType() === 'image') request.abort()
      else request.continue()
    })
  }

  return page
}

beforeAll(async () => {
  // Wait for server to be up
  while (true) {
    try {
      const response = await request(HOST).get('/')

      if (response.status === 200) {
        break
      }
    } catch (e) {
      console.log(e)
    }

    await new Promise(resolve => {
      return setTimeout(resolve, 200)
    })
  }
})

afterEach(async () => {
  if (browser) {
    await browser.close()
  }
})

describe('acceptence', () => {
  it('responds', async () => {
    browser = await createBrowser()
    const page = await createPage()
    await page.goto(`${HOST}`)

    expect(await page.title()).toBe('Home - Beefboard')
  })

  it('renders login layout properly', async () => {
    browser = await createBrowser()
    const page = await createPage(true)
    await page.goto(`${HOST}/login`)

    const screen = await page.screenshot()
    expect(screen).toMatchImageSnapshot({
      failureThreshold: '0.03',
      failureThresholdType: 'percent'
    })
  })

  it('renders registration layout properly', async () => {
    browser = await createBrowser()
    const page = await createPage(true)
    await page.goto(`${HOST}/register`)

    const screen = await page.screenshot()
    expect(screen).toMatchImageSnapshot({
      failureThreshold: '0.03',
      failureThresholdType: 'percent'
    })
  })

  it('renders not found page properly', async () => {
    browser = await createBrowser()
    const page = await createPage(true)
    await page.goto(`${HOST}/lksadfjhsfgdhfs`)

    const screen = await page.screenshot()
    expect(screen).toMatchImageSnapshot({
      failureThreshold: '0.03',
      failureThresholdType: 'percent'
    })
  })

  it('renders mobile view properly', async () => {
    browser = await createBrowser()
    const page = await createPage(true)

    // iPhone 7 size
    await page.setViewport({ height: 667, width: 357 })

    await page.goto(`${HOST}/login`)
    await page.click('.menu-button')

    await page.waitFor(1000)

    const screen = await page.screenshot()
    expect(screen).toMatchImageSnapshot({
      failureThreshold: '0.03',
      failureThresholdType: 'percent'
    })
  })

  it('allows login, shows profile after login, logout navigates back to home', async () => {
    browser = await createBrowser()
    const page = await createPage()
    await page.goto(`${HOST}/login`)

    await page.click('input[type=text]')
    await page.keyboard.type('admin')

    await page.click('input[type=password]')
    await page.keyboard.type('admin')

    await Promise.all([
      page.click('button[type=submit]'),
      page.waitForNavigation({
        waitUntil: 'networkidle0'
      })
    ])

    expect(await page.title()).toBe('Home - Beefboard')

    await page.evaluate(() => {
      document.querySelector('a[href="/profiles/admin"]').click()
    })
    await page.waitFor(1000)

    expect(await page.title()).toBe("admin's profile - Beefboard")

    await page.evaluate(() => {
      document.querySelector('a.logout').click()
    })
    await page.waitFor(1000)

    expect(await page.title()).toBe('Home - Beefboard')

    const profileLink = await page.$('a[href="/profiles/admin"]')
    expect(profileLink).toBeNull()

    const logoutButton = await page.$('a.logout')
    expect(logoutButton).toBeNull()
  })

  test('new post redirects to login when not logged in', async () => {
    browser = await createBrowser()
    const page = await createPage()
    await page.goto(`${HOST}/posts/new`)

    expect(await page.url()).toBe(`${HOST}/login`)
  })
})
