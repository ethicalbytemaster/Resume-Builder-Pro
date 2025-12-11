// GitHub Database Integration
// Use GitHub as a cloud database for Resume Builder Pro
// Supports: Save, Load, Sync, and Share resumes via GitHub

class GitHubDatabase {
  constructor(githubToken = null, owner = null, repo = null) {
    this.githubToken = githubToken || localStorage.getItem('github_token');
    this.owner = owner || localStorage.getItem('github_owner');
    this.repo = repo || 'Resume-Builder-Pro-Data';
    this.apiBaseUrl = 'https://api.github.com';
    this.dataFolder = 'resumes';
  }

  // Authenticate with GitHub token
  setToken(token) {
    this.githubToken = token;
    localStorage.setItem('github_token', token);
  }

  // Set GitHub owner (username)
  setOwner(owner) {
    this.owner = owner;
    localStorage.setItem('github_owner', owner);
  }

  // Check authentication status
  isAuthenticated() {
    return !!(this.githubToken && this.owner);
  }

  // Create data repository
  async createRepository() {
    if (!this.isAuthenticated()) return false;

    try {
      const response = await fetch(`${this.apiBaseUrl}/user/repos`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.repo,
          description: 'Cloud storage for Resume Builder Pro resumes',
          private: true,
          auto_init: true
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Error creating repository:', error);
      return false;
    }
  }

  // Save resume to GitHub
  async saveResume(resumeData, filename = 'resume.json') {
    if (!this.isAuthenticated()) return false;

    try {
      const content = JSON.stringify(resumeData, null, 2);
      const encodedContent = btoa(content);
      const path = `${this.dataFolder}/${filename}`;
      const url = `${this.apiBaseUrl}/repos/${this.owner}/${this.repo}/contents/${path}`;

      let sha = null;
      try {
        const getResponse = await fetch(url, {
          headers: { 'Authorization': `token ${this.githubToken}` }
        });
        if (getResponse.ok) {
          const data = await getResponse.json();
          sha = data.sha;
        }
      } catch (e) {}

      const putResponse = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Save resume: ${filename}`,
          content: encodedContent,
          sha: sha
        })
      });

      return putResponse.ok;
    } catch (error) {
      console.error('Error saving resume:', error);
      return false;
    }
  }

  // Load resume from GitHub
  async loadResume(filename = 'resume.json') {
    if (!this.isAuthenticated()) return null;

    try {
      const path = `${this.dataFolder}/${filename}`;
      const url = `${this.apiBaseUrl}/repos/${this.owner}/${this.repo}/contents/${path}`;

      const response = await fetch(url, {
        headers: { 'Authorization': `token ${this.githubToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        const content = atob(data.content);
        return JSON.parse(content);
      }
      return null;
    } catch (error) {
      console.error('Error loading resume:', error);
      return null;
    }
  }

  // List all resumes
  async listResumes() {
    if (!this.isAuthenticated()) return [];

    try {
      const url = `${this.apiBaseUrl}/repos/${this.owner}/${this.repo}/contents/${this.dataFolder}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `token ${this.githubToken}` }
      });

      if (response.ok) {
        const files = await response.json();
        return files.filter(f => f.name.endsWith('.json')).map(f => ({
          name: f.name,
          size: f.size
        }));
      }
      return [];
    } catch (error) {
      console.error('Error listing resumes:', error);
      return [];
    }
  }

  // Sync with GitHub (bidirectional)
  async sync(localResume) {
    const remote = await this.loadResume();
    
    if (!remote) {
      await this.saveResume(localResume);
      return localResume;
    }

    const localTime = new Date(localResume.updatedAt).getTime();
    const remoteTime = new Date(remote.updatedAt).getTime();

    if (localTime >= remoteTime) {
      await this.saveResume(localResume);
      return localResume;
    }
    return remote;
  }

  // Generate shareable link
  async shareResume(filename = 'resume.json') {
    return {
      viewUrl: `https://github.com/${this.owner}/${this.repo}/blob/main/resumes/${filename}`,
      rawUrl: `https://raw.githubusercontent.com/${this.owner}/${this.repo}/main/resumes/${filename}`
    };
  }

  // Get storage statistics
  async getStats() {
    try {
      const resumes = await this.listResumes();
      const totalSize = resumes.reduce((sum, r) => sum + r.size, 0);
      return {
        count: resumes.length,
        totalSizeKB: (totalSize / 1024).toFixed(2),
        resumes: resumes
      };
    } catch (error) {
      return null;
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GitHubDatabase;
}
