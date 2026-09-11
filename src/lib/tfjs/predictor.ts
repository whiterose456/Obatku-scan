import * as tf from '@tensorflow/tfjs';
import type { ModelPrediction } from '@/types';

export async function predict(
  model: tf.LayersModel,
  tensor: tf.Tensor3D,
  topK: number = 5
): Promise<ModelPrediction[]> {
  return tf.tidy(() => {
    // Add batch dimension
    const batchedTensor = tensor.expandDims(0);

    // Run inference
    const predictions = model.predict(batchedTensor) as tf.Tensor;

    // Get probabilities
    const probabilities = predictions.dataSync();

    // Get top K predictions
    const indices = [...probabilities.keys()]
      .sort((a, b) => probabilities[b] - probabilities[a])
      .slice(0, topK);

    return indices.map((index) => ({
      className: index.toString(),
      probability: probabilities[index],
    }));
  });
}

export function parsePredictionClass(
  className: string,
  classList: string[]
): string {
  // Handle both numeric indices and named classes
  const index = parseInt(className, 10);
  if (!isNaN(index) && index >= 0 && index < classList.length) {
    return classList[index];
  }
  return className;
}
