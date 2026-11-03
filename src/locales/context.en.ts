export const contextEn = {
  competitors: {
    domain_placeholder: "competitor.com",
    title: "Competitors",
    hint: "The sites you measure yourself against.",
    add_button: "Add competitor",
    empty_title: "No competitors yet",
    empty_desc:
      "Add the sites you compete with, or ask your agent to find them from your rankings and save them here.",
    domain_aria: "Competitor domain",
    name_placeholder: "Name (optional)",
    name_aria: "Competitor name",
    notes_placeholder:
      "Why they matter — e.g. wins every comparison keyword (optional)",
    notes_aria: "Competitor notes",
  },
  market: {
    country: "Country",
    language: "Language",
  },
  website_gate: {
    load_failed: "Couldn't load your project.",
  },
  saved: "Project context saved",
  website_setup: {
    title: "Set up AI visibility",
    subtitle:
      "We’ll research your brand and find the most relevant topics to monitor.",
    url_label: "Website URL",
    url_placeholder: "Enter your website URL",
    error_credits_title: "We couldn’t research this website",
    error_generic:
      "We couldn’t research this website. Check the URL and provider settings, then try again.",
    submit: "Start research",
    footnote_gateway:
      "Research and a first run of your prompts use the DataForSEO and OpenRouter keys on your Every App gateway.",
    footnote_credits:
      "Research and a first run of your prompts use a small amount of usage credits.",
    competitor_name_aria: "Competitor {index} name",
    competitor_name_placeholder: "Competitor name",
    competitor_website_aria: "Competitor {index} website",
    competitor_done_aria: "Done editing competitor",
    competitor_edit_aria: "Edit {name}",
    competitor_remove_aria: "Remove {name}",
    competitor_fallback_name: "competitor {index}",
    step_website: "Researching your website",
    step_competitors: "Finding competitors",
    step_topics: "Preparing topics and prompts",
    step_counter: "Step {current} of {total}",
    duration_note: "This can take up to a minute.",
    review_title_complete: "Complete project setup",
    review_title_competitors: "Edit competitors",
    review_subtitle_before: "You can edit your ",
    review_subtitle_link: "project context",
    review_subtitle_after: " at any time.",
    preserved_competitors:
      "We’ll use the competitors already saved in your project context.",
    col_name: "Name",
    col_website: "Website",
    col_actions: "Actions",
    add_competitor: "Add competitor",
    save_error:
      "We couldn’t save your project. Check the competitor names and websites, then try again.",
    back: "Back",
    continue: "Continue",
  },
  editable_list: {
    edit_aria: "Edit {label}",
    remove_label: "Remove {label}",
  },
  key_pages: {
    role_hub: "Hub page",
    role_spoke: "Supporting page",
    role_money: "Money page",
    role_other: "Other",
    title: "Key pages",
    hint: "A shortlist of the pages that carry the site — not an inventory.",
    add_button: "Add page",
    empty_title: "No key pages yet",
    empty_desc:
      "Add the handful that has to rank, or let an agent propose them from your last site audit.",
    target_prefix: "Target: {topic}",
    url_placeholder: "example.com/pricing",
    url_aria: "Page URL",
    role_aria: "Page role",
    topic_placeholder: "Target topic (optional)",
    topic_aria: "Target topic",
    notes_placeholder: "Notes (optional)",
    notes_aria: "Page notes",
  },
  sections: {
    business_overview: "Business overview",
    business_overview_hint: "What you sell, who buys it, and where.",
    business_overview_placeholder:
      "e.g. Booking software for independent restaurants in the US and Canada. Buyers are owner-operators, not marketers.",
    current_goal: "Current goal",
    current_goal_hint: "What you're pushing for right now, and by when.",
    current_goal_placeholder:
      "e.g. Double organic signups by Q4. Comparison pages are the current bet.",
    positioning: "Positioning",
    positioning_hint: "Why someone picks you over the alternatives.",
    positioning_placeholder:
      "e.g. The only booking tool that sets up in an afternoon. Cheaper than the incumbents, simpler than the DIY stack.",
    writing_preferences: "Writing preferences",
    writing_preferences_hint:
      "Voice, words to avoid, topics that are off-limits.",
    writing_preferences_placeholder:
      "e.g. Plain and direct, no hype. Never say 'seamless' or 'game-changing'. Don't write about competitor pricing.",
  },
  load_failed: "Failed to load project context",
  description:
    "What Claude Code and any other connected MCP client know about this project. They read it before they work and write back what they learn, so correct anything that looks wrong.",
  empty_state_title: "Nothing written down yet",
  empty_state_desc:
    "Fill in what you can — or ask your agent to draft it from your site and confirm what it got right.",
  empty_badge: "Empty",
  save_changes: "Save changes",
  custom_sections: {
    title: "Custom sections",
    title_aria: "Section title",
    hint: "Anything an agent wrote down that didn't fit the sections above.",
    empty_title: "Nothing here yet",
    empty_desc:
      "Agents add a section when they learn something important that has nowhere else to live.",
    edit_aria: "Edit {title}",
    delete_label: "Delete {title}",
    content_aria: "Section content",
  },
  research_log: {
    title: "Research log",
    hint: "What's already been looked up, so nobody buys the same data twice.",
    empty_title: "Nothing logged yet",
    empty_desc: "Agents record paid research here as they run it.",
    delete_label: "Delete log entry from {date}",
  },
  updated: "Project context updated",
  provenance: {
    author_user: "you",
    author_sam: "SAM",
    author_mcp: "your AI client",
    updated_by: "Updated by {author} · {time}",
    added_by: "Added by {author}",
  },
  title: "Context",
};
