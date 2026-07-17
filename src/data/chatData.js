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
      text: `Comp Eng grad from University of San Carlos, Cebu — walked the stage July 2026. I got into tech the usual way: wanting to know why things break, and getting a weird satisfaction from tracing a bug back to its actual root cause instead of just patching the symptom.

Outside of work I'm a competitive Pokemon player (currently grinding Masterball rank) and yes — I built an entire turn-based RPG battle system just to make this portfolio less boring. You're standing in it right now.`,
      cta: null,
    },
  },
  {
    id: 'work',
    label: "What kind of work do you do?",
    botResponse: {
      text: `Spent my internship at Accenture making AI agents behave — specifically Salesforce Agentforce. Turns out getting an AI to follow instructions instead of improvising is a full discipline: schema compliance, knowledge workflows, dashboards, the works.

There's a lot more detail on the actual page if you want the full breakdown.`,
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
      text: `University of San Carlos, Cebu City — BS Computer Engineering. The thing that stuck with me most wasn't a specific class, it was learning to trace problems back to their core instead of guessing. That habit followed me straight into my internship work.`,
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
      text: `I'm actively looking for opportunities right now, so — good timing. Fastest way to reach me is email or LinkedIn, both linked on the contact page. Always happy to talk shop about Salesforce, Agentforce, or why I decided a portfolio needed boss battles.`,
      cta: {
        label: "Go to contact info →",
        target: 'contact', // navigates to Contact section
      },
    },
  },
];

// Wrap-up message shown after all 4 options have been visited at least once
export const BOT_WRAPUP = "That's the full rundown from me. Feel free to revisit anything, or just hit up the contact page — I promise I don't bite. (I'm a chatbot. I can't bite.)";

// Restart button label
export const RESTART_LABEL = "Restart conversation";

// Bot name for display
export const BOT_NAME = "PORTFOLIO AI";

// User name for display (the site visitor)
export const USER_NAME = "YOU";