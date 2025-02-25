// 03-crear-llibre.js
const { BaseTest } = require("./BaseTest.js");
const { By, until } = require("selenium-webdriver");
const assert = require("assert");

// .env
require("dotenv").config();
console.log(process.env);

class CrearLlibreTest extends BaseTest {
  async test() {
    // Tomar el nombre del libro desde la variable de entorno
    const bookName = process.env.LIBRO_NAME;
    if (!bookName) {
      throw new Error("El nombre del libro no está definido en el archivo .env.");
    }

    const site = process.env.URL;
    if (!site || !site.startsWith("http://") && !site.startsWith("https://")) {
      throw new Error("La URL proporcionada no es válida: " + site);
    }

    var driver = this.driver;
    await driver.get(site + "/admin/login/");

    let usernameInput = await driver.wait(
      until.elementLocated(By.id("id_username")),
      30000
    );
    let passwordInput = await driver.wait(
      until.elementLocated(By.id("id_password")),
      30000
    );

    usernameInput.sendKeys(process.env.USUARI);
    passwordInput.sendKeys(process.env.CONTRASENYA);

    let sendButton = await driver.wait(
      until.elementLocated(By.css('input[value="Iniciar sessió"]')),
      30000
    );
    sendButton.click();

    // Esperar a que el Panel de administración sea visible
    let dashboardHeader = await driver.wait(
      until.elementLocated(By.xpath('//h1[contains(text(), "Panel d\'administració")]')),
      30000
    );

    const headerText = await dashboardHeader.getText();
    assert.strictEqual(headerText, "Panel d'administració", "No se ha cargado correctamente el panel de administración.");

    let booksLink = await driver.wait(
      until.elementLocated(By.linkText("Llibres")),
      30000
    );
    booksLink.click();

    let createBookButton = await driver.wait(
      until.elementLocated(By.css('button[class="btn btn-primary"]')),
      30000
    );
    createBookButton.click();

    let bookTitleInput = await driver.wait(
      until.elementLocated(By.id("id_title")),
      30000
    );
    let bookAuthorInput = await driver.wait(
      until.elementLocated(By.id("id_author")),
      30000
    );
    let bookDescriptionInput = await driver.wait(
      until.elementLocated(By.id("id_description")),
      30000
    );

    bookTitleInput.sendKeys(bookName);
    bookAuthorInput.sendKeys("Grace");
    bookDescriptionInput.sendKeys(
      "Este es un libro de prueba creado para el test."
    );

    let saveButton = await driver.wait(
      until.elementLocated(By.css('button[type="submit"]')),
      30000
    );
    saveButton.click();

    // Verificar que el libro se ha creado
    let bookTitle = await driver.wait(
      until.elementLocated(
        By.xpath(`//h3[contains(text(), '${bookName}')]`)
      ),
      30000
    );
    const createdBookTitle = await bookTitle.getText();
    assert.strictEqual(createdBookTitle, bookName, "El libro no se ha creado correctamente.");

    console.log("TEST 03 OK - Libro creado.");

    // Cerrar sesión después de crear el libro
    let logoutButton = await driver.wait(
      until.elementLocated(By.linkText("Sortir")),
      30000
    );
    logoutButton.click();
    console.log("Cerrando sesión.");
  }
}

// Ejecutamos el test
(async function test_example() {
  const test = new CrearLlibreTest();
  await test.run();
  console.log("END");
})();
