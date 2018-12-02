const puppeteer = require('puppeteer')
const request = require('supertest')

const HOST = process.env.ACCEPTENCE_SERVER || 'http://localhost:3000'

jest.setTimeout(60000)

let browser = null

async function createBrowser() {
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

async function createPage() {
  const page = await browser.newPage()
  await page.setRequestInterception(true)
  page.on('request', request => {
    if (request.resourceType() === 'image') request.abort()
    else request.continue()
  })

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
