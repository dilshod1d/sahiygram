export default async function getImageUrls(page) {
  const selector = ".tgme_widget_message_photo_wrap";
  try {
    const imageUrls = await page.$$eval(selector, (imgs) =>
      imgs.map((img) => {
        const backgroundImage = img.style["background-image"];
        return backgroundImage.replace('url("', "").replace('")', "");
      })
    );
    return imageUrls;
  } catch (error) {
    console.error("Error while extracting image URLs:", error);
    return [];
  }
}
