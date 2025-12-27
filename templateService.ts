
export interface DocTemplate {
  id: string;
  name: string;
  sections: string[];
  version: string;
}

export class TemplateService {
  // Added companyId context to align with other services
  private companyId: string | null = null;

  private templates: DocTemplate[] = [
    { id: 't-wound', name: 'Wound Care Protocol', sections: ['Measurements', 'Exudate', 'Surrounding Skin', 'Action Taken'], version: '2.1' },
    { id: 't-mental', name: 'Cognitive Status Review', sections: ['Orientation', 'Memory', 'Affect', 'Agitation Level'], version: '1.0' }
  ];

  // Added setContext to fix compilation error in DBService line 304
  setContext(id: string) {
    this.companyId = id;
  }

  getTemplate(id: string): DocTemplate | undefined {
    return this.templates.find(t => t.id === id);
  }

  getAllTemplates(): DocTemplate[] {
    return this.templates;
  }
}

export const templateService = new TemplateService();
