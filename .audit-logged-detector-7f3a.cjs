const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const outputs = {};
  for (const device of [
    { name: 'desktop', viewport: { width: 1440, height: 1000 }, isMobile: false },
    { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }
  ]) {
    const context = await browser.newContext(device);
    const page = await context.newPage();
    const evidence = { console: [], pageErrors: [], failed: [], pages: {}, actions: {} };
    page.on('console', m => evidence.console.push({ type: m.type(), text: m.text() }));
    page.on('pageerror', e => evidence.pageErrors.push(String(e)));
    page.on('requestfailed', r => evidence.failed.push({ url: r.url(), error: r.failure()?.errorText }));
    await page.goto('file:///' + path.resolve('index.html').replace(/\\/g, '/'), { waitUntil: 'load' });
    await page.locator('#passwordInput').fill('0616');
    await page.locator('#loginBtn').click();
    await page.waitForTimeout(1200);
    evidence.actions.loginVisible = await page.locator('#mainApp').isVisible();
    const musicBefore = await page.locator('#musicSongName').textContent();
    await page.locator('#musicNext').click();
    const musicAfter = await page.locator('#musicSongName').textContent();
    await page.locator('#musicToggle').click();
    await page.waitForTimeout(400);
    evidence.actions.music = {
      before: musicBefore, afterNext: musicAfter,
      status: await page.locator('#musicStatus').textContent(),
      toggleLabel: await page.locator('#musicToggle').getAttribute('aria-label')
    };
    for (const section of ['home','plans','diary','recipe','photos']) {
      const nav = page.locator(`.nav-item[data-page="${section}"]`);
      if (device.name === 'mobile' && !(await nav.isVisible())) {
        const btn = page.locator('#menuToggle, .menu-toggle, .hamburger').first();
        if (await btn.count()) await btn.click().catch(()=>{});
      }
      await nav.evaluate(n => n.click());
      await page.waitForTimeout(250);
      evidence.pages[section] = await page.evaluate((section) => {
        const el = document.querySelector(`#page-${section}`);
        const all = [...el.querySelectorAll('*')].filter(n => {
          const r=n.getBoundingClientRect(), s=getComputedStyle(n);
          return s.display!=='none' && s.visibility!=='hidden' && (r.right>innerWidth+1 || r.left < -1);
        }).slice(0,12).map(n => ({tag:n.tagName,id:n.id,cls:n.className?.toString().slice(0,80),rect:(()=>{const r=n.getBoundingClientRect();return {l:Math.round(r.left),r:Math.round(r.right),w:Math.round(r.width)}})()}));
        const small = [...el.querySelectorAll('button,a,input,select,textarea,[role=button]')].filter(n=>{
          const r=n.getBoundingClientRect(),s=getComputedStyle(n);return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0&&(r.width<44||r.height<44);
        }).slice(0,20).map(n=>({tag:n.tagName,id:n.id,cls:n.className?.toString().slice(0,60),text:(n.innerText||n.getAttribute('aria-label')||'').trim().slice(0,25),w:Math.round(n.getBoundingClientRect().width),h:Math.round(n.getBoundingClientRect().height)}));
        return {visible: !!el && getComputedStyle(el).display!=='none', scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, overflow: all, smallTargets: small};
      }, section);
      await page.screenshot({ path: `.audit-${device.name}-${section}-7f3a.png`, fullPage: true });
    }
    outputs[device.name] = evidence;
    await context.close();
  }
  await browser.close();
  console.log(JSON.stringify(outputs, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
