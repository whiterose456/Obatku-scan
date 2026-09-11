'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ScanPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis - will be replaced with actual AI logic
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        drugName: 'Panadol Extra',
        activeIngredients: ['Paracetamol 500mg', 'Caffeine 65mg'],
        expiryDate: '2025-12-31',
        isExpired: false,
        warnings: [],
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="w-full py-6 px-8 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">ObatKu SafeScan</h1>
          </Link>
          <nav className="flex gap-6">
            <Link href="/scan" className="text-blue-600 font-semibold">Scan Medicine</Link>
            <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">My Profile</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Scan Your Medicine</h2>

        {/* Upload Section */}
        {!image && (
          <div className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-300 p-12 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-2">Upload Medicine Photo</p>
              <p className="text-gray-500">Click to select or drag and drop an image</p>
            </label>
          </div>
        )}

        {/* Image Preview */}
        {image && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <img src={image} alt="Medicine" className="w-full h-64 object-cover" />
            <div className="p-6">
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setImage(null)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Choose Different Photo
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Medicine'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-lg font-semibold text-gray-900 mb-2">Analyzing Your Medicine...</p>
            <p className="text-gray-500">Our AI is identifying the drug and checking expiry date</p>
          </div>
        )}

        {/* Results */}
        {result && !isAnalyzing && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-green-50 border-b border-green-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-800">Analysis Complete</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{result.drugName}</h4>
                <p className="text-gray-600">Active Ingredients:</p>
                <ul className="list-disc list-inside text-gray-700 mt-1">
                  {result.activeIngredients.map((ing: string, i: number) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Expiry Date</p>
                  <p className={`text-lg font-semibold ${result.isExpired ? 'text-red-600' : 'text-green-600'}`}>
                    {result.expiryDate}
                  </p>
                  <p className={`text-sm mt-1 ${result.isExpired ? 'text-red-600' : 'text-green-600'}`}>
                    {result.isExpired ? '⚠️ EXPIRED' : '✅ Valid'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Safety Status</p>
                  <p className="text-lg font-semibold text-green-600">Safe to Use</p>
                  <p className="text-sm text-green-600 mt-1">No interactions detected</p>
                </div>
              </div>

              {result.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h5 className="font-semibold text-yellow-800 mb-2">⚠️ Warnings</h5>
                  <ul className="list-disc list-inside text-yellow-700">
                    {result.warnings.map((warning: string, i: number) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => {
                  setImage(null);
                  setResult(null);
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Scan Another Medicine
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
