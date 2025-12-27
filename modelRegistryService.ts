export type NeuralTask = 'TEXT_SUMMARY' | 'COMPLEX_REASONING' | 'VISION_ANALYSIS' | 'VIDEO_SYNTHESIS' | 'LIVE_AUDIO';

export class ModelRegistryService {
  private taskMap: Record<NeuralTask, string> = {
    'TEXT_SUMMARY': 'gemini-3-flash-preview',
    'COMPLEX_REASONING': 'gemini-3-pro-preview',
    'VISION_ANALYSIS': 'gemini-2.5-flash-image',
    'VIDEO_SYNTHESIS': 'veo-3.1-fast-generate-preview',
    'LIVE_AUDIO': 'gemini-2.5-flash-native-audio-preview-09-2025'
  };

  getModelForTask(task: NeuralTask): string {
    return this.taskMap[task];
  }

  updateTaskModel(task: NeuralTask, model: string) {
    console.log(`[NEURAL_CONFIG]: Updating Task ${task} to use ${model}`);
    this.taskMap[task] = model;
  }
}

export const modelRegistryService = new ModelRegistryService();