# ObatKu SafeScan 🛡️💊

An AI-powered web application designed to check the safety of Indonesian Over-The-Counter (OTC) medicines. Users can upload a photo of a medicine box, and the app identifies the drug, extracts expiry dates, and checks for safety interactions based on their personal health profile.

## 🚀 Features

- **📸 Image Recognition**: Uses TensorFlow.js (MobileNetV2) to identify medicine packaging directly in the browser.
- **📝 OCR Expiry Check**: Integrates Tesseract.js to read and validate expiry dates from the box.
- **⚠️ Safety Engine**:
  - Detects expired medicines.
  - Identifies duplicate active ingredients (e.g., preventing Paracetamol overdose from taking Panadol + Bodrex).
  - Checks contraindications based on user profile (e.g., Pregnancy, Hypertension, Diabetes).
- **🔒 Privacy First**: All AI processing happens client-side. No medical images are uploaded to a server.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI/ML**: TensorFlow.js, MobileNetV2
- **OCR**: Tesseract.js
- **Deployment**: Vercel

## 📂 Project Structure

```
obatku-safescan/
├── public/
│   ├── model/          # TensorFlow.js model files (to be added)
│   └── images/         # Static assets
├── src/
│   ├── app/            # Next.js App Router
│   ├── components/     # Reusable UI components
│   ├── data/           # Local JSON databases (drugs, interactions)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions & AI logic
│   └── types/          # TypeScript definitions
└── plan.md             # Implementation roadmap
```

## 🏃 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/obatku-safescan.git
   cd obatku-safescan
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing

Contributions are welcome! Please read `plan.md` to understand the current development phase and upcoming features.

## 📄 License

This project is licensed under the MIT License.

---
*Disclaimer: This application is for educational and informational purposes only. It does not replace professional medical advice. Always consult a doctor or pharmacist.*
