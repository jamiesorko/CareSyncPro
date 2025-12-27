
import { GoogleGenAI } from "@google/genai";
import { DeviceReading } from '../types';

export class HardwareVisionService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Reads data from physical legacy medical device screens and standardizes into FHIR.
   */
  async interceptHardwareScreen(base64Image: string): Promise<DeviceReading> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const prompt = `
      Act as a Universal Hardware Interop Protocol. 
      Analyze this medical device screen image.
      
      Task: 
      1. Identify the device type (e.g. Alaris IV Pump, GE MRI Monitor, Welch Allyn BP).
      2. Extract all numerical clinical values visible.
      3. Map the data to a valid FHIR R4 JSON Observation resource.
      
      Return JSON: { 
        "device": "Brand/Model", 
        "value": "Raw string value", 
        "metric": "Standardized unit", 
        "confidence": number, 
        "fhir": "Full JSON string" 
      }
    `;

    try {
      // Fix: Removed responseMimeType from gemini-2.5-flash-image config as it's not supported for nano banana models.
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
            { text: prompt }
          ]
        }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        deviceName: data.device || 'Unknown Legacy Device',
        detectedValue: data.value || '--',
        standardizedMetric: data.metric || 'N/A',
        confidence: data.confidence || 0,
        fhirMappedJson: data.fhir || "{}"
      };
    } catch (e) {
      throw e;
    }
  }
}

export const hardwareVisionService = new HardwareVisionService();
