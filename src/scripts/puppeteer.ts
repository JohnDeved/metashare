import puppeteer from 'puppeteer'

puppeteer.launch({ headless: true }).then(async browser => {
  const page = await browser.newPage()
  await page.goto('https://metashare.pages.dev/')
  page.on('console', log => console.log(log.text()))
})
