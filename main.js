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
browserStartPromise
    .then(function (browserObj) {
        console.log('Browser Opened');
        browser = browserObj;
        let browserTabOpenPromise = browserObj.newPage();
        return browserTabOpenPromise;
    })
    .then(function (newTab) {
        page = newTab;
        console.log('New tab opened');
        let googleHomepagePromise = newTab.goto('https://www.google.com/');
        return googleHomepagePromise
    })
    .then(function () {
        console.log('Google Homepage Opened');
        let searchElementPromise = page.type('input[title= "Search"]', 'hackerrank login');
        return searchElementPromise;
    })
    .then(function () {
        console.log('Search query typed');
        let clickEnterPromise = page.keyboard.press('Enter');
        return clickEnterPromise
    })
    // .then(function(){
    //     console.log('On search result page');
    //     let searchLinkClickPromise = page.waitForSelector('.LC20lb.DKV0Md',{visible:true});
    //     return searchLinkClickPromise;
    // })
    // .then(function(){
    //     console.log('Waiting for selector');
    //     let searchLinkClickPromise = page.click('.LC20lb.DKV0Md');
    //     return searchLinkClickPromise;
    // })
    .then(function () {
        console.log('On result Page');
        let wacPromise = waitAndClick(page, '.LC20lb.DKV0Md');
        return wacPromise;
    })
    .then(function () {
        console.log('Hackerrank login Page');
        let waitUsernameSelectorPromise = page.waitForSelector('#input-1', { visible: true });
        return waitUsernameSelectorPromise;
    })
    .then(function () {
        console.log('Selector loaded');
        let usernameFillPromise = page.type('#input-1', emailPassObj.email, { delay: 100 });
        return usernameFillPromise;
    })
    .then(function () {
        console.log('Username filled');
        let passwordFillPromise = page.type('#input-2', emailPassObj.password, { delay: 50 });
        return passwordFillPromise;
    })
    .then(function () {
        console.log('Password filled');
        let clickLoginPromise = page.click('button.ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled');
        return clickLoginPromise;
    })
    .then(function () {
        console.log('Logged inside hackerrank');
        let algoClickPromise = waitAndClick(page, '.track-item.bold>div');
        return algoClickPromise;
    })
    .then(function () {
        console.log('Clicked algorithm tile');
        let warmupClickPromise = waitAndClick(page, 'input[value="warmup"]');
        return warmupClickPromise;
    })
    .then(function () {
        console.log('warmup checked');
        // $$ function will get all the elements present with that selector in an array
        let quesArrPromise = page.$$('.challenges-list .ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled', { delay: 50 })
        return quesArrPromise;
    })
    .then(function (quesArrPromise) {
        console.log(quesArrPromise.length);
        let quesSolvedPromise = quesSolver(page, quesArrPromise[0], answerObj.answers[0]);
        return quesSolvedPromise;
    })

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