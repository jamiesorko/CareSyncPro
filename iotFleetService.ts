import { GoogleGenAI, Type } from "@google/genai";
import { IoTAsset } from '../types';

export class IoTFleetService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Processes hardware fault codes and finds nearest technicians using grounding.
   */
  async processAssetTelemetry(asset: Partial<IoTAsset>, location: string): Promise<IoTAsset> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const query = `Certified ${asset.name} technicians and repair shops near ${location}, Ontario October 2025. Identification of 24/7 service capability.`;
    
    const prompt = `
      Act as an Autonomous Fleet Maintenance Logistics Core.
      Asset: ${asset.name} (Type: ${asset.type})
      Live Fault Telemetry: "${asset.telemetry}"
      Location: ${location}
      
      Task: Identify if the fault is critical.
      1. Source exactly 1 nearby certified technician/shop using Grounded Search.
      2. Provide a 1-sentence diagnostic of the telemetry signal.
      3. Recommend a 'Safety Override' if patient impact is high.
      
      Return JSON: { "status": "NOMINAL|FAULT|MAINTENANCE", "technician": "Name + Address", "diagnostic": "", "override": "" }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        id: asset.id || 'iot-000',
        name: asset.name || 'Unknown Asset',
        type: asset.type || 'HARDWARE',
        status: data.status || 'FAULT',
        telemetry: data.diagnostic || "Fault signal detected.",
        repairGroundedInfo: data.technician || "Searching certified network..."
      };
    } catch (e) {
      return {
        id: asset.id || 'iot-000',
        name: asset.name || 'Unknown Asset',
        type: asset.type || 'HARDWARE',
        status: 'FAULT',
        telemetry: "Neural intercept failure. Manual maintenance required.",
        repairGroundedInfo: "Local directory lookup failed."
      };
    }
  }
}

export const iotFleetService = new IoTFleetService();