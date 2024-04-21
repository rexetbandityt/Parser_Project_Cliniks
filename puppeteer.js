// const puppeteer = require('puppeteer');

// let list_cityes = [];

// async function main() {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//   });
//   const page = await browser.newPage();
//   await page.setDefaultNavigationTimeout(120000);
//   await page.goto('https://prodoctorov.ru/barnaul/uslugi/');
//   await page.waitForSelector('.b-text-unit');
//   const buttoncityes = await page.$('.b-text-unit');
//   buttoncityes.click();
//   setTimeout(async () => {
//     const cityes = await page.$$('.b-choose-town-popup__towns-item-link');
//     for (const city of cityes) {
//       const name = await page.evaluate(el => el.textContent.trim(), city);
//       const translit = await page.evaluate(el => el.getAttribute('data-translit'), city);
//       list_cityes.push({ name, translit });
//     }
//     setTimeout(async () => {
//       const uslugis = await page.$$('.ui-text_body-2');
//       for (const uslugi of uslugis) {
//         await uslugi.click();
//         await setTimeout(async () => {

//         }, 2500);
//         const name = await page.evaluate(el => el.textContent.trim(), uslugi);
//         const translit = await page.evaluate(el => el.getAttribute('data-translit'), uslugi);
//         list_cityes.push({ name, translit });
//       }

//       await browser.close();
//     }, 2000);
//   }, 3000);
// }

// main();


const puppeteer = require('puppeteer');

let list_clinics = [];

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(120000);
  await page.goto('https://prodoctorov.ru/barnaul/uslugi/');
  await page.waitForSelector('.b-text-unit');
  const buttoncityes = await page.$('.b-text-unit');
  buttoncityes.click();
  setTimeout(async () => {
    const cityes = await page.$$('.b-choose-town-popup__towns-item-link');
    for (const city of cityes) {
      const name = await page.evaluate(el => el.textContent.trim(), city);
      const translit = await page.evaluate(el => el.getAttribute('data-translit'), city);
      list_cityes.push({ name, translit });
    }
    setTimeout(async () => {
      const clinics = await page.$$('.b-profile-card__img-wrap');
      for (const clinic of clinics) {
        const name = await clinic.$eval('img', el => el.getAttribute('alt'));
        list_clinics.push(name);
      }

      console.log(list_clinics); // Выведет массив названий клиник

      await browser.close();
    }, 2000);
  }, 3000);
}

main();
