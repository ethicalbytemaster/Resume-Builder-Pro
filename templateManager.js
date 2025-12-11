// Template Manager - Multiple Resume Template Support
// Features from resume.com: Multiple professional templates

class TemplateManager {
  constructor() {
    this.templates = this.initializeTemplates();
    this.currentTemplate = 'modern';
  }

  initializeTemplates() {
    return {
      modern: {
        name: 'Modern',
        description: 'Clean and contemporary design',
        colors: { primary: '#667eea', secondary: '#f0f0f0' },
        layout: 'single-column',
        features: ['color accents', 'modern fonts']
      },
      professional: {
        name: 'Professional',
        description: 'Traditional and formal layout',
        colors: { primary: '#333333', secondary: '#ffffff' },
        layout: 'single-column',
        features: ['classic styling', 'conservative']
      },
      creative: {
        name: 'Creative',
        description: 'Artistic and unique presentation',
        colors: { primary: '#ff6b6b', secondary: '#f9f9f9' },
        layout: 'two-column-left',
        features: ['design elements', 'sidebar']
      },
      minimal: {
        name: 'Minimal',
        description: 'Simplistic and focused',
        colors: { primary: '#000000', secondary: '#ffffff' },
        layout: 'single-column',
        features: ['minimal styling', 'maximum readability']
      },
      techie: {
        name: 'Tech',
        description: 'Ideal for tech professionals',
        colors: { primary: '#00d4ff', secondary: '#1a1a1a' },
        layout: 'two-column-right',
        features: ['code styling', 'tech-friendly']
      },
      executive: {
        name: 'Executive',
        description: 'Premium and sophisticated',
        colors: { primary: '#1a365d', secondary: '#f5f5f5' },
        layout: 'single-column',
        features: ['premium look', 'high-end design']
      }
    };
  }

  // Get all available templates
  getAllTemplates() {
    return Object.entries(this.templates).map(([key, value]) => ({
      id: key,
      ...value
    }));
  }

  // Get specific template
  getTemplate(templateId) {
    return this.templates[templateId] || null;
  }

  // Switch to a different template
  switchTemplate(templateId) {
    if (this.templates[templateId]) {
      this.currentTemplate = templateId;
      return true;
    }
    return false;
  }

  // Get current template
  getCurrentTemplate() {
    return {
      id: this.currentTemplate,
      ...this.templates[this.currentTemplate]
    };
  }

  // Preview template with resume data
  previewTemplate(templateId, resumeData) {
    const template = this.getTemplate(templateId);
    if (!template) return null;

    // Build HTML based on template
    return this.buildTemplateHTML(templateId, template, resumeData);
  }

  buildTemplateHTML(templateId, template, resumeData) {
    const { primary, secondary } = template.colors;
    
    let html = `<div class="resume-${templateId}" style="background-color: ${secondary}; color: #333;">`;
    
    // Header
    html += `<div class="resume-header" style="background-color: ${primary}; color: white; padding: 30px;">`;
    html += `<h1>${resumeData.fullName || 'Your Name'}</h1>`;
    html += `<p>${resumeData.email || ''} | ${resumeData.phone || ''} | ${resumeData.location || ''}</p>`;
    html += `</div>`;

    // Content
    html += `<div class="resume-content" style="padding: 30px;">`;
    
    // Professional Summary
    if (resumeData.summary) {
      html += `<section>`;
      html += `<h2 style="border-bottom: 2px solid ${primary}; color: ${primary};">Professional Summary</h2>`;
      html += `<p>${resumeData.summary}</p>`;
      html += `</section>`;
    }

    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      html += `<section>`;
      html += `<h2 style="border-bottom: 2px solid ${primary}; color: ${primary};">Work Experience</h2>`;
      resumeData.experience.forEach(exp => {
        html += `<div style="margin-bottom: 20px;">`;
        html += `<h3>${exp.title}</h3>`;
        html += `<p style="color: #666;"><strong>${exp.company}</strong> | ${exp.start} to ${exp.end || 'Present'}</p>`;
        html += `<p>${exp.description}</p>`;
        html += `</div>`;
      });
      html += `</section>`;
    }

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      html += `<section>`;
      html += `<h2 style="border-bottom: 2px solid ${primary}; color: ${primary};">Education</h2>`;
      resumeData.education.forEach(edu => {
        html += `<div style="margin-bottom: 15px;">`;
        html += `<h3>${edu.degree}</h3>`;
        html += `<p style="color: #666;"><strong>${edu.institution}</strong> | ${edu.date}</p>`;
        html += `</div>`;
      });
      html += `</section>`;
    }

    // Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      html += `<section>`;
      html += `<h2 style="border-bottom: 2px solid ${primary}; color: ${primary};">Skills</h2>`;
      html += `<p>${resumeData.skills.join(', ')}</p>`;
      html += `</section>`;
    }

    html += `</div></div>`;
    return html;
  }

  // Export resume in specific template format
  exportTemplate(templateId, resumeData, format = 'html') {
    const html = this.previewTemplate(templateId, resumeData);
    
    if (format === 'html') {
      return html;
    } else if (format === 'pdf') {
      // Would integrate with jsPDF or similar
      console.log('PDF export requires jsPDF library');
      return html;
    }
    return html;
  }

  // Get template recommendations based on industry
  getRecommendedTemplate(industry) {
    const recommendations = {
      'tech': 'techie',
      'finance': 'professional',
      'creative': 'creative',
      'executive': 'executive',
      'startup': 'modern',
      'default': 'modern'
    };
    
    const industryKey = industry?.toLowerCase() || 'default';
    return recommendations[industryKey] || recommendations['default'];
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TemplateManager;
}
