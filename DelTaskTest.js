const { BaseTest } = require("./BaseTest.js")
const { By, until } = require("selenium-webdriver");
const assert = require('assert');

class DelTaskTest extends BaseTest {
    async test() {
        // 02a - Login amb usuari correcte
        //////////////////////////////////////////////////////
        var site = process.env.URL;
        await this.driver.get(site + "/admin/login/");

        let usernameInput = await this.driver.wait(until.elementLocated(
            By.id('id_username')), 10000);
        let passwordInput = await this.driver.wait(until.elementLocated(
            By.id('id_password')), 10000);

        usernameInput.sendKeys(process.env.USUARI);
        passwordInput.sendKeys(process.env.CONTRASENYA);
        let sendButton = await this.driver.wait(until.elementLocated(
            By.css('input[value="Iniciar sessió"]')), 10000);
        sendButton.click();

        // Comprovem que estem dins
        let logoutButton = await this.driver.wait(until.elementLocated(
            By.xpath('//button[@type="submit"]')), 10000);
        var currentLogoutText = await logoutButton.getText();
        var expectedText = "FINALITZAR SESSIÓ";
        
        assert(currentLogoutText == expectedText,
            "Login fallit. No hem pogut iniciar sessió");

        console.log("TEST OK - Login correcte");

        // 02b - Intentar login amb usuari incorrecte
        //////////////////////////////////////////////////////
        await this.driver.get(site + "/admin/login/");

        usernameInput = await this.driver.wait(until.elementLocated(
            By.id('id_username')), 10000);
        passwordInput = await this.driver.wait(until.elementLocated(
            By.id('id_password')), 10000);

        usernameInput.sendKeys('usuariIncorrecte');
        passwordInput.sendKeys('contrasenyaIncorrecta');
        sendButton = await this.driver.wait(until.elementLocated(
            By.css('input[value="Iniciar sessió"]')), 10000);
        sendButton.click();

        // Comprovem que ha de fallar
        let errorMessage = await this.driver.wait(until.elementLocated(
            By.css('.errorlist')), 10000);
        var currentErrorText = await errorMessage.getText();
        var expectedErrorText = "Les credencials que has introduït no són correctes.";
        
        assert(currentErrorText.includes(expectedErrorText),
            "Login hauria de fallar. Missatge d'error no trobat.");

        console.log("TEST OK - Login incorrecte");

        // 03 - Crear un llibre amb el teu nom
        //////////////////////////////////////////////////////
        await this.driver.get(site + "/admin/login/");
        usernameInput = await this.driver.wait(until.elementLocated(
            By.id('id_username')), 10000);
        passwordInput = await this.driver.wait(until.elementLocated(
            By.id('id_password')), 10000);
        usernameInput.sendKeys(process.env.USUARI);
        passwordInput.sendKeys(process.env.CONTRASENYA);
        sendButton = await this.driver.wait(until.elementLocated(
            By.css('input[value="Iniciar sessió"]')), 10000);
        sendButton.click();

        // Crear llibre amb el teu nom
        await this.driver.get(site + "/admin/libres/add/");  // Ajusta la URL si cal
        let titleInput = await this.driver.wait(until.elementLocated(
            By.id('id_titol')), 10000);
        titleInput.sendKeys('Llibre de ' + process.env.USUARI);
        let saveButton = await this.driver.wait(until.elementLocated(
            By.css('input[value="Desar"]')), 10000);
        saveButton.click();

        // Comprovar que el llibre es va crear correctament
        var successMessage = await this.driver.wait(until.elementLocated(
            By.css('.success')), 10000);
        var currentMessage = await successMessage.getText();
        var expectedMessage = "Llibre creat correctament.";
        assert(currentMessage.includes(expectedMessage),
            "El llibre no es va crear correctament.");

        console.log("TEST OK - Llibre creat");

        // 04 - Esborrar el llibre creat
        //////////////////////////////////////////////////////
        await this.driver.get(site + "/admin/login/");
        usernameInput = await this.driver.wait(until.elementLocated(
            By.id('id_username')), 10000);
        passwordInput = await this.driver.wait(until.elementLocated(
            By.id('id_password')), 10000);
        usernameInput.sendKeys(process.env.USUARI);
        passwordInput.sendKeys(process.env.CONTRASENYA);
        sendButton = await this.driver.wait(until.elementLocated(
            By.css('input[value="Iniciar sessió"]')), 10000);
        sendButton.click();

        // Buscar llibre i esborrar
        await this.driver.get(site + "/admin/libres/");  // Ajusta la URL si cal
        let deleteButton = await this.driver.wait(until.elementLocated(
            By.xpath('//tr[td[contains(text(), "Llibre de ' + process.env.USUARI + '")]]//a[text()="Esborrar"]')), 10000);
        deleteButton.click();

        // Confirmar esborrat
        let confirmButton = await this.driver.wait(until.elementLocated(
            By.xpath('//input[@value="Confirmar"]')), 10000);
        confirmButton.click();

        // Comprovar que el llibre s'ha esborrat correctament
        let bookExists = await this.driver.findElements(By.xpath('//td[contains(text(), "Llibre de ' + process.env.USUARI + '")]'));
        assert.strictEqual(bookExists.length, 0, "El llibre no s'ha esborrat correctament.");

        console.log("TEST OK - Llibre esborrat");
    }
}

module.exports = { DelTaskTest };
