// Resume Generator - ATS Format Handler
// Handles PDF generation and ATS optimization

class ATSResumeFormatter {
  constructor() {
    this.atsKeywords = [
      'automated', 'managed', 'developed', 'led', 'improved',
      'increased', 'reduced', 'achieved', 'collaborated', 'implemented'
    ];
  }

  // Format resume for ATS compatibility
  formatForATS(resumeData) {
    let atsText = '';
    
    // Header with contact info (simple formatting for ATS)
    atsText += resumeData.fullName.toUpperCase() + '\n';
    atsText += '---\n';
    
    const contact = [];
    if (resumeData.email) contact.push(resumeData.email);
    if (resumeData.phone) contact.push(resumeData.phone);
    if (resumeData.location) contact.push(resumeData.location);
    
    atsText += contact.join(' | ') + '\n\n';
    
    // Professional Summary
    if (resumeData.summary) {
      atsText += 'PROFESSIONAL SUMMARY\n';
      atsText += '---\n';
      atsText += this.optimizeText(resumeData.summary) + '\n\n';
    }
    
    // Work Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      atsText += 'WORK EXPERIENCE\n';
      atsText += '---\n';
      resumeData.experience.forEach(exp => {
        atsText += exp.title.toUpperCase() + '\n';
        atsText += 'Company: ' + exp.company + '\n';
        if (exp.start) {
          atsText += 'Duration: ' + exp.start + ' to ' + (exp.end || 'Present') + '\n';
        }
        if (exp.description) {
          atsText += this.optimizeText(exp.description) + '\n';
        }
        atsText += '\n';
      });
      atsText += '\n';
    }
    
    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      atsText += 'EDUCATION\n';
      atsText += '---\n';
      resumeData.education.forEach(edu => {
        atsText += edu.degree.toUpperCase() + '\n';
        atsText += 'Institution: ' + edu.institution + '\n';
        if (edu.date) {
          atsText += 'Graduation: ' + edu.date + '\n';
        }
        atsText += '\n';
      });
      atsText += '\n';
    }
    
    // Skills (critical for ATS)
    if (resumeData.skills && resumeData.skills.length > 0) {
      atsText += 'SKILLS\n';
      atsText += '---\n';
      atsText += resumeData.skills.join(', ') + '\n\n';
    }
    
    // Certifications
    if (resumeData.certifications && resumeData.certifications.length > 0) {
      atsText += 'CERTIFICATIONS\n';
      atsText += '---\n';
      resumeData.certifications.forEach(cert => {
        atsText += cert.name + ' - ' + cert.organization + '\n';
      });
    }
    
    return atsText;
  }

  // Optimize text for ATS (add action verbs, keywords)
  optimizeText(text) {
    let optimized = text;
    
    // Replace passive voice with action verbs where possible
    const replacements = {
      'was responsible for': 'managed',
      'was involved in': 'contributed to',
      'helped to': 'assisted in',
      'worked on': 'developed',
      'worked with': 'collaborated with'
    };
    
    Object.keys(replacements).forEach(key => {
      const regex = new RegExp(key, 'gi');
      optimized = optimized.replace(regex, replacements[key]);
    });
    
    return optimized;
  }

  // Calculate resume score based on ATS compatibility
  calculateATSScore(resumeData) {
    let score = 0;
    const maxScore = 100;
    
    // Check for essential information (40 points)
    if (resumeData.fullName) score += 5;
    if (resumeData.email) score += 5;
    if (resumeData.phone) score += 5;
    if (resumeData.location) score += 5;
    if (resumeData.summary && resumeData.summary.length > 50) score += 10;
    if (resumeData.skills && resumeData.skills.length >= 5) score += 5;
    
    // Check for work experience (30 points)
    if (resumeData.experience && resumeData.experience.length > 0) score += 15;
    resumeData.experience.forEach(exp => {
      if (exp.description && exp.description.length > 30) score += 5;
    });
    
    // Check for education (20 points)
    if (resumeData.education && resumeData.education.length > 0) score += 20;
    
    // Check for certifications (10 points)
    if (resumeData.certifications && resumeData.certifications.length > 0) score += 10;
    
    return Math.min(score, maxScore);
  }

  // Generate PDF (placeholder - requires jsPDF library)
  generatePDF(resumeData, filename = 'Resume.pdf') {
    // This function requires jsPDF library to be included
    if (typeof jsPDF === 'undefined') {
      console.error('jsPDF library not loaded. Add: <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>');
      return false;
    }

    try {
      const doc = new jsPDF();
      const atsContent = this.formatForATS(resumeData);
      
      doc.setFontSize(14);
      doc.text(resumeData.fullName.toUpperCase(), 10, 10);
      
      doc.setFontSize(10);
      let yPosition = 25;
      const lines = atsContent.split('\n');
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const maxWidth = doc.internal.pageSize.getWidth() - (margin * 2);
      
      lines.forEach(line => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        
        if (line === '---') {
          yPosition += 2;
        } else if (line.trim()) {
          const wrappedText = doc.splitTextToSize(line, maxWidth);
          doc.text(wrappedText, margin, yPosition);
          yPosition += wrappedText.length * 5 + 2;
        } else {
          yPosition += 3;
        }
      });
      
      doc.save(filename);
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    }
  }
}

// Extend the ResumeBuilder class with PDF functionality
if (typeof ResumeBuilder !== 'undefined') {
  const originalDownloadPDF = ResumeBuilder.prototype.downloadPDF;
  
  ResumeBuilder.prototype.downloadPDF = function() {
    const formatter = new ATSResumeFormatter();
    const score = formatter.calculateATSScore(this.resumeData);
    
    console.log('Resume ATS Score: ' + score + '%');
    
    // Try to generate PDF
    const success = formatter.generatePDF(this.resumeData, `${this.resumeData.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
    
    if (!success) {
      // Fallback: download as text
      const atsContent = formatter.formatForATS(this.resumeData);
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(atsContent));
      element.setAttribute('download', 'Resume.txt');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      alert('Resume downloaded as text file. For PDF, include jsPDF library.');
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ATSResumeFormatter;
}
