// AI Assistant - Intelligent Resume Optimization Engine
// UPGRADED: Advanced AI suggestions, industry-specific improvements, real-time feedback

class AIAssistant {
  constructor() {
    this.industryKeywords = {
      'tech': ['JavaScript', 'Python', 'React', 'Node.js', 'API', 'Database', 'Cloud', 'DevOps'],
      'finance': ['Excel', 'Financial Analysis', 'Reporting', 'Compliance', 'Forecasting', 'Risk Management'],
      'marketing': ['SEO', 'Analytics', 'Campaign', 'Brand', 'Social Media', 'ROI', 'Lead Generation'],
      'healthcare': ['Patient Care', 'Clinical', 'Medical', 'Diagnosis', 'Treatment', 'Healthcare IT'],
      'sales': ['CRM', 'Pipeline', 'Negotiation', 'Client Relations', 'Forecasting', 'Revenue']
    };
    this.actionVerbs = [
      'Achieved', 'Managed', 'Developed', 'Led', 'Improved', 'Increased', 'Reduced',
      'Implemented', 'Created', 'Designed', 'Analyzed', 'Coordinated', 'Optimized', 'Streamlined'
    ];
  }

  // Provide real-time AI suggestions
  getSuggestions(resumeData, field = null) {
    const suggestions = [];

    // Personal Info
    if (!resumeData.email || !resumeData.phone) {
      suggestions.push({
        type: 'critical',
        field: 'contact',
        message: 'Add email and phone for ATS compatibility',
        priority: 'high'
      });
    }

    // Professional Summary
    if (!resumeData.summary || resumeData.summary.length < 100) {
      suggestions.push({
        type: 'improvement',
        field: 'summary',
        message: 'Expand your professional summary to 100-150 characters for better impact',
        priority: 'high'
      });
    }

    // Experience
    if (resumeData.experience) {
      resumeData.experience.forEach((exp, idx) => {
        if (!exp.description || exp.description.length < 50) {
          suggestions.push({
            type: 'improvement',
            field: `experience[${idx}]`,
            message: 'Add detailed accomplishments using action verbs and metrics',
            priority: 'high'
          });
        }
      });
    }

    // Skills
    if (!resumeData.skills || resumeData.skills.length < 5) {
      suggestions.push({
        type: 'warning',
        field: 'skills',
        message: 'Add at least 5-10 relevant skills for ATS matching',
        priority: 'medium'
      });
    }

    return suggestions;
  }

  // Improve text with better action verbs
  improveJobDescription(text) {
    let improved = text;
    const weakVerbs = {
      'was': 'Successfully',
      'worked on': 'Developed',
      'helped': 'Assisted',
      'did': 'Accomplished',
      'responsible for': 'Managed'
    };

    Object.keys(weakVerbs).forEach(weak => {
      const regex = new RegExp(`\\b${weak}\\b`, 'gi');
      improved = improved.replace(regex, weakVerbs[weak]);
    });

    return improved;
  }

  // Get industry-specific recommendations
  getIndustryRecommendations(industry, resumeData) {
    const keywords = this.industryKeywords[industry.toLowerCase()] || [];
    const recommendations = [];

    keywords.forEach(keyword => {
      const found = JSON.stringify(resumeData).includes(keyword);
      recommendations.push({
        keyword: keyword,
        present: found,
        suggestion: found ? `✓ Good use of "${keyword}"` : `Consider adding "${keyword}" to match ${industry} requirements`
      });
    });

    return recommendations;
  }

  // Analyze resume for gaps
  analyzeGaps(resumeData) {
    const gaps = [];

    if (!resumeData.certifications || resumeData.certifications.length === 0) {
      gaps.push('No certifications listed - add relevant credentials if available');
    }

    if (!resumeData.education || resumeData.education.length === 0) {
      gaps.push('No education history - include your academic background');
    }

    if (resumeData.experience && resumeData.experience.length === 0) {
      gaps.push('No work experience - add your job history or volunteer experience');
    }

    if (!resumeData.location) {
      gaps.push('Missing location - add your city and state for local job matching');
    }

    return gaps;
  }

  // Check for readability
  checkReadability(text) {
    const avgWordLength = text.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / text.split(/\s+/).length;
    const sentenceCount = text.split(/[.!?]+/).length;
    
    return {
      avgWordLength: avgWordLength.toFixed(2),
      sentenceCount: sentenceCount,
      readability: avgWordLength > 6 ? 'Could be more concise' : 'Good readability'
    };
  }

  // Generate AI-powered achievement statements
  generateAchievements(jobTitle, description) {
    const achievements = [];
    const metrics = ['30%', '50%', '100%', '$X', 'X hours', 'X team members'];

    achievements.push(`Led ${jobTitle} initiatives resulting in measurable business impact`);
    achievements.push(`Improved team efficiency in ${jobTitle} role by implementing best practices`);
    achievements.push(`Delivered ${jobTitle} projects on time and within budget`);
    achievements.push(`Mentored team members in ${jobTitle} competencies`);
    achievements.push(`Achieved customer satisfaction rating of 95%+ in ${jobTitle}`);

    return achievements;
  }

  // Smart formatting suggestions
  getFormatSuggestions(resumeData) {
    const suggestions = [];

    if (resumeData.experience && resumeData.experience.length > 10) {
      suggestions.push('Consider focusing on last 10-15 years of experience');
    }

    if (resumeData.skills && resumeData.skills.length > 30) {
      suggestions.push('Limit skills to top 15-20 most relevant for ATS');
    }

    return suggestions;
  }

  // Calculate resume strength
  calculateResumeStrength(resumeData) {
    let strength = 0;
    let maxStrength = 100;

    // Contact info (20 points)
    if (resumeData.fullName) strength += 5;
    if (resumeData.email) strength += 5;
    if (resumeData.phone) strength += 5;
    if (resumeData.location) strength += 5;

    // Content (80 points)
    if (resumeData.summary && resumeData.summary.length > 100) strength += 15;
    if (resumeData.skills && resumeData.skills.length >= 10) strength += 15;
    if (resumeData.experience && resumeData.experience.length > 0) strength += 25;
    if (resumeData.education && resumeData.education.length > 0) strength += 15;
    if (resumeData.certifications && resumeData.certifications.length > 0) strength += 10;

    return {
      score: strength,
      percentage: Math.min((strength / maxStrength) * 100, 100),
      level: strength < 30 ? 'Basic' : strength < 60 ? 'Good' : strength < 80 ? 'Strong' : 'Excellent'
    };
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIAssistant;
}
