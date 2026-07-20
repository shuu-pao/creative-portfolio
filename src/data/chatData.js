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
      text: `I spent 540 hours at Accenture building Salesforce Agentforce agents that run the full support-case lifecycle — create, update, and close — for both internal (Console) and customer-facing (Portal) users, plus account-billing workflows like email verification, monthly statements, and payment plans. I also used Flow and Lightning to automate knowledge articles and case summaries, and rewrote agent instruction logic to stop wrong topic or action selection. The Experience page has the full breakdown.`,
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
      text: `Mostly Salesforce Agentforce — agent actions, Flow logic, and Agent Instructions — plus the languages and web tools around it: JavaScript, Python, React, SQL, and C for embedded work. Beyond that I have hands-on embedded-systems experience (a PIC futsal scoreboard in C) and AI/ML exposure from my YOLOv8 thesis. The Skills page has the full categorized list.`,
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
      text: `The site you're on is one — a from-scratch React/Vite turn-based battle system. On the academic side I built a PIC-based futsal scoreboard in embedded C (real-time timers, 7-segment displays), and co-developed SMARTBIN 3, a YOLOv8 waste-sorting thesis where I diagnosed a flawed approach and proposed the detection-based redesign that cleared a two-month stall.

The Personal Projects page walks through them. (My Agentforce work is on the Experience page — that was my Accenture internship.)`,
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
      text: `I'm actively looking for opportunities right now, so — good timing! I'm especially interested in roles around Salesforce, Agentforce, or building smart customer-experience tooling. If that's the kind of work you're hiring for, I'd genuinely love to talk.`,
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
      text: `I'm actively looking for opportunities right now, so — good timing. Fastest way to reach me is email or LinkedIn, both linked below — and you'll also find my GitHub, Instagram, and a downloadable résumé on the contact page. Always happy to talk Salesforce, Agentforce, or the engineering behind this portfolio.`,
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
