// Cover Letter Builder - AI-Powered Letter Generator
// Features from resume.com implementation

class CoverLetterBuilder {
  constructor() {
    this.templates = this.initializeTemplates();
    this.coverLetterData = {};
  }

  initializeTemplates() {
    return {
      professional: `Dear Hiring Manager,

I am writing to express my strong interest in the [POSITION] role at [COMPANY]. With my [YEARS] years of experience in [INDUSTRY], I have developed a strong foundation in [KEY_SKILLS] and a passion for driving results.

In my current role at [CURRENT_COMPANY], I have successfully [ACHIEVEMENT_1]. Additionally, I spearheaded [ACHIEVEMENT_2], which resulted in [MEASURABLE_RESULT]. These experiences have equipped me with the expertise to contribute meaningfully to your team.

Your company's commitment to [COMPANY_VALUE] aligns perfectly with my professional values. I am excited about the opportunity to bring my skills, dedication, and enthusiasm to [COMPANY].

Thank you for considering my application. I look forward to discussing how I can add value to your organization.

Sincerely,
[YOUR_NAME]`,

      creative: `Hello [HIRING_MANAGER_NAME],

I'm reaching out because [COMPANY] caught my attention for [SPECIFIC_REASON]. As a [JOB_TITLE] with a track record of [MAJOR_ACHIEVEMENT], I believe I can make a meaningful impact on your team.

What sets me apart is my combination of [SKILL_1] and [SKILL_2]. During my time at [COMPANY_NAME], I transformed [PROJECT/INITIATIVE] into [POSITIVE_RESULT], demonstrating my ability to [CORE_COMPETENCY].

I'm genuinely excited about the possibility of contributing to [COMPANY]'s mission of [COMPANY_MISSION]. I'd love to discuss how my background aligns with your needs.

Looking forward to speaking with you soon!

Best regards,
[YOUR_NAME]`,

      technical: `Dear [HIRING_MANAGER_NAME],

I am writing to apply for the [POSITION] role at [COMPANY]. As a [CURRENT_ROLE] with expertise in [TECHNICAL_STACK], I am confident in my ability to contribute to your technical initiatives.

Key accomplishments include:
- Implemented [TECHNICAL_PROJECT_1] using [TECHNOLOGY], improving [METRIC] by [PERCENTAGE]
- Led development of [TECHNICAL_PROJECT_2], reducing [ISSUE] by [AMOUNT]
- Architected solutions for [TECHNICAL_CHALLENGE], resulting in [BUSINESS_OUTCOME]

My technical proficiency, combined with my problem-solving mindset, positions me as an ideal candidate for your team. I am eager to bring my skills to [COMPANY].

Thank you for your consideration.

Sincerely,
[YOUR_NAME]`
    };
  }

  // AI-powered suggestion for cover letter improvements
  getAISuggestions(coverLetterText, jobTitle, company) {
    const suggestions = [
      { type: 'keyword', text: `Consider mentioning skills from ${jobTitle}`, priority: 'high' },
      { type: 'personalization', text: `Reference ${company}'s specific projects or values`, priority: 'high' },
      { type: 'action', text: 'Start sentences with strong action verbs (Led, Developed, Implemented)', priority: 'medium' },
      { type: 'impact', text: 'Quantify achievements with metrics (e.g., increased by 50%)', priority: 'high' },
      { type: 'tone', text: 'Maintain professional yet personable tone throughout', priority: 'medium' }
    ];
    return suggestions;
  }

  // Generate AI-powered cover letter
  generateWithAI(userData) {
    const { fullName, email, phone, currentCompany, position, desiredPosition, desiredCompany, keyAchievements, skills } = userData;
    
    let aiLetter = this.templates.professional;
    
    // Smart replacements
    const replacements = {
      '[YOUR_NAME]': fullName,
      '[POSITION]': desiredPosition,
      '[COMPANY]': desiredCompany,
      '[CURRENT_COMPANY]': currentCompany,
      '[YEARS]': this.calculateYearsExperience(userData),
      '[KEY_SKILLS]': skills ? skills.slice(0, 3).join(', ') : 'professional development',
      '[ACHIEVEMENT_1]': keyAchievements?.[0] || 'successfully delivered key projects',
      '[ACHIEVEMENT_2]': keyAchievements?.[1] || 'led cross-functional initiatives',
      '[MEASURABLE_RESULT]': 'significant business value',
      '[COMPANY_VALUE]': 'innovation and excellence',
      '[HIRING_MANAGER_NAME]': 'Hiring Manager'
    };
    
    Object.keys(replacements).forEach(key => {
      aiLetter = aiLetter.replace(new RegExp(key, 'g'), replacements[key]);
    });
    
    return aiLetter;
  }

  calculateYearsExperience(userData) {
    if (userData.experience && userData.experience.length > 0) {
      const totalMonths = userData.experience.reduce((sum, exp) => {
        const startDate = new Date(exp.start);
        const endDate = new Date(exp.end || new Date());
        return sum + ((endDate - startDate) / (1000 * 60 * 60 * 24 * 365.25));
      }, 0);
      return Math.round(totalMonths * 10) / 10;
    }
    return 5;
  }

  // Template switching
  switchTemplate(templateName, userData) {
    if (!this.templates[templateName]) {
      return 'Template not found';
    }
    return this.generateWithAI({ ...userData, template: templateName });
  }

  // Tips for writing better cover letters
  getTips() {
    return [
      'Research the company thoroughly and mention specific projects or values',
      'Use the hiring manager\'s name if possible for personalization',
      'Highlight relevant skills that match the job description',
      'Show enthusiasm for the role and company',
      'Quantify your achievements with metrics and results',
      'Keep it concise - aim for 3-4 paragraphs',
      'Proofread for grammar and spelling errors',
      'Use professional language while showing personality',
      'End with a clear call-to-action',
      'Format properly with your contact info at the top'
    ];
  }

  // Download cover letter
  downloadCoverLetter(text, filename = 'CoverLetter.txt') {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CoverLetterBuilder;
}
