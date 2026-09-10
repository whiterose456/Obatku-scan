import * as tf from '@tensorflow/tfjs';
import type { ModelMetadata, ModelPrediction } from '@/types';

let cachedModel: tf.LayersModel | null = null;
let cachedMetadata: ModelMetadata | null = null;

export async function loadModel(): Promise<{
  model: tf.LayersModel;
  metadata: ModelMetadata;
}> {
  if (cachedModel && cachedMetadata) {
    return { model: cachedModel, metadata: cachedMetadata };
  }

  try {
    // Load model metadata
    const metadataResponse = await fetch('/model/model-metadata.json');
    if (!metadataResponse.ok) {
      throw new Error('Failed to load model metadata');
    }
    const metadata = await metadataResponse.json();

    // Load TensorFlow.js model
    const modelPath = '/model/model.json';
    const model = await tf.loadLayersModel(modelPath);

    // Cache the results
    cachedModel = model;
    cachedMetadata = metadata;

    console.log('Model loaded successfully');
    return { model, metadata };
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error(
      'Failed to load AI model. Please ensure model files exist in /public/model/'
    );
  }
}

export function clearCache(): void {
  if (cachedModel) {
    cachedModel.dispose();
    cachedModel = null;
  }
  cachedMetadata = null;
}
