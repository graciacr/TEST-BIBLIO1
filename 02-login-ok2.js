const { BaseTest } = require("./BaseTest.js")
const { By, until } = require("selenium-webdriver");
const assert = require('assert');

// .env
require('dotenv').config()
console.log(process.env)

class MyTest extends BaseTest {
    async test() {
        // Login test (incorrect login)
        //////////////////////////////////////////////////////
        const site = process.env.URL;  // Usamos la URL desde el archivo .env
        if (!site || !site.startsWith('http://') && !site.startsWith('https://')) {
            throw new Error("La URL proporcionada no es válida: " + site);
        }

        var driver = this.driver;
        await driver.get(site + "/admin/login/");

        // 1. Buscar login box
        let usernameInput = await driver.wait(until.elementLocated(
            By.id('id_username')), 10000);
        let passwordInput = await driver.wait(until.elementLocated(
            By.id('id_password')), 10000);

        // 2. Rellenar usuario y contraseña incorrectos
        usernameInput.sendKeys("usuari_incorrecte");  // Usuario incorrecto
        passwordInput.sendKeys("contrasenya_incorrecta");  // Contraseña incorrecta

        // 3. Hacer clic en el botón de enviar
        let sendButton = await driver.wait(until.elementLocated(
            By.css('input[value="Iniciar sessió"]')), 10000);
        sendButton.click();

        // 4. Comprobar que no hemos iniciado sesión
        // Esperamos que aparezca un mensaje de error de login fallido
        let errorMessage = await driver.wait(until.elementLocated(
            By.css('.error-message')), 10000); // Se asume que hay un mensaje de error con esta clase
        var errorText = await errorMessage.getText();
        var expectedErrorText = "Usuari o contrasenya incorrectes"; // El texto esperado para un error de login

        // Verificar que el mensaje de error es el correcto
        assert(errorText.includes(expectedErrorText),
            "Login no refusat.\n\tTEXT TROBAT=" + errorText + "\n\tTEXT ESPERAT=" + expectedErrorText);

        console.log("TEST OK");
    }
}

// Ejecutamos el test
(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END");
})();
