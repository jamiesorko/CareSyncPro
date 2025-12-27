import { geminiService } from './geminiService';
import { Client } from '../types';

export interface OptimizationSuggestion {
  targetTask: string;
  adjustment: string;
  clinicalRationale: string;
  priority: 'ROUTINE' | 'ADVISORY' | 'CRITICAL';
}

export class CarePlanOptimizationService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Evaluates patient outcomes vs current care plan tasks to find inefficiencies.
   */
  async optimizePlan(client: Client, outcomeData: any): Promise<OptimizationSuggestion[]> {
    console.log(`[NEURAL_ARCHITECT]: Optimizing care plan vectors for ${client.name}`);
    
    const prompt = `
      Patient: ${client.name}
      Current Care Plan: ${JSON.stringify(client.carePlans)}
      Outcome Telemetry: ${JSON.stringify(outcomeData)}
      
      Suggest 2 optimizations to the care plan. 
      Return JSON: { "optimizations": [ { "task": "string", "adjustment": "string", "rationale": "string", "priority": "ROUTINE|ADVISORY|CRITICAL" } ] }
    `;

    try {
      const response = await geminiService.generateText(prompt, false);
      const data = JSON.parse(response.text || '{}');
      return (data.optimizations || []).map((o: any) => ({
        targetTask: o.task,
        adjustment: o.adjustment,
        clinicalRationale: o.rationale,
        priority: o.priority
      }));
    } catch (e) {
      return [];
    }
  }
}

export const carePlanOptimizationService = new CarePlanOptimizationService();