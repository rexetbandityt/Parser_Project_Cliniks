const axios = require('axios');
const cheerio = require('cheerio');

axios.get("https://prodoctorov.ru/barnaul/").then(response => {
    const $ = cheerio.load(response.data);
    let text = '';
    $('.b-choose-town-popup__towns-item-link').each((i, element) => {
        text += $(element).text() + '\n';
    });
    console.log(text);
}).catch(error => {
    console.error(error);
});
