const { Builder, By, until } = require('selenium-webdriver');
require('dotenv').config();

const libro = process.env.LLIBRE_NOM;

(async function borrarLlibre() {
  const driver = await new Builder().forBrowser('firefox').build();

  try {
    // Iniciar sesión
    await driver.get('https://emieza.ieti.site/'); // Reemplaza con tu URL
    await driver.findElement(By.name('usuari')).sendKeys(process.env.USUARI);
    await driver.findElement(By.name('contrasenya')).sendKeys(process.env.CONTRASENYA);
    await driver.findElement(By.xpath('//button[text()="Login"]')).click();

    // Esperar a que cargue la página principal
    await driver.wait(until.elementLocated(By.xpath("//h1[contains(text(), 'Panel d'administració')]")), 10000);

    // Navegar a la sección de "Llibres"
    await driver.findElement(By.linkText('Llibres')).click();
    
    // Esperar que se cargue la lista de libros
    await driver.wait(until.elementLocated(By.xpath('//table[@id="llibres"]/tbody')), 10000);

    // Buscar el libro por nombre
    const libroElement = await driver.findElement(By.xpath(`//td[text()="${libro}"]`));
    await driver.wait(until.elementIsVisible(libroElement), 10000);

    // Hacer clic en el botón de eliminar
    const eliminarButton = await libroElement.findElement(By.xpath('following-sibling::td//button[text()="Eliminar"]'));
    await eliminarButton.click();

    // Confirmar eliminación
    await driver.findElement(By.xpath('//button[text()="Confirmar"]')).click();

    console.log('Libro eliminado exitosamente');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await driver.quit();
  }
})();
