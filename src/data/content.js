// ── ABOUT ME (static page) ──
// This is the standalone ABOUT ME page. The conversational "AI guide" lives in
// its own CHAT WITH AI section (see ChatAppAboutMe) — the two are intentionally
// separate so visitors can either read a quick summary or chat with the bot.
export const aboutInfo = {
  intro: [
    'Computer Engineering graduate who builds at both ends of the stack — enterprise AI agents at Accenture and low-level firmware in the lab. At Accenture I spent 540 hours developing Salesforce Agentforce agents that create, update, and close support cases and automate account-billing workflows for both internal (Console) and customer-facing (Portal) users.',
    'On the hardware side I built a PIC-based futsal scoreboard in embedded C (XC8) with real-time timers and 7-segment displays, and on the applied-AI side I co-developed SMARTBIN 3, an undergraduate thesis that sorts waste with YOLOv8 — where my main contribution was diagnosing a flawed classification approach that had stalled the team for two months and proposing the object-detection redesign that cleared it.',
    'Across all of it, my instinct is to find the root cause before patching symptoms — whether that means rewriting agent instruction logic to stop wrong-action selection, or rethinking a model architecture when training stalls. I am looking for roles where that systems-first habit pays off: Salesforce, Agentforce, or building smarter customer-experience tooling.',
  ],
  highlights: [
    'Salesforce Agentforce — agent actions, Flow logic, Agent Instructions',
    'Embedded systems — PIC/XC8 firmware, real-time control',
    'Applied computer vision — YOLOv8 waste classification (thesis)',
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
    "I'm actively looking for new opportunities, so timing is great. The fastest way to reach me is by email or LinkedIn — you can drop me a line anytime at the address below, or connect through any of the links.",
  email: 'paolo.enrera@gmail.com',
  resumeHref: '/resume/PAOLO_JANSEN_ENRERA_CV_JULY_2026.pdf',
  links: [
    { label: 'EMAIL', href: 'mailto:paolo.enrera@gmail.com' },
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
      items: ['Agentforce Configuration', 'Agentforce Actions', 'Flow Builder', 'Agent Instructions', 'Lightning Knowledge', 'Knowledge-Centered Service (KCS-style practices)', 'Case Management'],
    },
    {
      title: 'Languages',
      items: ['JavaScript', 'C / C++ (Embedded)', 'Python', 'SQL', 'HTML / CSS'],
    },
    {
      title: 'Web & Frontend',
      items: ['React', 'Vite', 'REST APIs'],
    },
    {
      title: 'AI / ML & Tooling',
      items: ['LLM Workflows (Agentforce)', 'Computer Vision (YOLOv8)', 'Git', 'Figma', 'Agile / Scrum'],
    },
  ],
}

// ── PERSONAL PROJECTS ──
export const projectsInfo = {
  intro: 'Builds from my degree and free time — from embedded firmware to applied computer vision. (This portfolio is one of them.)',
  projects: [
    {
      name: 'PortfolioMon',
      blurb:
        'This very portfolio — a full turn-based RPG battle system built from scratch with React and Vite. You’re standing inside it right now.',
      tech: ['React', 'Vite', 'JavaScript', 'CSS'],
      href: '',
    },
    {
      name: 'PIC-Based Futsal Scoreboard',
      blurb:
        'A microcontroller scoreboard written in C (XC8) with real-time match timers and 7-segment display integration — a hands-on embedded-systems lab project.',
      tech: ['C', 'XC8', 'Embedded', 'Microcontrollers'],
      href: '',
    },
    {
      name: 'SMARTBIN 3 (Thesis)',
      blurb:
        'Undergraduate thesis: a deep-learning waste-sorting bin using YOLOv8 for real-time classification with a motorized platform for auto-segregation. My contribution was diagnosing a flawed classification approach that had stalled progress for ~2 months and proposing an object-detection redesign with confidence-score thresholding — which my teammate implemented to clear the training bottleneck. The model reached 98.67% accuracy on standard waste and 92.44% on deformed items (targets: 98% / 80%).',
      tech: ['YOLOv8', 'Computer Vision', 'Python', 'Deep Learning'],
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
    'Developed AI-driven customer-service automation on the Salesforce Agentforce platform during a 540-hour internship, working as part of a team of interns to build agents that create, update, and close support cases and automate account-billing workflows.',
  sections: [
    {
      title: 'Agentforce Agents (Console + Portal)',
      points: [
        'Built customer-service agents that create, update, and close cases from natural-language prompts, for both internal (Console) and customer-facing (Portal) users.',
        'Automated account-billing workflows: changing a billing email, email-code verification, generating monthly billing statements, and creating payment plans.',
        'Configured distinct Flow logic and Agent Instructions per environment so each agent behaved appropriately for internal vs. customer-facing use.',
      ],
    },
    {
      title: 'Salesforce Automation (Flow + Lightning)',
      points: [
        'Used Flow Builder and Lightning components to auto-attach knowledge articles to new cases and surface a case summary on the case page and an account summary on the account page.',
        'Added case-closure requirements (e.g., a mandatory reason for closing) to keep records clean.',
        'Maintained the knowledge base — merging duplicate articles and adding a fallback article that attaches when no other relevant article exists.',
      ],
    },
    {
      title: 'Instruction & Behavior Debugging',
      points: [
        'Diagnosed systemic flaws in live agent behavior and rewrote instruction logic to eliminate incorrect topic and action selection.',
        'Focused on root-cause fixes rather than surface-level patches, improving agent reliability across both environments.',
      ],
    },
    {
      title: 'Knowledge-Base Analytics',
      points: [
        'Added a Salesforce dashboard tracking the most- and least-used knowledge articles to guide content-quality improvements and smoother case closure.',
      ],
    },
  ],
}
