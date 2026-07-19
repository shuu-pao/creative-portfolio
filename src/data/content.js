export const aboutText = [
  'Computer Engineering graduate with hands-on Salesforce Agentforce development experience from a 540-hour Accenture internship, where I streamlined enterprise case management, optimized workflow automation, and strengthened knowledge base management to improve customer service operations.',
  'Skilled in configuring agent actions, Flow logic, and Agent Instructions to deliver scalable, reliable AI-driven support systems.',
  'During my internship, I contributed to the Agentforce Contact Center and Knowledge Center, engineering advanced case lifecycle actions, automating account workflows, and analyzing knowledge article trends to guide content improvements. These contributions enhanced efficiency and reliability in enterprise support environments.',
  'Beyond Salesforce, I bring exposure to AI/ML workflows, embedded systems, and full-stack development, with a proven ability to redesign inefficient logic and resolve systemic bottlenecks. Known for a fast learning curve and problem-solving mindset, I aim to drive measurable improvements in automation, enterprise AI agent deployments, and intelligent customer experience solutions.',
]

export const educationText = [
  'SCHOOL: University of San Carlos',
  'DEGREE: Bachelor of Science in Computer Engineering',
  'DURATION: 2021 - Jul 2026',
]

export const contactLinks = [
  { label: 'GitHub', href: 'https://github.com/shuu-pao' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/paolo-jansen-enrera/' },
  { label: 'Instagram', href: 'https://www.instagram.com/shuu_paoo/' },
]

// Structured body for the PROFESSIONAL EXPERIENCE section. Rendered as a job
// card in ContentScreen (role header + summary + categorized bullet sections).
export const professionalExperience = {
  role: 'Agentforce Developer Intern',
  company: 'Accenture',
  duration: 'Jan 2026 – Apr 2026',
  location: 'Cebu City, Philippines',
  summary:
    'Built and refined AI-driven customer service automation on the Salesforce Agentforce platform during a 540-hour internship, streamlining case management and strengthening knowledge base operations to improve enterprise support efficiency and reliability.',
  sections: [
    {
      title: 'Agent Action Development',
      points: [
        'Engineered advanced Agentforce actions covering the full case lifecycle — creation, follow-up, and closure — plus customer account workflows.',
        'Automated knowledge article auto-attachment, customer verification, case auto-summaries, and structured closure requirements (mandatory reason for closure and required article association).',
        'Extended automation to account management: billing email updates, payment plan creation, and automated delivery of billing history via email.',
      ],
    },
    {
      title: 'Instruction Debugging & Refinement',
      points: [
        'Diagnosed systemic flaws in live agent behavior, rewriting instruction logic to eliminate incorrect topic and action selection.',
        'Strengthened workflow reliability by addressing root-cause issues rather than surface-level errors.',
      ],
    },
    {
      title: 'Knowledge Base & Analytics',
      points: [
        'Analyzed trends in knowledge article usage, spotlighting the most- and least-associated articles.',
        'Used these insights to guide content-quality improvements, enabling smoother case closure and boosting agent efficiency.',
      ],
    },
    {
      title: 'Multi-Agent Configuration & QA',
      points: [
        'Configured distinct Flow logic and Agent Instructions for Console (internal) vs. Portal (customer-facing) agents, tailoring behavior to each scenario.',
        'Authored test scenarios and led end-to-end QA, ensuring robust performance across both environments.',
      ],
    },
  ],
}
