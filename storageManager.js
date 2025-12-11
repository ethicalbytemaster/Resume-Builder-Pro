// Storage Manager - Advanced Data Persistence & Version Control
// UPGRADED: Full resume versioning, cloud-ready, and backup systems

class StorageManager {
  constructor() {
    this.storageKey = 'resumeBuilder';
    this.versionsKey = 'resumeVersions';
    this.autoSaveInterval = 30000; // 30 seconds
    this.maxVersions = 20;
    this.initAutoSave();
  }

  // Auto-save functionality
  initAutoSave() {
    if (typeof window !== 'undefined') {
      setInterval(() => this.autoSave(), this.autoSaveInterval);
    }
  }

  // Save current resume
  saveResume(resumeData, title = 'Untitled Resume') {
    try {
      const resume = {
        id: this.generateId(),
        title: title,
        data: resumeData,
        savedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          atsScore: this.calculateATSScore(resumeData),
          wordCount: this.countWords(resumeData),
          completeness: this.calculateCompleteness(resumeData)
        }
      };

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(resume));
      }
      return resume;
    } catch (error) {
      console.error('Error saving resume:', error);
      return null;
    }
  }

  // Auto-save without user action
  autoSave() {
    if (typeof app !== 'undefined' && app.resumeData) {
      this.saveResume(app.resumeData, 'Auto-save');
      console.log('Auto-saved resume at', new Date().toLocaleTimeString());
    }
  }

  // Load resume from storage
  loadResume() {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      return null;
    }
  }

  // Version control - save new version
  saveVersion(resumeData, versionName = '') {
    try {
      const versions = this.getAllVersions() || [];
      const version = {
        id: this.generateId(),
        name: versionName || `Version ${versions.length + 1}`,
        data: resumeData,
        createdAt: new Date().toISOString(),
        atsScore: this.calculateATSScore(resumeData)
      };

      versions.push(version);
      
      // Keep only last N versions
      if (versions.length > this.maxVersions) {
        versions.shift();
      }

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.versionsKey, JSON.stringify(versions));
      }
      return version;
    } catch (error) {
      console.error('Error saving version:', error);
      return null;
    }
  }

  // Get all saved versions
  getAllVersions() {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(this.versionsKey);
        return data ? JSON.parse(data) : [];
      }
    } catch (error) {
      console.error('Error loading versions:', error);
      return [];
    }
  }

  // Restore specific version
  restoreVersion(versionId) {
    const versions = this.getAllVersions();
    const version = versions.find(v => v.id === versionId);
    if (version && typeof app !== 'undefined') {
      this.saveResume(version.data, `Restored: ${version.name}`);
      return version;
    }
    return null;
  }

  // Compare two versions
  compareVersions(versionId1, versionId2) {
    const versions = this.getAllVersions();
    const v1 = versions.find(v => v.id === versionId1);
    const v2 = versions.find(v => v.id === versionId2);

    if (!v1 || !v2) return null;

    return {
      version1: v1.name,
      version2: v2.name,
      differences: this.findDifferences(v1.data, v2.data)
    };
  }

  // Helper: Find differences between two resume objects
  findDifferences(obj1, obj2) {
    const differences = {};
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    allKeys.forEach(key => {
      if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        differences[key] = {
          old: obj1[key],
          new: obj2[key]
        };
      }
    });

    return differences;
  }

  // Export resume data
  exportResume(format = 'json') {
    const resume = this.loadResume();
    if (!resume) return null;

    if (format === 'json') {
      return JSON.stringify(resume, null, 2);
    } else if (format === 'csv') {
      return this.convertToCSV(resume.data);
    }
    return null;
  }

  // Import resume data
  importResume(data, format = 'json') {
    try {
      let parsedData;
      if (format === 'json') {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      }
      
      if (parsedData && parsedData.data) {
        return this.saveResume(parsedData.data, 'Imported Resume');
      }
      return null;
    } catch (error) {
      console.error('Error importing resume:', error);
      return null;
    }
  }

  // Cloud sync (placeholder for future Firebase/API integration)
  syncToCloud(userId, resumeData) {
    console.log('Cloud sync not yet implemented. Ready for Firebase integration.');
    // TODO: Implement cloud storage
    return false;
  }

  // Calculate ATS score
  calculateATSScore(data) {
    let score = 0;
    if (data.fullName) score += 10;
    if (data.email) score += 10;
    if (data.phone) score += 10;
    if (data.summary && data.summary.length > 50) score += 15;
    if (data.skills && data.skills.length >= 5) score += 15;
    if (data.experience && data.experience.length > 0) score += 20;
    if (data.education && data.education.length > 0) score += 10;
    return Math.min(score, 100);
  }

  // Calculate completeness percentage
  calculateCompleteness(data) {
    const requiredFields = ['fullName', 'email', 'phone', 'summary', 'skills', 'experience'];
    let filledFields = 0;

    requiredFields.forEach(field => {
      if (data[field] && (Array.isArray(data[field]) ? data[field].length > 0 : data[field].length > 0)) {
        filledFields++;
      }
    });

    return Math.round((filledFields / requiredFields.length) * 100);
  }

  // Count words in resume
  countWords(data) {
    let text = '';
    ['fullName', 'summary', 'skills'].forEach(field => {
      if (data[field]) text += ' ' + data[field];
    });
    return text.split(/\s+/).length;
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Convert to CSV format
  convertToCSV(data) {
    const csv = [];
    csv.push('Field,Value');
    Object.keys(data).forEach(key => {
      if (!Array.isArray(data[key])) {
        csv.push(`${key},${data[key]}`);
      }
    });
    return csv.join('\n');
  }

  // Clear all data
  clearStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.versionsKey);
      return true;
    }
    return false;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}
