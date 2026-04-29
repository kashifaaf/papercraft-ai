import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromImage } from '@/lib/google-vision';
import { parseMarkSheetText, identifyWeakAreas } from '@/lib/mark-sheet-parser';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('marksheet') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Please upload an image file' },
        { status: 400 }
      );
    }

    // Extract text using Google Vision API
    const extractedText = await extractTextFromImage(file);
    
    // Parse the extracted text to get marks data
    const markSheetData = parseMarkSheetText(extractedText);
    
    if (markSheetData.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Could not detect marks in the image. Please ensure the mark sheet is clear and try again.' 
        },
        { status: 400 }
      );
    }

    // Identify weak areas (subjects scoring below 60%)
    const weakAreas = identifyWeakAreas(markSheetData);
    
    return NextResponse.json({
      success: true,
      data: {
        markSheetData,
        weakAreas
      }
    });

  } catch (error) {
    console.error('Upload marksheet error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process mark sheet. Please try again with a clearer image.' 
      },
      { status: 500 }
    );
  }
}