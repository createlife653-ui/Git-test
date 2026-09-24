"""Browser smoke checks; run from the repository root."""
from pathlib import Path
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parent.parent
with sync_playwright() as p:
    browser=p.chromium.launch()
    page=browser.new_page(viewport={'width':1440,'height':1100})
    errors=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.goto((root/'index.html').as_uri())
    assert page.locator('.marker').count()==10
    assert page.locator('#detail h2').inner_text()=='エチオピア高原'
    page.screenshot(path=str(root/'tools/desktop.png'),full_page=True)
    # The densely adjacent mountain points must each hit their own SVG group.
    for id in ['kenya','kilimanjaro']:
        dot=page.locator(f'.marker[data-id="{id}"] .dot').bounding_box()
        page.mouse.click(dot['x']+dot['width']/2,dot['y']+dot['height']/2)
        assert page.locator(f'.marker[data-id="{id}"]').get_attribute('aria-pressed')=='true'
    for region,count in [('americas',4),('africa',3),('asia',2),('pacific',1),('all',10)]:
        page.locator(f'[data-filter="{region}"]').click()
        assert page.locator('.places button:visible').count()==count
    for checkbox,selector in [('beltToggle','#belt'),('terrainToggle','#terrain'),('namesToggle','.site-label')]:
        page.locator('#'+checkbox).uncheck()
        assert page.locator(selector).first.evaluate('(e)=>getComputedStyle(e).display')=='none'
        page.locator('#'+checkbox).check()
    page.locator('.marker[data-id="colombia"]').focus()
    page.keyboard.press('Enter')
    assert page.locator('#detail h2').inner_text()=='コロンビア・アンデス'
    page.set_viewport_size({'width':390,'height':844})
    page.reload()
    assert page.locator('#detail h2').inner_text()=='ハワイの火山地帯'
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.screenshot(path=str(root/'tools/mobile.png'),full_page=True)
    page.locator('[data-filter="africa"]').click()
    assert page.locator('.map-scroll').evaluate('(e)=>e.scrollLeft')>500
    page.locator('.places button[data-id="kenya"]').click()
    assert page.locator('#detail h2').inner_text()=='ケニア山'
    for width in [320,768,1024]:
        page.set_viewport_size({'width':width,'height':900})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    assert not errors,errors
    print('PASS: 10 points, adjacent point hit targets, 5 filters, 3 layers, keyboard, 4 responsive widths; no JS errors.')
    browser.close()
