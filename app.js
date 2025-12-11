// Resume Builder Pro - Automated System
// Main Application Logic

class ResumeBuilder {
  constructor() {
    this.resumeForm = document.getElementById('resumeForm');
    this.resumePreview = document.getElementById('resumePreview');
    this.downloadBtn = document.getElementById('downloadPDF');
    this.resumeData = {};
    this.initializeEventListeners();
    this.addInitialFields();
  }

  initializeEventListeners() {
    // Form submission
    this.resumeForm.addEventListener('submit', (e) => this.generateResume(e));
    
    // Add buttons
    document.getElementById('addExperience').addEventListener('click', () => this.addExperienceField());
    document.getElementById('addEducation').addEventListener('click', () => this.addEducationField());
    document.getElementById('addCertification').addEventListener('click', () => this.addCertificationField());
    
    // Real-time preview
    this.resumeForm.addEventListener('change', () => this.updatePreview());
    this.resumeForm.addEventListener('input', () => this.updatePreview());
    
    // Download button
    this.downloadBtn.addEventListener('click', () => this.downloadPDF());
  }

  addInitialFields() {
    this.addExperienceField();
    this.addEducationField();
  }

  addExperienceField() {
    const container = document.getElementById('experienceContainer');
    const index = container.children.length;
    
    const html = `
      <div class="form-group" id="exp-${index}">
        <input type="text" placeholder="Job Title" class="exp-title" data-index="${index}">
        <input type="text" placeholder="Company" class="exp-company" data-index="${index}">
        <input type="month" placeholder="Start Date" class="exp-start" data-index="${index}">
        <input type="month" placeholder="End Date" class="exp-end" data-index="${index}">
        <textarea placeholder="Job Description" class="exp-desc" data-index="${index}" rows="2"></textarea>
        <button type="button" onclick="app.removeField('exp-${index}')" class="remove-btn">Remove</button>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  }

  addEducationField() {
    const container = document.getElementById('educationContainer');
    const index = container.children.length;
    
    const html = `
      <div class="form-group" id="edu-${index}">
        <input type="text" placeholder="Degree" class="edu-degree" data-index="${index}">
        <input type="text" placeholder="Institution" class="edu-institution" data-index="${index}">
        <input type="month" placeholder="Graduation" class="edu-date" data-index="${index}">
        <button type="button" onclick="app.removeField('edu-${index}')" class="remove-btn">Remove</button>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  }

  addCertificationField() {
    const container = document.getElementById('certificationsContainer');
    const index = container.children.length;
    
    const html = `
      <div class="form-group" id="cert-${index}">
        <input type="text" placeholder="Certification Name" class="cert-name" data-index="${index}">
        <input type="text" placeholder="Issuing Organization" class="cert-org" data-index="${index}">
        <button type="button" onclick="app.removeField('cert-${index}')" class="remove-btn">Remove</button>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  }

  removeField(id) {
    document.getElementById(id).remove();
    this.updatePreview();
  }

  generateResume(e) {
    e.preventDefault();
    this.collectData();
    this.updatePreview();
    this.downloadBtn.style.display = 'block';
  }

  collectData() {
    // Personal Information
    this.resumeData.fullName = document.getElementById('fullName').value.trim();
    this.resumeData.email = document.getElementById('email').value.trim();
    this.resumeData.phone = this.formatPhone(document.getElementById('phone').value.trim());
    this.resumeData.location = document.getElementById('location').value.trim();
    this.resumeData.summary = document.getElementById('summary').value.trim();
    this.resumeData.skills = this.parseSkills(document.getElementById('skills').value);
    
    // Experience
    this.resumeData.experience = this.collectExperience();
    this.resumeData.education = this.collectEducation();
    this.resumeData.certifications = this.collectCertifications();
  }

  collectExperience() {
    const exp = [];
    const titles = document.querySelectorAll('.exp-title');
    titles.forEach((el, i) => {
      if (el.value.trim()) {
        exp.push({
          title: el.value.trim(),
          company: document.querySelector(`.exp-company[data-index="${i}"]`).value.trim(),
          start: document.querySelector(`.exp-start[data-index="${i}"]`).value,
          end: document.querySelector(`.exp-end[data-index="${i}"]`).value,
          description: document.querySelector(`.exp-desc[data-index="${i}"]`).value.trim()
        });
      }
    });
    return exp;
  }

  collectEducation() {
    const edu = [];
    const degrees = document.querySelectorAll('.edu-degree');
    degrees.forEach((el, i) => {
      if (el.value.trim()) {
        edu.push({
          degree: el.value.trim(),
          institution: document.querySelector(`.edu-institution[data-index="${i}"]`).value.trim(),
          date: document.querySelector(`.edu-date[data-index="${i}"]`).value
        });
      }
    });
    return edu;
  }

  collectCertifications() {
    const cert = [];
    const names = document.querySelectorAll('.cert-name');
    names.forEach((el, i) => {
      if (el.value.trim()) {
        cert.push({
          name: el.value.trim(),
          organization: document.querySelector(`.cert-org[data-index="${i}"]`).value.trim()
        });
      }
    });
    return cert;
  }

  formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    return phone;
  }

  parseSkills(skillsText) {
    return skillsText.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  updatePreview() {
    this.collectData();
    this.resumePreview.innerHTML = this.generateResumeHTML();
  }

  generateResumeHTML() {
    let html = '<div class="resume-header">';
    html += `<div class="resume-name">${this.escapeHtml(this.resumeData.fullName || 'Your Name')}</div>`;
    
    const contact = [];
    if (this.resumeData.email) contact.push(this.resumeData.email);
    if (this.resumeData.phone) contact.push(this.resumeData.phone);
    if (this.resumeData.location) contact.push(this.resumeData.location);
    
    html += `<div class="resume-contact">${contact.join(' | ')}</div></div>`;
    
    // Summary
    if (this.resumeData.summary) {
      html += '<div class="resume-section"><div class="resume-section-title">Professional Summary</div>';
      html += `<p>${this.escapeHtml(this.resumeData.summary)}</p></div>`;
    }
    
    // Experience
    if (this.resumeData.experience.length > 0) {
      html += '<div class="resume-section"><div class="resume-section-title">Work Experience</div>';
      this.resumeData.experience.forEach(exp => {
        html += '<div class="resume-entry">';
        html += `<div class="resume-entry-title">${this.escapeHtml(exp.title)}</div>`;
        html += `<div class="resume-entry-subtitle">${this.escapeHtml(exp.company)}</div>`;
        if (exp.start) {
          html += `<div class="resume-entry-date">${exp.start} to ${exp.end || 'Present'}</div>`;
        }
        if (exp.description) {
          html += `<div class="resume-entry-description">${this.escapeHtml(exp.description)}</div>`;
        }
        html += '</div>';
      });
      html += '</div>';
    }
    
    // Education
    if (this.resumeData.education.length > 0) {
      html += '<div class="resume-section"><div class="resume-section-title">Education</div>';
      this.resumeData.education.forEach(edu => {
        html += '<div class="resume-entry">';
        html += `<div class="resume-entry-title">${this.escapeHtml(edu.degree)}</div>`;
        html += `<div class="resume-entry-subtitle">${this.escapeHtml(edu.institution)}</div>`;
        if (edu.date) {
          html += `<div class="resume-entry-date">${edu.date}</div>`;
        }
        html += '</div>';
      });
      html += '</div>';
    }
    
    // Skills
    if (this.resumeData.skills.length > 0) {
      html += '<div class="resume-section"><div class="resume-section-title">Skills</div>';
      html += `<p>${this.resumeData.skills.map(s => this.escapeHtml(s)).join(' | ')}</p></div>`;
    }
    
    // Certifications
    if (this.resumeData.certifications.length > 0) {
      html += '<div class="resume-section"><div class="resume-section-title">Certifications</div>';
      this.resumeData.certifications.forEach(cert => {
        html += '<div class="resume-entry">';
        html += `<div class="resume-entry-title">${this.escapeHtml(cert.name)}</div>`;
        html += `<div class="resume-entry-subtitle">${this.escapeHtml(cert.organization)}</div></div>`;
      });
      html += '</div>';
    }
    
    return html || '<p>Start filling the form to generate your resume...</p>';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  downloadPDF() {
    alert('PDF download feature: Integrate with jsPDF library to download the resume as PDF file in ATS format.');
  }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new ResumeBuilder();
  console.log('Resume Builder App Initialized');
});
