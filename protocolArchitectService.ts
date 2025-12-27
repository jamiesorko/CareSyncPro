import { GoogleGenAI, Type } from "@google/genai";
import { ProtocolDraft } from '../types';

export class ProtocolArchitectService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Forges a full SOP draft from a brief directive.
   */
  async forgeProtocol(directive: string, focusArea: string): Promise<ProtocolDraft> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const prompt = `
      Act as a Lead Clinical Compliance Architect and Director of Nursing.
      Focus: ${focusArea}
      Objective: "${directive}"
      
      Task: Synthesize a professional Standard Operating Procedure (SOP).
      1. Write a formal title.
      2. Define the core clinical objective.
      3. Create 5 sequential workflow steps involving specific Care Roles.
      4. List 3 mandatory audit checklist items for forensic validation.
      5. Reference exactly one applicable Ontario health regulation.
      
      Return JSON: { 
        "title": "", 
        "objective": "", 
        "steps": [ { "role": "", "task": "", "critical": boolean } ], 
        "audit": [], 
        "regulation": "" 
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 24576 } 
        }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        title: data.title || "Clinical Mastery Protocol",
        objective: data.objective || "Standardize care delivery vectors.",
        regulatoryAlignment: data.regulation || "Ontario Long-Term Care Standards.",
        workflowSteps: data.steps || [],
        auditChecklist: data.audit || []
      };
    } catch (e) {
      console.error("Protocol forge failed:", e);
      throw e;
    }
  }
}

export const protocolArchitectService = new ProtocolArchitectService();