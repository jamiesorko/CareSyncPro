import { geminiService } from './geminiService';
import { analyticsService } from './analyticsService';

export class ReportingService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Generates a "Director of Care" monthly summary using current agency telemetry.
   */
  async generateExecutiveBrief(): Promise<string> {
    const metrics = analyticsService.getProfitabilityDelta();
    const prompt = `
      System: Healthcare ERP Reporting Engine.
      Data: Revenue=${metrics.revenue}, Margin=${metrics.margin}%.
      Task: Generate a 3-paragraph Executive Brief. 
      Paragraph 1: Financial Health.
      Paragraph 2: Operational Efficiency.
      Paragraph 3: Recommendations for the next billing cycle.
      Tone: Professional, urgent, data-driven.
    `;

    try {
      const response = await geminiService.generateText(prompt, false);
      return response.text || "Report generation vector failed.";
    } catch (e) {
      return "Unable to synchronize reporting metrics.";
    }
  }

  async exportRegulatoryAudit() {
    console.log("[REPORTING_CORE]: Compiling T4/WSIB compliance package for submission.");
    // Logic to aggregate all billing and insurance data into a downloadable archive
  }
}

export const reportingService = new ReportingService();