// ── ABOUT ME (static page) ──
// This is the standalone ABOUT ME page. The conversational "AI guide" lives in
// its own CHAT WITH AI section (see ChatAppAboutMe) — the two are intentionally
// separate so visitors can either read a quick summary or chat with the bot.
export const aboutInfo = {
  intro: [
    'Computer Engineering graduate with hands-on Salesforce Agentforce development experience from a 540-hour Accenture internship, where I streamlined enterprise case management, optimized workflow automation, and strengthened knowledge base management to improve customer service operations.',
    'Skilled in configuring agent actions, Flow logic, and Agent Instructions to deliver scalable, reliable AI-driven support systems.',
    'Beyond Salesforce, I bring exposure to AI/ML workflows, embedded systems, and full-stack development, with a proven ability to redesign inefficient logic and resolve systemic bottlenecks. I aim to drive measurable improvements in automation, enterprise AI agent deployments, and intelligent customer experience solutions.',
  ],
  highlights: [
    'Salesforce Agentforce — agent actions, Flow logic, Agent Instructions',
    'AI/ML workflows & enterprise support automation',
    'Embedded systems & full-stack development',
    'Systems-first mindset: fix root causes, not symptoms',
  ],
}

// ── EDUCATION (redesigned credential card) ──
export const educationInfo = {
  school: 'University of San Carlos',
  degree: 'Bachelor of Science in Computer Engineering',
  duration: '2021 – Jul 2026',
  location: 'Cebu City, Philippines',
  highlights: [
    'Learned to understand systems from first principles rather than memorize patterns — the same approach I bring to building software.',
    'Lab and capstone work across embedded systems, circuits, and software engineering.',
    'Built this very portfolio: a from-scratch React + Vite turn-based battle system.',
  ],
}

// ── CONTACT (redesigned) ──
// `resumeHref` is left empty on purpose — drop in a PDF path (e.g.
// '/Paolo-Enrera-Resume.pdf' in public/) and the download button appears.
export const contactInfo = {
  blurb:
    "I'm actively looking for new opportunities, so timing is great. The fastest way to reach me is email or LinkedIn — I'm always happy to talk Salesforce, Agentforce, or the engineering behind this site.",
  resumeHref: '',
  links: [
    { label: 'GitHub', href: 'https://github.com/shuu-pao' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/paolo-jansen-enrera/' },
    { label: 'Instagram', href: 'https://www.instagram.com/shuu_paoo/' },
  ],
}

// ── SKILLS ──
export const skillsInfo = {
  intro: 'A snapshot of the tools and stacks I reach for most. Grouped by where they show up in my work.',
  categories: [
    {
      title: 'Salesforce / Agentforce',
      items: ['Agent Actions', 'Flow Logic', 'Agent Instructions', 'Knowledge Base Ops', 'Case Lifecycle', 'JSON Schema'],
    },
    {
      title: 'Languages',
      items: ['JavaScript', 'Python', 'SQL', 'Java', 'C / C++'],
    },
    {
      title: 'Web & Frontend',
      items: ['React', 'Vite', 'HTML / CSS', 'REST APIs', 'TypeScript'],
    },
    {
      title: 'AI / ML & Tooling',
      items: ['LLM Workflows', 'Git', 'Figma', 'Agile / Scrum', 'Embedded Systems'],
    },
  ],
}

// ── PERSONAL PROJECTS ──
export const projectsInfo = {
  intro: 'Things I’ve built on my own time. (The site you’re on is one of them.)',
  projects: [
    {
      name: 'PortfolioMon',
      blurb:
        'This portfolio — a full turn-based RPG battle system built from scratch with React and Vite. You’re standing inside it right now.',
      tech: ['React', 'Vite', 'JavaScript', 'CSS'],
      href: '',
    },
  ],
}

// ── PROFESSIONAL EXPERIENCE (unchanged structure) ──
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
