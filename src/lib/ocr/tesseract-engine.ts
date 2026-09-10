import Tesseract, { Worker } from 'tesseract.js';

let workerInstance: Worker | null = null;

export async function initializeWorker(): Promise<Worker> {
  if (workerInstance) {
    return workerInstance;
  }

  workerInstance = await Tesseract.createWorker();

  // Set language to Indonesian and English for better OCR
  await workerInstance.reinitialize('ind+eng');

  return workerInstance;
}

export async function recognizeText(
  imageSource: string | HTMLImageElement
): Promise<string> {
  const worker = await initializeWorker();

  const result = await worker.recognize(imageSource);
  return result.data.text;
}

export async function terminateWorker(): Promise<void> {
  if (workerInstance) {
    await workerInstance.terminate();
    workerInstance = null;
  }
}
