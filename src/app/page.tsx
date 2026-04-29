import { MarkSheetUpload } from '@/components/MarkSheetUpload';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Personalized Question Papers for CBSE/ICSE Students
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Upload your mark sheet and get targeted practice questions for your weak areas
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-primary-600 font-semibold">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Upload Mark Sheet</h3>
          </div>
          <p className="text-gray-600">
            Take a photo of your Class 11/12 mark sheet. Our AI will automatically extract your marks and identify subjects where you scored below 60%.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-primary-600 font-semibold">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Select Subject</h3>
          </div>
          <p className="text-gray-600">
            Choose from your identified weak areas to generate a personalized question paper with 25 targeted questions.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-primary-600 font-semibold">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Practice & Learn</h3>
          </div>
          <p className="text-gray-600">
            Answer questions at your own pace. Get immediate feedback with detailed explanations to help you understand concepts better.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-primary-600 font-semibold">4</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Download Results</h3>
          </div>
          <p className="text-gray-600">
            Get your completed paper with answers and explanations as a PDF for future reference and continued learning.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <MarkSheetUpload />
      </div>
    </div>
  );
}