const Tesseract = require("tesseract.js");
const { Builder, By, Key, until } = require("selenium-webdriver");
const { Given, When, Then, setDefaultTimeout, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sleep = require("sleep");
const fs = require("fs");

setDefaultTimeout(60 * 1000);
let driver = new Builder().forBrowser("chrome").build();

Given("Open chrome browser and start application", async () => {
  await driver.get(
    "https://www.online-calculator.com/full-screen-calculator/"
  );
});

When("I enter following values and press the = button", async (dataTable) => {
  const strValue1 = dataTable.raw()[0][1];
  const strValue2 = dataTable.raw()[1][1];
  const strOperator = dataTable.raw()[2][1];
  const calcFrame = await driver.findElement({ id: "fullframe" });
  await calcFrame.sendKeys(strValue1);
  await calcFrame.sendKeys(strOperator);
  await calcFrame.sendKeys(strValue2);
  await calcFrame.sendKeys("=");
});

Then("I should be able to see", async (dataTable)=>{
  const expectedValue = dataTable.raw()[0][1]
  // Ensure screenshot taken is of calculated value as no condition can be relied upon to check DOM
  sleep.sleep(1) 
  const croppedImagePath = await takeScreenshot();
  const {data: { text }} = await Tesseract.recognize(croppedImagePath, "eng");
  // Formats OCR result for comparison
  const actualValue = text.split("\n")[0].replace(/\s/g, "");
  expect(expectedValue).to.equal(actualValue);
})

AfterAll(() => {
  return driver.quit();
});

const takeScreenshot = async () => {
  const now = new Date().getTime();
  const imagePath = "./reports/" + now + ".png";
  const croppedImagePath = "./reports/" + now + "_cropped.png";

  const calcFrame = await driver.findElement(By.id("fullframe"));
  await driver.switchTo().frame(calcFrame);
  const canvas = await driver.findElement(By.id("canvas"));
  const canvasDataURL = await driver.executeScript(() => arguments[0].toDataURL(), canvas)
  const tempCanvas = canvasDataURL.replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync(imagePath, tempCanvas, "base64");

  // Crops image to calculator value result to optimise for OCR
  const croppedImage = await driver.executeScript(() => {
    const croppedCanvas = document.createElement('canvas');
    const originalCanvas = arguments[0];
    // Crop dimensions
    const paddingWidth = 110;
    const paddingTop = 60;
    const paddingLeft = 60
    croppedCanvas.height = 110;
    croppedCanvas.width = originalCanvas.width - paddingWidth;

    croppedCanvas.getContext("2d").drawImage(
      originalCanvas,
      paddingTop, paddingLeft, croppedCanvas.width, croppedCanvas.height,
      0, 0, croppedCanvas.width, croppedCanvas.height
    );
    return croppedCanvas.toDataURL().replace(/^data:image\/png;base64,/, "");
  }, canvas);
  fs.writeFileSync(croppedImagePath, croppedImage, "base64");  
  
  return croppedImagePath;
}
