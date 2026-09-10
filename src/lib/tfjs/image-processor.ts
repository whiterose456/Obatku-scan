import * as tf from '@tensorflow/tfjs';

const TARGET_SIZE = 224;

export function preprocessImage(imageElement: HTMLImageElement): tf.Tensor3D {
  return tf.tidy(() => {
    // Convert image to tensor
    let tensor = tf.browser.fromPixels(imageElement);

    // Resize to target size (224x224 for MobileNetV2)
    tensor = tf.image.resizeBilinear(tensor, [TARGET_SIZE, TARGET_SIZE]);

    // Normalize pixel values to [0, 1] range
    tensor = tensor.toFloat().div(tf.scalar(255));

    // Add batch dimension (model expects [batch, height, width, channels])
    // But we'll handle batching in the predictor
    return tensor;
  });
}

export function preprocessImageData(
  imageData: ImageData
): tf.Tensor3D {
  return tf.tidy(() => {
    // Convert ImageData to tensor
    let tensor = tf.browser.fromPixels(imageData);

    // Resize to target size
    tensor = tf.image.resizeBilinear(tensor, [TARGET_SIZE, TARGET_SIZE]);

    // Normalize
    tensor = tensor.toFloat().div(tf.scalar(255));

    return tensor;
  });
}

export async function loadImageFromFile(
  file: File
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
