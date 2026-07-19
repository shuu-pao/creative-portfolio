// Chat dialogue data for the ABOUT ME chatbot section
// Bot opening message
export const BOT_OPENING = "Hey! I'm the AI running this portfolio — think of me as your guide. I can tell you about Paolo, or point you toward the good stuff. What do you want to know?";

// User selectable options (shown as buttons)
export const USER_OPTIONS = [
  {
    id: 'story',
    label: "What's your story?",
    // This option has no CTA - it's pure flavor/personality content
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
        target: 'professional', // navigates to Professional Experience section
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
        target: 'education', // navigates to Education section
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
        target: 'contact', // navigates to Contact section
      },
    },
  },
];

// Wrap-up message shown after all 4 options have been visited at least once
export const BOT_WRAPUP = "That's the full rundown from me. Feel free to revisit anything, or head to the contact page — I'd genuinely like to hear from you.";

// Restart button label
export const RESTART_LABEL = "Restart conversation";

// Bot name for display
export const BOT_NAME = "PORTFOLIO AI";

// User name for display (the site visitor)
export const USER_NAME = "YOU";