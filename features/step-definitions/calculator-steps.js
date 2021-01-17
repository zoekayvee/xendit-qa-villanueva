const Tesseract = require("tesseract.js");
const { Builder, By, Key, until } = require("selenium-webdriver");
const { Given, When, Then, setDefaultTimeout, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sleep = require("sleep");
const fs = require("fs");

setDefaultTimeout(60 * 1000);
let driver = new Builder().forBrowser("chrome").build();
let imagePath;
let croppedImagePath;

Given("Open chrome browser and start application", async () => {
    await driver.get(
      "https://www.online-calculator.com/full-screen-calculator/"
    );
});

When("I enter following values and press the = button", async (dataTable) => {
  let strValue1=dataTable.raw()[0][1];
  let strValue2=dataTable.raw()[1][1];
  let strOperator=dataTable.raw()[2][1];
  let calcFrame = await driver.findElement({ id: "fullframe" });
  await inputValues(calcFrame, strValue1, strValue2, strOperator);
});

Then("I should be able to see", async (dataTable)=>{
  let expectedValue = dataTable.raw()[0][1]
  sleep.sleep(1) // Implicit wait to ensure screenshot taken is of calculated value
  await takeScreenshot();
  let {data: { text }} = await Tesseract.recognize(croppedImagePath, "eng", {
    logger: (m) => console.log(m),
  });
  let calculatedValue = await text;
  expect(expectedValue).to.equal(calculatedValue.split('\n')[0]);
})

AfterAll(() => {
  return driver.quit();
});

const takeScreenshot = async () => {
  let now = new Date().getTime();
  imagePath = "./reports/" + now + ".png";
  croppedImagePath = "./reports/" + now + "_cropped.png";

  let calcFrame = await driver.findElement(By.id("fullframe"));
  await driver.switchTo().frame(calcFrame);
  let canvas = await driver.findElement(By.id("canvas"));
  let canvasDataURL = await driver.executeScript("return arguments[0].toDataURL()", canvas)
  var tempCanvas = canvasDataURL.replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync(imagePath, tempCanvas, "base64");

  let croppedImage = await driver.executeScript(() => {
    let croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = arguments[0].width-110;
    croppedCanvas.height = 110;
    croppedCanvas.getContext("2d").drawImage(
      arguments[0],
      60, 60, arguments[0].width-110, 110,
      0, 0, croppedCanvas.width, 110);
    return croppedCanvas.toDataURL().replace(/^data:image\/png;base64,/, "");
  }, canvas);
  fs.writeFileSync(croppedImagePath, croppedImage, "base64");  
}

const inputValues = async(calcFrame, strValue1, strValue2, strOperator) => {
  await calcFrame.sendKeys(strValue1);
  await calcFrame.sendKeys(strOperator);
  await calcFrame.sendKeys(strValue2);
  await calcFrame.sendKeys("=");
  return;
}