# ObatKu SafeScan - Project Plan

## Overview
AI-powered web app for checking the safety of Indonesian OTC medicines using client-side TensorFlow.js and Tesseract.js OCR.

---

## Phase 1: Model Integration (Week 1)

### Objectives
- Set up TensorFlow.js MobileNetV2 model for medicine identification
- Create model loading utilities
- Implement image preprocessing pipeline

### Tasks
1. **Model Setup**
   - Place trained MobileNetV2 model files in `/public/model/`
     - `model.json`
     - `weights.bin` (sharded if necessary)
   - Create model metadata file with class labels mapping to Indonesian medicines

2. **Model Loading Utility** (`src/lib/tfjs/model-loader.ts`)
   - Load TensorFlow.js model from public directory
   - Implement caching mechanism
   - Handle loading states and errors

3. **Image Preprocessing** (`src/lib/tfjs/image-processor.ts`)
   - Resize images to model input dimensions (224x224)
   - Normalize pixel values
   - Convert to tensor format

4. **Prediction Service** (`src/lib/tfjs/predictor.ts`)
   - Run inference on preprocessed images
   - Return top-N predictions with confidence scores
   - Map predictions to medicine database

### Deliverables
- Working model loader
- Image preprocessing pipeline
- Prediction service returning medicine identifications

---

## Phase 2: OCR for Expiry Date Extraction (Week 2)

### Objectives
- Integrate Tesseract.js for text extraction from medicine packaging
- Parse and validate expiry dates from extracted text
- Handle various date formats commonly used in Indonesia

### Tasks
1. **Tesseract.js Setup** (`src/lib/ocr/tesseract-engine.ts`)
   - Initialize Tesseract worker
   - Configure for optimal text recognition
   - Support multiple languages (Indonesian + English)

2. **Text Extraction** (`src/lib/ocr/text-extractor.ts`)
   - Process uploaded images
   - Extract text regions from medicine packaging
   - Filter relevant text (focus on expiry date patterns)

3. **Date Parsing** (`src/lib/ocr/date-parser.ts`)
   - Identify expiry date patterns (DD/MM/YYYY, MM/YYYY, etc.)
   - Convert to standardized Date objects
   - Handle Indonesian date formats (e.g., "Exp: 12/2025", "Kadaluarsa: Des 2025")

4. **Validation Logic**
   - Compare extracted date with current date
   - Flag expired medicines
   - Calculate days until expiration

### Deliverables
- Working OCR pipeline
- Reliable date extraction and parsing
- Expiration status determination

---

## Phase 3: Safety Engine (Week 3)

### Objectives
- Build comprehensive drug safety checking logic
- Implement duplicate ingredient detection
- Create user profile-based warning system

### Tasks
1. **Data Structure Setup**
   - Create `src/data/drugs.json` with Indonesian OTC medicines:
     ```json
     {
       "panadol": {
         "name": "Panadol",
         "activeIngredients": ["paracetamol"],
         "dosage": "500mg",
         "category": "analgesic"
       }
     }
     ```
   
   - Create `src/data/interactions.json`:
     ```json
     {
       "paracetamol": {
         "maxDailyDose": "4000mg",
         "warnings": ["liver disease"],
         "contraindications": []
       }
     }
     ```

2. **Drug Database Service** (`src/lib/safety/drug-database.ts`)
   - Load and index drug data
   - Search by name or ingredients
   - Retrieve drug information

3. **Interaction Checker** (`src/lib/safety/interaction-checker.ts`)
   - Detect duplicate active ingredients across multiple medicines
   - Check for dangerous drug combinations
   - Calculate total dosage of shared ingredients

4. **User Profile System** (`src/lib/safety/user-profile.ts`)
   - Define profile types (pregnancy, hypertension, diabetes, liver condition, etc.)
   - Store user health conditions
   - Match conditions against drug contraindications

5. **Safety Report Generator** (`src/lib/safety/report-generator.ts`)
   - Aggregate all safety checks
   - Generate comprehensive safety report
   - Provide actionable recommendations

### Deliverables
- Complete drug database
- Interaction detection system
- User profile-based warnings
- Safety report generation

---

## Phase 4: UI Development (Week 4)

### Objectives
- Create intuitive user interface for medicine scanning
- Display results clearly with actionable insights
- Implement responsive design for mobile and desktop

### Tasks
1. **Component Library**
   - `src/components/ui/Button.tsx`
   - `src/components/ui/Card.tsx`
   - `src/components/ui/Badge.tsx`
   - `src/components/ui/ProgressBar.tsx`

2. **Core Components**
   - `src/components/MedicineUploader.tsx` - Drag & drop image upload
   - `src/components/ImagePreview.tsx` - Show uploaded image
   - `src/components/LoadingSpinner.tsx` - Processing indicators
   - `src/components/ResultCard.tsx` - Display medicine info

3. **Results Display**
   - `src/components/results/IdentificationResult.tsx` - Medicine identification
   - `src/components/results/ExpiryStatus.tsx` - Expiration check result
   - `src/components/results/IngredientWarning.tsx` - Duplicate ingredient alerts
   - `src/components/results/ProfileWarnings.tsx` - User-specific warnings

4. **Pages**
   - `src/app/page.tsx` - Home page with upload interface
   - `src/app/scan/page.tsx` - Scanning progress and results
   - `src/app/profile/page.tsx` - User health profile management
   - `src/app/history/page.tsx` - Scan history (optional)

5. **State Management**
   - Use React Context or Zustand for global state
   - Manage scan results, user profile, and loading states

### Deliverables
- Complete responsive UI
- Intuitive scanning workflow
- Clear result presentation

---

## Phase 5: Deployment & Optimization (Week 5)

### Objectives
- Prepare application for Vercel deployment
- Optimize performance for production
- Ensure security and privacy compliance

### Tasks
1. **Vercel Configuration**
   - Create `vercel.json` for deployment settings
   - Configure environment variables
   - Set up proper caching headers

2. **Performance Optimization**
   - Implement lazy loading for TF.js and Tesseract.js
   - Optimize image sizes before processing
   - Add service worker for offline capability (optional)

3. **Security Measures**
   - Ensure client-side only processing (no server uploads)
   - Add Content Security Policy headers
   - Validate all user inputs

4. **Testing**
   - Unit tests for safety engine functions
   - Integration tests for complete scanning flow
   - Cross-browser testing

5. **Documentation**
   - Update README.md with setup instructions
   - Add API documentation
   - Create user guide

6. **Deployment**
   - Connect repository to Vercel
   - Configure production build
   - Set up preview deployments for PRs

### Deliverables
- Production-ready application
- Deployed on Vercel
- Complete documentation

---

## Folder Structure

```
/workspace
├── public/
│   └── model/
│       ├── model.json
│       └── weights.bin
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page
│   │   ├── scan/
│   │   │   └── page.tsx          # Scanning page
│   │   ├── profile/
│   │   │   └── page.tsx          # User profile page
│   │   └── layout.tsx            # Root layout
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   ├── MedicineUploader.tsx
│   │   ├── ImagePreview.tsx
│   │   └── results/              # Result display components
│   ├── lib/
│   │   ├── tfjs/                 # TensorFlow.js utilities
│   │   │   ├── model-loader.ts
│   │   │   ├── image-processor.ts
│   │   │   └── predictor.ts
│   │   ├── ocr/                  # Tesseract.js utilities
│   │   │   ├── tesseract-engine.ts
│   │   │   ├── text-extractor.ts
│   │   │   └── date-parser.ts
│   │   └── safety/               # Safety engine
│   │       ├── drug-database.ts
│   │       ├── interaction-checker.ts
│   │       ├── user-profile.ts
│   │       └── report-generator.ts
│   ├── data/
│   │   ├── drugs.json
│   │   └── interactions.json
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   └── hooks/                    # Custom React hooks
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── vercel.json
```

---

## Technical Notes

### Client-Side AI Considerations
- All ML processing happens in browser (privacy-first approach)
- Initial model load may take time; implement loading states
- Consider Web Workers for heavy computation to avoid blocking UI

### Data Privacy
- No images uploaded to servers
- User profiles stored locally (localStorage/IndexedDB)
- Compliant with Indonesian data protection regulations

### Performance Targets
- Model load time: < 5 seconds on 4G
- Inference time: < 2 seconds
- OCR processing: < 5 seconds
- Total scan time: < 15 seconds

---

## Success Criteria

1. ✅ Users can upload medicine photos and get accurate identification
2. ✅ Expiry dates are correctly extracted and validated
3. ✅ Duplicate ingredient warnings work accurately
4. ✅ User profile-based warnings function correctly
5. ✅ Application deploys successfully on Vercel
6. ✅ All processing remains client-side (no server dependencies for AI)

---

*Last Updated: $(date)*
*Project: ObatKu SafeScan*
