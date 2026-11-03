export const keywordsEn = {
  search_bar: {
    placeholder: "Enter a keyword",
    validation_required: "Please enter at least one keyword.",
    validation_max: "Please enter no more than {max} keywords (one per line).",
    city_tooltip:
      "Get search volume for one city, county, or region. Leave empty for the whole country.",
    city_placeholder: "City (optional)",
    local_volume_cost: "Local volume adds ~${cost} per search.",
    aria_label: "Keywords",
    search_button: "Search",
    google_ads_notice:
      "Keyword data for this country comes from Google Ads — search volume, CPC, and trends are available, but difficulty and intent are not.",
    options_button: "Options",
  },
  results: {
    serp: {
      retry: "Retry",
      page_header: "Page",
      show_top_20: "Show top 20",
      title: "SERP Analysis",
      organic_results: "{count} organic results",
      no_serp_title: "No SERP details available for this keyword yet.",
      no_serp_desc: "Try clicking another keyword to load data.",
      load_top_100: "Load top 100",
    },
    filters: {
      search_volume: "Search Volume",
      include_terms: "Include Terms",
      include_placeholder: "audit, checker, template",
      exclude_terms: "Exclude Terms",
      exclude_placeholder: "jobs, salary, course",
      cpc_usd: "CPC (USD)",
      difficulty: "Difficulty",
      intent: "Intent",
    },
    mobile_tabs: {
      keywords: "Keywords ({count})",
      serp: "SERP Analysis",
    },
    approximate_notice:
      'No exact match for "{keyword}". Showing closest related keywords instead.',
    table: {
      selected_count: "{count} selected",
      showing_filtered: "Showing {count} of {total} keywords",
      showing_count: "Showing {count} keywords",
      save_keywords: "Save Keywords",
      save: "Save",
      export_sheets: "Export to Sheets",
      export_csv: "Export CSV",
      columns: {
        keyword: "Keyword",
        volume: "Volume",
        cpc: "CPC",
        cpc_help: "Cost per click in USD.",
        competition: "Comp.",
        competition_help:
          "Paid-search competition from Google Ads (0-1): higher means more advertisers bidding.",
        score: "Score",
        score_help:
          "Organic ranking difficulty (0-100): higher means harder to reach Google's top 10.",
        intent: "Intent",
      },
      shared_volume_tooltip:
        "{keyword}: matching reported volume with {parent}. Shared volumes may overlap.",
      no_keywords: "No keywords",
    },
    search_trends: "Search Trends",
  },
  intents: {
    informational: {
      short: "Info",
      label: "Informational",
      description:
        "The searcher wants information or answers. Use this for educational content, guides, and comparison-light explainers.",
    },
    commercial: {
      short: "Comm",
      label: "Commercial",
      description:
        "The searcher is researching options before a purchase. Treat this as buying intent for comparisons, alternatives, and product-led pages.",
    },
    transactional: {
      short: "Trans",
      label: "Transactional",
      description:
        "The searcher is ready to complete an action, often a purchase. Prioritize clear offers, pricing, trials, or conversion paths.",
    },
    navigational: {
      short: "Nav",
      label: "Navigational",
      description:
        "The searcher is looking for a specific site, brand, or page. These queries usually reward matching the expected destination.",
    },
    unknown: {
      short: "?",
      label: "Unknown",
      description:
        "Intent was not available for this keyword, so avoid making content strategy decisions from this badge alone.",
    },
  },
  overview: {
    vol: "Vol",
    cpc: "CPC",
    comp: "Comp",
  },
  empty: {
    no_results_title: "Not enough keyword data for this query yet",
    no_results_desc:
      'We could not find keyword opportunities for "{keyword}" in {location}.',
    start_title: "Enter a keyword to get started",
    start_desc:
      "Search for any keyword to see volume, difficulty, CPC, and related keyword ideas.",
  },
  title: "Keyword Research",
  description:
    "Discover keyword ideas, search demand, and ranking opportunities.",
  recent_searches: "Recent searches",
  dialog: {
    title_singular: "Save 1 Keyword",
    title_plural: "Save {count} Keywords",
    info: "These keywords will be saved to your current project.",
    local_note:
      "Saved keywords show national metrics. The local volume for {location} is not saved.",
    saved_singular: "Saved 1 keyword",
    saved_plural: "Saved {count} keywords",
  },
  options: {
    results_item: "{count} results",
    sources: {
      auto: "Auto",
      suggestions: "Phrase match",
      ideas: "Category ideas",
      related: "People also search for",
    },
    google_ads_only_note:
      "Not available for countries served from Google Ads data.",
    title: "Search options",
    done: "Done",
    results_label: "Results",
    source_label: "Keyword source",
    clickstream_label: "Clickstream-refined volumes",
    clickstream_local_help:
      "Not available for local results. Clickstream data covers whole countries only.",
    clickstream_help:
      "Google reports one combined volume for similar keywords. This estimates each keyword's own volume. Costs 2x the credits.",
    group_keywords_label: "Group keywords",
  },
};
