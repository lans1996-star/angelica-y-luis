export default async function handler(req, res) {
  const SCRIPT_URL = 'AQUI_TU_NUEVA_URL_DE_APPS_SCRIPT';
  const fallbackImg = 'https://script.google.com/macros/s/AKfycbwfff2n8XhgtDiitt00PMfYd7Q9Tw8J6mpbewwNECdr-h1HTxNUG0lnEhL_zNQ9cJ4C5A/exec';

  try {
    let targetImageUrl = fallbackImg;

    if (SCRIPT_URL && SCRIPT_URL.startsWith('https://script.google.com')) {
      const response = await fetch(`${SCRIPT_URL}?action=get_og_url`);
      const data = await response.json();
      if (data && data.url) {
        targetImageUrl = data.url;
      }
    }

    // Descarga los bytes de la imagen actual y los sirve directo a WhatsApp
    const imgResponse = await fetch(targetImageUrl);
    const contentType = imgResponse.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await imgResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', contentType);
    // Cache corta de 60 segundos para que si la cambias en el panel se actualice rápido
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
    return res.status(200).send(buffer);
  } catch (error) {
    return res.redirect(302, fallbackImg);
  }
}