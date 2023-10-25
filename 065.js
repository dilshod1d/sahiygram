const puppeteer = require("puppeteer");
const fs = require("fs/promises");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();

  //global variables

  const baseUrl = "https://t.me/scrapeuz";

  const postStartingId = 1190;
  const postEndingId = 3;
  let counter = 0;
  const saveTo = "product.json";
  const failed = [];
  const brands = [];

  let currentPostId = postStartingId - counter;

  while (currentPostId >= postEndingId + 1) {
    currentPostId = postStartingId - counter;

    await page.goto(`${baseUrl}/${currentPostId}?embed=1&mode=tme`, {
      waitUntil: "load",
      timeout: 9999999,
    });

    let imagesUrls = [];
    let name = "";
    let price;
    let images = [];
    let textContent;
    let htmlCont;

    let extUrl = `${baseUrl}/${currentPostId}?embed=1&mode=tme`;

    try {
      textContent = await page.$eval(
        ".tgme_widget_message_text",
        (el) => el.textContent
      );
    } catch (error) {}

    const hasImage = await page.$(".tgme_widget_message_photo_wrap");
    const hasPrice =
      textContent?.includes("narxi") ||
      textContent?.includes("min") ||
      textContent?.includes("ming");
   
    if (!hasImage) {
      console.log("could not find image " + extUrl);
      failed.push({
        reason: "could not find image",
        extUrl,
      });
    }
    

    if (hasImage && hasPrice) {
      imagesUrls = await page
        .$$eval(".tgme_widget_message_photo_wrap", (imgs) =>
          imgs.map((img) => {
            return img.style["background-image"]
              .replace('url("', "")
              .replace('")', "");
          })
        )

        .catch((error) => {
          console.log(error);
        });

      await page
        .$$eval(".emoji", (els) => els.forEach((el) => el.remove()))
        .catch((error) => {});
      await page
        .$$eval("i", (els) => els.forEach((el) => el.remove()))
        .catch((error) => {});
      await page
        .$$eval(".tgme_widget_message_text > a", (els) =>
          els.forEach((el) => el.remove())
        )
        .catch((error) => {});

      htmlCont = await page.$eval(
        ".tgme_widget_message_text",
        (el) => el.innerHTML
      );

      const contentArray = htmlCont
        ?.replace(
          '<div class="tgme_widget_message_text js-message_text" dir="auto">',
          ""
        )
        .replace("</div>", "")
        .split("<br>");
      

      price = parseInt(
        contentArray
          ?.filter((el) => el?.includes("narxi"))[0]
          ?.match(/\d/g)
          ?.join("")
      );

      name = `${contentArray[0]} Mushkambar ${brand ? brand : ""} Gramli`;
      const shortDesc = `${contentArray[0]} Original Mushkambar. <br> ${
        brand ? "Nomi: " + brand : ""
      } <br Gramlab sotiladi. <br> Minimum 3 gram sotiladi.`;
      const desc = shortDesc;

      const category = "Go’zallik-Salomatlik > Shaxsiy parvarish > Mushkambar";

      for await (const image of imagesUrls) {
        const options = {
          url: image,
          dest: `/Users/dilshodshoolimkhonov/projects/scrape/puppeteer/telegram/${imgDir}/${uniqid(
            "misk-26-1-",
            ".jpg"
          )}`,
        };
        try {
          const { filename } = await download.image(options);
          images.push(
            filename.replace(
              `/Users/dilshodshoolimkhonov/projects/scrape/puppeteer/telegram/${imgDir}/`,
              ""
            )
          );
        } catch (error) {
          console.log(error);
        }
      }

      console.log(name, price);

      // save to csv
      const id = Math.floor(Math.random() * 1000000);

      const sku = `xo${Math.floor(Math.random() * 100000)}`;

      const regularPricePercentage = Math.floor(Math.random() * 50) + 20;

      const salePricePercentage = 20;

      try {
        await fs.appendFile(
          saveTo,
          `${extUrl},${id},${SIMPLE},${sku},${name},${IS_PUBLISHED},${IS_FEATURED},${VISIBILITY},${shortDesc},${desc},${SALE_STARTS},${SALE_ENDS},${TAX_STATUS},${TAX_CLASS},${IN_STOCK},${STOCK},${LOW_STOCK_AMOUNT},${BACK_ORDERS_ALLOWED},${SOLD_INDIVIDUALLY},${WEIGHT},${LENGTH},${WIDTH},${HEIGHT},${ALLOW_REVIEWS},${PURCHASE_NOTE},${
            price + (salePricePercentage / 100) * price
          },${
            price + (regularPricePercentage / 100) * price
          },${category},${TAGS},${SHIPPING_CLASS},${`"${images}"`},${DOWNLOAD_LIMIT},${DOWNLOAD_EXPIRY},${PARENT},${GROUPED_PRODUCTS},${UP_SELLS},${CROSS_SELLS},${EXTERNAL_URL},${BUTTON_TEXT},${POSITION},${ATTR_ONE_NAME_SIMPLE},${ATTR_ONE_VALUE},${ATTR_ONE_VISIBLE},${ATTR_ONE_GLOBAL}\n`,
          function (err) {
            if (err) throw err;
          }
        );
      } catch (error) {
        console.log(error);
      }

      counter += imagesUrls.length;
    } else {
      counter = counter + 1;
    }
  }

  await browser.close();
})();
