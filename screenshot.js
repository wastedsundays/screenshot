const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Define all device settings
const devices = {
  mobile: { width: 445, height: 909, dpr: 3 },
  tablet: { width: 1016, height: 1357, dpr: 2 },
  laptop: { width: 1467, height: 990, dpr: 2 },
  desktop: { width: 1605, height: 902, dpr: 2 }
};

// ─────────────────────────────────────────────
// Parse CLI arguments
// ─────────────────────────────────────────────
const args = process.argv.slice(2);
const url = args[0];

if (!url) {
  console.error("❌ Usage: node screenshot.js <URL> [--device=mobile,tablet,...]");
  process.exit(1);
}

// Optional: parse --device flag
let selectedDevices = Object.keys(devices);
const deviceArg = args.find(arg => arg.startsWith('--device='));

if (deviceArg) {
  const list = deviceArg.split('=')[1].split(',').map(s => s.trim().toLowerCase());
  selectedDevices = list.filter(d => devices[d]);

  if (selectedDevices.length === 0) {
    console.error(`❌ No valid devices in --device=... flag. Valid options: ${Object.keys(devices).join(', ')}`);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────
const sanitizeUrlForFilename = (inputUrl) => {
  return inputUrl
    .replace(/^https?:\/\//, '')
    .replace(/[\/:?&=]+/g, '-')
    .replace(/-+$/, '')
    .replace(/[^a-zA-Z0-9\-]/g, '')
    .toLowerCase();
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Output folder
const outputDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const urlSlug = sanitizeUrlForFilename(url);

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
(async () => {
  const browser = await puppeteer.launch({ headless: "new" });

  for (const deviceName of selectedDevices) {
    const settings = devices[deviceName];
    const page = await browser.newPage();

    await page.setViewport({
      width: settings.width,
      height: settings.height,
      deviceScaleFactor: settings.dpr
    });

    console.log(`🌐 Navigating to ${url} for ${deviceName}...`);
    await page.goto(url, { waitUntil: 'networkidle2' });
    await delay(1000); // wait for animations or lazy load

    let scrollPosition = 0;
    let index = 1;
    const screenHeight = settings.height;

    const totalHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`📜 Total scroll height for ${deviceName}: ${totalHeight}px`);

    while (scrollPosition < totalHeight) {
      console.log(`📸 Capturing ${deviceName}, part ${index} at scrollY ${scrollPosition}px`);

      await page.evaluate(y => window.scrollTo(0, y), scrollPosition);
      await delay(800); // wait for page to stabilize

      const filename = path.join(
        outputDir,
        `screenshot-${deviceName}-${index}__${urlSlug}.png`
      );

      await page.screenshot({ path: filename });
      scrollPosition += screenHeight;
      index++;
    }

    await page.close();
  }

  await browser.close();
  console.log("✅ All screenshots saved to /screenshots");
})();
