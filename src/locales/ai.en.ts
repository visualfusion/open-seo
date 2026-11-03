import { aiDetailsEn } from "./aiDetails.en";
export const aiEn = {
  agent_list: {
    or_any_client: "or any MCP client",
  },
  setup: {
    title: "Set up your agent",
    instructions: "Setup instructions",
    description:
      "Paste the setup prompt into your agent to connect OpenSEO and install its SEO skills. It will guide you through any manual steps.",
    copy_button: "Copy setup prompt",
    copy_success: "Setup prompt copied",
    coach_hint_prefix: "Once connected, ask your agent to use ",
    coach_hint_link: "SEO Coach",
    coach_hint_suffix: " to help you choose what to do next.",
  },
  panel: {
    description:
      "Paste this prompt into your agent to automatically configure OpenSEO for you.",
    plugin_title: "OpenSEO plugin",
    plugin_subtitle: "MCP connection + SEO skills",
    copy_button: "Copy setup prompt",
    copy_success: "Setup prompt copied",
    manual_setup: "Manual setup",
  },
  onboarding: {
    go_to_dashboard: "Go to dashboard",
  },
  title: "Agent setup",
  description:
    "The most powerful way to use OpenSEO is through the AI agent you already use. Set it up once, then ask it anything.",
  tabs: {
    setup: "Set up your agent",
    skills: "Skills",
  },
  update: {
    title: "Update your skills",
    description:
      "Already connected? Paste the update prompt into your agent to get the latest OpenSEO skills while preserving your connection settings and personal edits.",
    copy_button: "Copy update prompt",
    copy_success: "Update prompt copied",
    instructions: "Update instructions",
  },
  cloudflare_alert:
    "This instance is behind Cloudflare Access. MCP clients cannot connect until Managed OAuth is enabled on your Access application.",
  cloudflare_guide: "Setup guide",
  mcp_url_label: "MCP server URL for this instance:",
  mcp_url_copied: "MCP URL copied",
  skills: {
    intro:
      "The setup prompt installs these. Run one by name when you want a full report instead of a quick answer.",
    "seo-coach": "Explains where you stand and picks your next step.",
    "seo-project-setup":
      "Saves your goals, competitors, and key pages as shared context.",
    "seo-audit":
      "One-page site audit built around a single do-this-week action.",
    "ai-visibility-audit":
      "Finds the few changes most likely to get you cited in AI answers.",
    "ai-prompt-research":
      "Finds what people ask ChatGPT about your market and who gets cited.",
    "keyword-research": "Finds keyword opportunities from a few seed topics.",
    "keyword-clustering": "Groups keywords by intent and maps them to pages.",
    "competitive-landscape": "Maps who wins in your market and why.",
    "competitor-analysis":
      "Studies one competitor's keywords, content, and backlinks.",
    "link-prospecting": "Finds link prospects and drafts outreach.",
    "local-seo": "Audits a Google Business Profile and Maps visibility.",
    "seo-report": "Saves any of the above as a report on your Reports page.",
  },
  details: aiDetailsEn,
};
