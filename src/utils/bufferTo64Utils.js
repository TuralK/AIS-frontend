/**
 * Buffer ve Base64 dönüşüm utility fonksiyonları
 */

/**
 * Buffer verisini Base64 string'e dönüştürür
 * @param {ArrayBuffer|Uint8Array|Array} bufferData - Dönüştürülecek buffer verisi
 * @returns {string} Base64 encoded string
 */
export function bufferToBase64(bufferData) {
  let binary = "";
  // Eğer doğrudan Uint8Array değilse dönüştür
  const bytes = bufferData instanceof Uint8Array ? bufferData : new Uint8Array(bufferData);
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
}


/**
 * Buffer verisini data URL'e dönüştürür (image için kullanım)
 * @param {ArrayBuffer|Uint8Array|Array} bufferData - Dönüştürülecek buffer verisi
 * @param {string} mimeType - MIME type (örn: 'image/jpeg', 'image/png')
 * @returns {string} Data URL string
 */
export function bufferToDataURL(bufferData, mimeType = 'image/jpeg') {
  const base64 = bufferToBase64(bufferData);
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Buffer verisinin MIME type'ını tespit etmeye çalışır
 * @param {ArrayBuffer|Uint8Array|Array} bufferData - Kontrol edilecek buffer verisi
 * @returns {string} Tespit edilen MIME type
 */
export function detectImageMimeType(bufferData) {
  const bytes = bufferData instanceof Uint8Array ? bufferData : new Uint8Array(bufferData);
  
  // JPEG signature: FF D8 FF
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return 'image/jpeg';
  }
  
  // PNG signature: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
    return 'image/png';
  }
  
  // GIF signature: 47 49 46
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return 'image/gif';
  }
  
  // WebP signature: 52 49 46 46 ... 57 45 42 50
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
    return 'image/webp';
  }
  
  // Default olarak JPEG döndür
  return 'image/jpeg';
}

/**
 * Buffer verisini otomatik MIME type tespiti ile data URL'e dönüştürür
 * @param {ArrayBuffer|Uint8Array|Array} bufferData - Dönüştürülecek buffer verisi
 * @returns {string} Data URL string
 */
export function bufferToAutoDataURL(bufferData) {
  const mimeType = detectImageMimeType(bufferData);
  return bufferToDataURL(bufferData, mimeType);
}