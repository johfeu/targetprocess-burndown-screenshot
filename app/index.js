const puppeteer = require('puppeteer');

//https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
const user = process.env.TP_USER;
const pass = process.env.TP_PASSWORD;
const url = process.env.TP_URL;
console.log(`USER is ${user}`);
console.log(`PW is ;-)`);
console.log(`URL is ${url}`);


const auth = Buffer.from(`${user}:${pass}`).toString('base64');

(async () => {

    // --no-sandbox required in docker
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    const page = await browser.newPage();
    page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
    await page.setExtraHTTPHeaders({'Authorization': `Basic ${auth}`});

    console.log(`wait until page is loaded (only 2 open requests allowed)`);
    await page.goto(url, {waitUntil: 'networkidle2'});

    console.log(`wait until burndown is rendered`);
    await page.waitForSelector( '.report-caption__wrap > svg:nth-child(1)', { visible : true } );

    let element =  await page.$('.report-caption__wrap > svg:nth-child(1)');
    await element.screenshot({path: 'burndown.png'});
    console.log(`saved screenshot burndown.png`);

    await browser.close();
})();


