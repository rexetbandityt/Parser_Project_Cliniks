const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const citiesList = ['moskva', 'spb', 'barnaul', 'vladivostok', 'volgograd', 'voronezh', 'doneck-do', 'ekaterinburg', 'izhevsk', 'kazan', 'krasnodar', 'krasnoyarsk', 'nnovgorod', 'novosibirsk', 'omsk', 'perm', 'rostov-na-donu', 'samara', 'saratov', 'tolyatti', 'ulyanovsk', 'ufa', 'chelyabinsk'];
const baseUrl = 'https://prodoctorov.ru/';

if (!fs.existsSync(path.join(__dirname, 'cities'))) {
    console.log('Папка "cities" не существует. Создаем её.');
    fs.mkdirSync(path.join(__dirname, 'cities'), { recursive: true });
}

if (!fs.existsSync(path.join(__dirname, 'cities', 'uslugi'))) {
  console.log('Папка "uslugi" не существует. Создаем её.');
  fs.mkdirSync(path.join(__dirname, 'cities', 'uslugi'), { recursive: true });
}


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const downloadFiles = async () => {
  try {
    for (let i = 0; i < citiesList.length; i++) {
      const city = citiesList[i];
      const url = `${baseUrl}${city}/uslugi/`;

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Cookie': 'csrftoken=zDZjLWyQqLOOYqCjgMNVNniivqINYBwjygVUZPwbdyTXX9jFVNb5jLYvrl8yK7GQ; sessionid=5632gz1q84yg4wvgm3ac25ad9l5x67sd',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'cross-site',
          'Sec-GPC': '1',
          'TE': 'trailers'
        }
      });

      const html = response.data;
      const $ = cheerio.load(html);

      const services = $('.p-doctors-list-page__tab-item-link');
      const servicesNames = [];

      for (let j = 0; j < services.length; j++) {
        const element = services[j];
        const href = $(element).attr('href');
        const serviceName = href.replace(`/${city}/uslugi/`, '').split('/').filter(Boolean).pop();
        if (serviceName !== undefined) {
          servicesNames.push(serviceName);
        }
        // Добавление задержки в полсекунды перед парсингом следующего элемента списка услуг
        await delay(500);
      }

    //   console.log(`Services in ${city}:`, servicesNames);

      for (let k = 0; k < servicesNames.length; k++) {
        const serviceName = servicesNames[k];
        const serviceUrl = `${baseUrl}${city}/uslugi/${serviceName}`;
        const serviceResponse = await axios.get(serviceUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cookie': 'csrftoken=zDZjLWyQqLOOYqCjgMNVNniivqINYBwjygVUZPwbdyTXX9jFVNb5jLYvrl8yK7GQ; sessionid=5632gz1q84yg4wvgm3ac25ad9l5x67sd',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-GPC': '1',
            'TE': 'trailers'
          }
        });

        const serviceHtml = serviceResponse.data;

        if (!fs.existsSync(path.join(__dirname, 'cities', 'uslugi', city))) {
          console.log(`Папка "${city}" не существует. Создаем её.`);
          fs.mkdirSync(path.join(__dirname, 'cities', 'uslugi', city), { recursive: true });
        }

        fs.writeFile(`./cities/uslugi/${city}/${serviceName}.html`, serviceHtml, (error) => {
          if (error) {
            console.log(`Ошибка при сохранении файла для услуги ${serviceName} в городе ${city}:`, error);
          } else {
            console.log(`Файл для услуги ${serviceName} в городе ${city} сохранен`);
          }
        });

        // Добавление задержки в полсекунды перед парсингом следующей страницы услуги
        await delay(500);
      }

      fs.writeFile(`./cities/result_${city}.html`, html, (error) => {
        if (error) {
          console.log(`Ошибка при сохранении файла для города ${city}:`, error);
        } else {
          console.log(`Файл для города ${city} сохранен`);
        }
      });

      // Добавление задержки в полсекунды перед парсингом следующего города
      await delay(5000);
    }
  } catch (error) {
    console.log(error);
  }
};

downloadFiles();
