export async function extractTextFromImage(imageFile: File): Promise<string> {
  try {
    const base64Image = await fileToBase64(imageFile);
    
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: base64Image.split(',')[1] // Remove data:image/jpeg;base64, prefix
          },
          features: [{
            type: 'TEXT_DETECTION',
            maxResults: 1
          }]
        }]
      })
    });

    const result = await response.json();
    
    if (result.responses?.[0]?.textAnnotations?.[0]?.description) {
      return result.responses[0].textAnnotations[0].description;
    }
    
    throw new Error('No text detected in image');
  } catch (error) {
    console.error('Vision API error:', error);
    throw new Error('Failed to extract text from image');
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}