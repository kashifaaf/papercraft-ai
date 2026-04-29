"use client";

import { useState } from 'react';
import { WeakAreaSelector } from './WeakAreaSelector';
import { ActionResult, MarkSheetData, WeakArea } from '@/lib/types';

export function MarkSheetUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [markSheetData, setMarkSheetData] = useState<MarkSheetData[]>([]);
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('marksheet', file);

      const response = await fetch('/api/upload-marksheet', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json() as ActionResult<{
        markSheetData: MarkSheetData[];
        weakAreas: WeakArea[];
      }>;

      if (result.success && result.data) {
        setMarkSheetData(result.data.markSheetData);
        setWeakAreas(result.data.weakAreas);
      } else {
        setError(result.error || 'Failed to process mark sheet');
      }
    } catch (error) {
      setError('Failed to upload mark sheet. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (weakAreas.length > 0) {
    return <WeakAreaSelector weakAreas={weakAreas} />;
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Mark Sheet</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="marksheet" className="block text-sm font-medium text-gray-700 mb-2">
            Choose mark sheet image
          </label>
          <input
            id="marksheet"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="input-field"
            aria-describedby="file-help"
          />
          <p id="file-help" className="mt-2 text-sm text-gray-500">
            Upload a clear photo of your Class 11/12 mark sheet (JPG, PNG, etc.)
          </p>
        </div>

        {file && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Selected file:</span> {file.name}
            </p>
            <p className="text-sm text-gray-500">
              Size: {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full"
          aria-label="Upload and analyze mark sheet"
        >
          {uploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Mark Sheet...
            </span>
          ) : (
            'Upload & Analyze'
          )}
        </button>
      </div>

      {markSheetData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Detected Subjects</h3>
          <div className="space-y-2">
            {markSheetData.map((data, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{data.subject}</span>
                <div className="text-right">
                  <span className="text-lg font-semibold text-gray-900">
                    {data.marks}/{data.maxMarks}
                  </span>
                  <span className={`ml-2 text-sm ${data.percentage >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                    ({data.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}