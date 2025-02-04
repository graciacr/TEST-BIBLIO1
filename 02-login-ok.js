    // carreguem les llibreries
    const { BaseTest } = require("./BaseTest.js")
    const { By, until } = require("selenium-webdriver");
    const assert = require('assert');
     
    //.env
    require('dotenv').config()
    console.log(process.env)
     
    class MyTest extends BaseTest
    {
    	async test() {
            // Login test
            //////////////////////////////////////////////////////
            var site = process.env.URL
            var driver = this.driver
            await driver.get(site+"/admin/login/");
     
            // 1 cercar login box
            let usernameInput = await driver.wait(until.elementLocated(By.id('id_username')), 10000);
            let passwordInput = await driver.wait(until.elementLocated(By.id('id_password')), 10000);
     
            // 2 posar usuari i pass
            usernameInput.sendKeys(process.env.USUARI)
            passwordInput.sendKeys(process.env.CONTRASENYA)
     
            // 3 boto send .click()
            let sendButton = await driver.wait(until.elementLocated(By.css('input[value="Iniciar sessió"]')), 10000);
            sendButton.click()
     
            // 4 comprovem que hem entrat
            let logoutButton = await driver.wait(until.elementLocated(By.xpath('//button[@type="submit"]')), 10000);
            var currentLogoutText = await logoutButton.getText();
            var expectedText = "FINALITZAR SESSIÓ";
            assert( currentLogoutText==expectedText, "Login fallit.\n\tTEXT TROBAT="+currentLogoutText+"\n\tTEXT ESPERAT="+expectedText);
     
            console.log("TEST OK");
    	}
    }
     
    // executem el test
     
    (async function test_example() {
    	const test = new MyTest();
    	await test.run();
    	console.log("END")
    })();

