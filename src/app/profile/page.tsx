'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    conditions: [] as string[],
    allergies: [] as string[],
  });

  const medicalConditions = [
    'Pregnancy',
    'Hypertension (High Blood Pressure)',
    'Diabetes',
    'Heart Disease',
    'Kidney Problems',
    'Liver Problems',
    'Asthma',
    'Stomach Ulcers',
  ];

  const handleToggleCondition = (condition: string) => {
    setProfile(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition],
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to localStorage or a database
    alert('Profile saved! This will be used to check for drug interactions.');
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
            <Link href="/scan" className="text-gray-600 hover:text-blue-600 transition-colors">Scan Medicine</Link>
            <Link href="/profile" className="text-blue-600 font-semibold">My Profile</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Health Profile</h2>
          <p className="text-gray-600">Tell us about your health conditions so we can check for drug interactions and warnings.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name (Optional)</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Age (Optional)</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Your age"
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Conditions</h3>
            <p className="text-sm text-gray-600 mb-4">Select all that apply. This helps us identify potential drug interactions.</p>
            <div className="grid md:grid-cols-2 gap-3">
              {medicalConditions.map((condition) => (
                <label
                  key={condition}
                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    profile.conditions.includes(condition)
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={profile.conditions.includes(condition)}
                    onChange={() => handleToggleCondition(condition)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{condition}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Drug Allergies</h3>
            <p className="text-sm text-gray-600 mb-4">List any medications you're allergic to (separated by commas).</p>
            <textarea
              value={profile.allergies.join(', ')}
              onChange={(e) => setProfile(prev => ({ 
                ...prev, 
                allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a) 
              }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[100px]"
              placeholder="e.g., Penicillin, Aspirin, Ibuprofen"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
          >
            Save Profile
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Why is this important?</h4>
              <p className="text-gray-600 text-sm">
                Your health profile helps our safety engine detect potential issues like:
              </p>
              <ul className="list-disc list-inside text-gray-600 text-sm mt-2 space-y-1">
                <li>Medicines unsafe for pregnancy</li>
                <li>Drugs that may increase blood pressure</li>
                <li>Ingredients that could affect diabetes management</li>
                <li>Potential allergic reactions</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
