const puppeteer = require('puppeteer')
const request = require('supertest')

const HOST = process.env.ACCEPTENCE_SERVER || 'http://localhost:3000'

jest.setTimeout(20000)

let browser = null

async function createBrowser() {
  return await puppeteer.launch({
    slowMo: 0,
    headless: true
  })
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
    const page = await browser.newPage()
    await page.goto(`${HOST}`)

    expect(await page.title()).toBe('Home - Beefboard')
  })

  it('allows login, and shows profile after login', async () => {
    browser = await createBrowser()
    const page = await browser.newPage()
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

    const profileLink = await page.$eval(
      'a[href="/profiles/admin"]',
      element => {
        return element.outerHTML
      }
    )

    expect(profileLink).toBeTruthy()
  })
})
