export default async function checkImageExistence(page) {
  const selector = ".tgme_widget_message_photo_wrap";
  try {
    const imageElement = await page.$(selector);
    return imageElement !== null;
  } catch (error) {
    console.error("Error while checking image existence:", error);
    return false;
  }
}
