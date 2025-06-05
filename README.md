# 📸 Screenshot

A simple Node.js script for taking screenshots of websites using Puppeteer (or your screenshot logic).

---

## 📓 Description

This app takes screenshots of websites at specified dimensions for mocking up screenshots in photoshop etc. and automatically outputs .png files for all devices.



## 🚀 Features

- Automatically captures screenshots
- Headless browser automation
- Easy setup and configuration
- Captures full screen with scroll for devices

---

## 📦 Installation

```bash
npm install

```
---

## 📷 Example Usage

run from the command line
- will check for /screenshots folder and create if doesn't exist
- by default creates Mobile, Tablet, Laptop, and Desktop screenshots
- filenames will include device and url

### All Devices
creates screenshots for all devices
```bash
node screenshot.js https://your-site.com
```

### Only Mobile
```bash
node screenshot.js https://your-site.com --device=mobile
```

### Tablet and Desktop only
```bash
node screenshot.js https://your-site.com --device=tablet,desktop
```
---

## 💻 Tweaks
If you want to take a screenshot with a mobile menu open, add the following after await page.goto(url, ...) and before the scrolling/screenshot loop:
```bash
if (deviceName === 'mobile') {
  try {
    await page.waitForSelector('.mobile-menu-toggle', { timeout: 3000 });
    await page.click('.mobile-menu-toggle');
    await delay(1000);
    console.log('✅ Mobile menu opened');
  } catch (e) {
    console.log('ℹ️ Mobile menu toggle button not found or timeout');
  }
}
```
Update the selector name to match your actual menu toggle button!

You can also customize the dimensions of the screenshots to suit your own needs! Use the devices object to modify.
```bash
const devices = {
  mobile: { width: 445, height: 909, dpr: 3 },
  tablet: { width: 1016, height: 1357, dpr: 2 },
  laptop: { width: 1467, height: 990, dpr: 2 },
  desktop: { width: 1605, height: 902, dpr: 2 }
};
```

---

## 🔓 License

[MIT](https://choosealicense.com/licenses/mit/)