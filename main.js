let puppeteer = require('puppeteer');
let emailPassObj = require('./credentials');
let answerObj = require('./answers');

let browserStartPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    slowMo: 75,
    args: ['--start-maximized', '--disable-notifications']
});

let page, browser;
(async function() {
    try {
        browser = await browserStartPromise;
        // Browser Opened

        page = await browser.newPage();
        // New tab/Page opened
        await page.goto('https://www.hackerrank.com/auth/login');
        // Hackerrank login Page

        
        await page.waitForSelector('#input-1', { visible: true });
        // Selector loaded
        await page.type('#input-1', emailPassObj.email, { delay: 100 });
        // Username filled
        await page.type('#input-2', emailPassObj.password, { delay: 50 });
        // Password filled
        await page.click('button.ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled');
        // Logged inside hackerrank


        await waitAndClick(page, '.track-item.bold>div');
        // Clicked algorithm tile
        await waitAndClick(page, 'input[value="warmup"]');
        // warmup checked
        
        // $$ function will get all the elements present with that selector in an array
        let quesArr = await page.$$('.challenges-list .ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled', { delay: 50 });
        await quesSolver(page, quesArr[0], answerObj.answers[0]);
    } catch (error) {
        console.log(error);
    }
})();

function waitAndClick(page, selector) {
    return new Promise(function (resolve, reject) {
        let waitForSelectorPromise = page.waitForSelector(selector, { visible: true });

        waitForSelectorPromise.then(function () {
            let clickPromise = page.click(selector, { delay: 10 });
            return clickPromise;
        })
            .then(function () {
                resolve();
            })
            .catch(function (error) {
                reject(error);
            })
    })
}
function quesSolver(page, question, answer) {
    return new Promise(function (resolve, reject) {
        let clickOnQues = question.click();

        // code read
        // hackerrank editor -> ctrl a + ctrl x
        // code type
        clickOnQues.then(function () {
            // focus -> so that when we write, it will be in the editor insted of nav-bar
            let waitForEditorToBeFocused = waitAndClick(page, '.hr-monaco-editor-with-statusbar');
            return waitForEditorToBeFocused;
        })
            .then(function () {
                return waitAndClick(page, '.checkbox-input');
            })
            .then(function () {
                return page.waitForSelector('textarea.custominput', { visible: true });
            })
            .then(function () {
                return page.type("textarea.custominput", answer, { delay: 5 });
            })
            // .then(function () {
            //     // typing out answers
            //     return page.keyboard.type(answer, { delay: 15 });
            // })
            .then(function () {
                let ctrlIsPressedP = page.keyboard.down("Control");
                return ctrlIsPressedP;
            }).then(function () {
                let AIsPressedP = page.keyboard.press("A", { delay: 100 });
                return AIsPressedP;
            }).then(function () {
                return page.keyboard.press("X", { delay: 100 });
            }).then(function () {
                let ctrlIsPressedP = page.keyboard.up("Control");
                return ctrlIsPressedP;
            })


            .then(function () {
                // focus -> so that when we write, it will be in the editor insted of nav-bar
                let waitForEditorToBeFocused = waitAndClick(page, '.hr-monaco-editor-with-statusbar');
                return waitForEditorToBeFocused;
            })
            .then(function () {
                // down function will ensure that control is in pressed position until up function is called
                let ctrlPressedPromise = page.keyboard.down('Control');
                return ctrlPressedPromise;
            })
            .then(function () {
                // pressing a -> press function is a combination of down and up function simultaneously
                let aPressedPromise = page.keyboard.press('A', { delay: 50 });
                return aPressedPromise;
            })
            .then(function () {
                // pressing v
                return page.keyboard.press('V', { delay: 50 });
            })
            .then(function () {
                // calling up function so that it will unpress ctrl button
                return page.keyboard.up('Control');
            })
            .then(function () {
                return waitAndClick(page, '.ui-btn.ui-btn-normal.ui-btn-secondary.pull-right.msR.hr-monaco-compile.hr-monaco__run-code.ui-btn-styled');
            })


            .then(function () {
                resolve();
            })
            .catch(function (error) {
                reject(error);
            })
    })
}