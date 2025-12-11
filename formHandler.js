// Form Handler and Validation Module
// Automated data validation and processing

class FormValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
  }

  validateForm(resumeData) {
    this.errors = [];
    this.warnings = [];

    // Required fields
    if (!resumeData.fullName || resumeData.fullName.trim() === '') {
      this.errors.push('Full name is required');
    }

    if (!resumeData.email || !this.validateEmail(resumeData.email)) {
      this.errors.push('Valid email is required');
    }

    // Warnings
    if (!resumeData.phone || resumeData.phone.trim() === '') {
      this.warnings.push('Phone number is recommended for better ATS compatibility');
    }

    if (!resumeData.summary || resumeData.summary.length < 50) {
      this.warnings.push('Professional summary should be at least 50 characters');
    }

    if (!resumeData.experience || resumeData.experience.length === 0) {
      this.warnings.push('Adding work experience improves resume effectiveness');
    }

    if (!resumeData.skills || resumeData.skills.length < 5) {
      this.warnings.push('Consider adding more skills (at least 5 recommended)');
    }

    return this.errors.length === 0;
  }

  getErrors() {
    return this.errors;
  }

  getWarnings() {
    return this.warnings;
  }
}

// Form Auto-filler (uses GitHub API for optional data enrichment)
class FormAutoFiller {
  constructor(githubToken = null) {
    this.githubToken = githubToken;
  }

  // Try to fetch GitHub user data (free API)
  async fetchGitHubData(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) throw new Error('User not found');
      
      const data = await response.json();
      return {
        name: data.name || username,
        email: data.email,
        location: data.location,
        bio: data.bio
      };
    } catch (error) {
      console.error('GitHub API error:', error);
      return null;
    }
  }

  // Auto-populate form from GitHub
  async autofillFromGitHub(username) {
    if (!app) return;
    
    const data = await this.fetchGitHubData(username);
    if (data) {
      if (data.name) document.getElementById('fullName').value = data.name;
      if (data.email) document.getElementById('email').value = data.email;
      if (data.location) document.getElementById('location').value = data.location;
      if (data.bio) document.getElementById('summary').value = data.bio;
      
      app.updatePreview();
      return true;
    }
    return false;
  }

  // Auto-populate form from file upload (JSON format)
  parseJSONResume(jsonData) {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      // Map JSON data to form fields
      if (data.basics) {
        if (data.basics.name) document.getElementById('fullName').value = data.basics.name;
        if (data.basics.email) document.getElementById('email').value = data.basics.email;
        if (data.basics.phone) document.getElementById('phone').value = data.basics.phone;
        if (data.basics.location) {
          const loc = data.basics.location;
          document.getElementById('location').value = 
            `${loc.city || ''}, ${loc.region || ''}, ${loc.countryCode || ''}`.replace(/,\s*$/, '');
        }
        if (data.basics.summary) document.getElementById('summary').value = data.basics.summary;
      }
      
      // Parse work experience
      if (data.work && Array.isArray(data.work)) {
        const container = document.getElementById('experienceContainer');
        container.innerHTML = '';
        data.work.forEach((job, i) => {
          app.addExperienceField();
          document.querySelector(`.exp-title[data-index="${i}"]`).value = job.position || '';
          document.querySelector(`.exp-company[data-index="${i}"]`).value = job.name || '';
          if (job.startDate) document.querySelector(`.exp-start[data-index="${i}"]`).value = job.startDate;
          if (job.endDate) document.querySelector(`.exp-end[data-index="${i}"]`).value = job.endDate;
          document.querySelector(`.exp-desc[data-index="${i}"]`).value = job.summary || '';
        });
      }
      
      // Parse education
      if (data.education && Array.isArray(data.education)) {
        const container = document.getElementById('educationContainer');
        container.innerHTML = '';
        data.education.forEach((edu, i) => {
          app.addEducationField();
          document.querySelector(`.edu-degree[data-index="${i}"]`).value = edu.studyType + ' ' + edu.area;
          document.querySelector(`.edu-institution[data-index="${i}"]`).value = edu.institution || '';
          if (edu.endDate) document.querySelector(`.edu-date[data-index="${i}"]`).value = edu.endDate;
        });
      }
      
      // Parse skills
      if (data.skills && Array.isArray(data.skills)) {
        const skillNames = data.skills.map(s => s.name || s).join(', ');
        document.getElementById('skills').value = skillNames;
      }
      
      app.updatePreview();
      return true;
    } catch (error) {
      console.error('JSON parsing error:', error);
      return false;
    }
  }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FormValidator, FormAutoFiller };
}
