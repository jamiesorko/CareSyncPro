import { geminiService } from './geminiService';

export class ClinicalTranslationService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Translates clinical notes while preserving medical acronyms and intent.
   */
  async translateClinicalNote(text: string, targetLang: string): Promise<string> {
    console.log(`[NEURAL_LINGUIST]: Translating clinical vector to ${targetLang}`);
    
    const prompt = `
      Act as a Professional Medical Interpreter.
      Task: Translate the following clinical note into ${targetLang}.
      Rules:
      1. Presere medical acronyms (e.g., ADL, PRN, BID) if they are standard in the target language's medical community.
      2. Ensure the tone is clinical and professional.
      3. Maintain absolute accuracy for dosages and frequencies.
      
      Note: "${text}"
    `;

    try {
      const response = await geminiService.generateText(prompt, false);
      return response.text || text;
    } catch (e) {
      return text;
    }
  }
}

export const clinicalTranslationService = new ClinicalTranslationService();