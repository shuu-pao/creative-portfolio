// Chat dialogue data for the CHAT WITH AI section (a separate experience from
// the static ABOUT ME page). The bot opens with a greeting + selectable options;
// users can also type free-text, which ChatAppAboutMe maps to the closest option
// by keyword (see FREETEXT_KEYWORDS there). CTA replies navigate to other
// portfolio sections via `onNavigate`.
export const BOT_OPENING = "Hey! I'm the AI running this portfolio — think of me as your guide. Tap a topic below and I'll tell you about Paolo's story, work, skills, projects, or how to reach him.";

// User selectable options (shown as buttons)
export const USER_OPTIONS = [
  {
    id: 'story',
    label: "What's your story?",
    botResponse: {
      text: `Comp Eng grad from University of San Carlos, Cebu — walked the stage July 2026. I got into tech because I like building things that actually work the way they're supposed to — systems, not just scripts. Design something well from the start and you spend a lot less time firefighting later.

This portfolio itself is one of those builds — a full turn-based RPG battle system, built from scratch with React and Vite. You're standing in it right now.`,
      cta: null,
    },
  },
  {
    id: 'work',
    label: "What kind of work do you do?",
    botResponse: {
      text: `I spent 540 hours at Accenture developing on Salesforce Agentforce. My work covered agent actions, JSON schema compliance, and knowledge management workflows and dashboards — across both Contact Center and Knowledge Management projects.

There's a full breakdown on the experience page if you want the details.`,
      cta: {
        label: "See the full experience →",
        target: 'professional',
      },
    },
  },
  {
    id: 'skills',
    label: "What are your skills?",
    botResponse: {
      text: `Mostly Salesforce Agentforce — agent actions, Flow logic, and Agent Instructions — plus the languages and web tools around it: JavaScript, Python, React, SQL. I also have embedded-systems and AI/ML exposure from my degree and side projects.

I keep a categorized list on the Skills page if you want the full toolkit.`,
      cta: {
        label: "See my skills →",
        target: 'skills',
      },
    },
  },
  {
    id: 'projects',
    label: "What have you built?",
    botResponse: {
      text: `The site you're on is one — a from-scratch React/Vite turn-based battle system. Beyond that, I've built an Agentforce case-lifecycle assistant and a set of embedded-systems lab projects (sensors, real-time control, low-level C).

The Personal Projects page walks through them.`,
      cta: {
        label: "Check out my projects →",
        target: 'projects',
      },
    },
  },
  {
    id: 'education',
    label: "Where'd you study?",
    botResponse: {
      text: `University of San Carlos, Cebu City — BS Computer Engineering. The biggest thing I took from it wasn't a specific class, it was learning to understand systems from first principles instead of just memorizing patterns. That's carried directly into how I approach building software.`,
      cta: {
        label: "Check out my education →",
        target: 'education',
      },
    },
  },
  {
    id: 'availability',
    label: "Are you available for work?",
    botResponse: {
      text: `I'm actively looking for opportunities right now, so — good timing. I'm especially interested in roles around Salesforce, Agentforce, or building smart customer-experience tooling.

Fastest way to reach me is email or LinkedIn, both linked on the contact page.`,
      cta: {
        label: "Go to contact info →",
        target: 'contact',
      },
    },
  },
  {
    id: 'contact',
    label: "How do I get in touch?",
    botResponse: {
      text: `I'm actively looking for opportunities right now, so — good timing. Fastest way to reach me is email or LinkedIn, both linked on the contact page. Always happy to talk Salesforce, Agentforce, or the engineering behind this portfolio.`,
      cta: {
        label: "Go to contact info →",
        target: 'contact',
      },
    },
  },
];

// Wrap-up message shown after all options have been visited at least once
export const BOT_WRAPUP = "That's the full rundown from me. Feel free to revisit anything, or head to the contact page — I'd genuinely like to hear from you.";

// Restart button label
export const RESTART_LABEL = "Restart conversation";

// Bot name for display
export const BOT_NAME = "PORTFOLIO AI";

// User name for display (the site visitor)
export const USER_NAME = "YOU";
